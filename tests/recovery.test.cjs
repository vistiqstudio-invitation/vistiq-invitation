/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS is required by this isolated Node/VM test harness. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

function load(file, stubs = {}, globals = {}) {
  const filename = path.resolve(__dirname, '..', file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const context = {
    exports: mod.exports, module: mod, console, process, Buffer, Request, Response,
    URL, Headers, File, AbortSignal, crypto: require('node:crypto').webcrypto,
    require(name) {
      if (name === 'server-only') return {};
      if (name in stubs) return stubs[name];
      if (name === 'next/server') return { NextResponse: { json: Response.json } };
      if (name.startsWith('@/')) return load(name.slice(2) + '.ts', stubs, globals);
      return require(name);
    },
    ...globals,
  };
  vm.runInNewContext(compiled, context, { filename });
  return mod.exports;
}

function dbStub({ user = { id: 'owner' }, role = 'owner', rows = [], rpcError = null } = {}) {
  const db = {
    auth: { getUser: async () => ({ data: { user } }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { role } }) }) }) }),
    rpc: async () => ({ data: rows, error: rpcError }),
    storage: { from: () => ({ remove: async (files) => { db.removed.push(...files); return { data: files }; } }) },
    removed: [],
  };
  return db;
}

function cleanup(db, fetch) {
  return load('app/api/admin/storage-cleanup/route.ts', {
    '@/lib/supabase/server': { createClient: async () => db },
    '@/lib/r2': { r2PublicUrl: (key) => 'https://media.example/' + key },
    '@/lib/verifiedLegacyMedia': { VERIFIED_LEGACY_MEDIA: [{ name: 'test/a.jpg', bytes: 10 }] },
  }, { fetch });
}
function request(action = 'check', confirmation, origin = 'https://vistiqinvitation.com') {
  return new Request('https://vistiqinvitation.com/api/admin/storage-cleanup', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, offset: 0, confirmation }),
  });
}

const file = { name: 'test/a.jpg', bytes: 10, referenced: false, source_exists: true };
const headOk = async () => new Response(null, { status: 200, headers: { 'content-length': '10' } });

test('cleanup rejects cross-origin, anonymous and non-owner requests', async () => {
  assert.equal((await cleanup(dbStub(), headOk).POST(request('check', null, 'https://evil.example'))).status, 403);
  assert.equal((await cleanup(dbStub({ user: null }), headOk).POST(request())).status, 401);
  assert.equal((await cleanup(dbStub({ role: 'reseller' }), headOk).POST(request())).status, 403);
});

test('already removed sources are counted without any network or deletion', async () => {
  const db = dbStub({ rows: [{ ...file, source_exists: false }] });
  const handler = cleanup(db, async () => { throw new Error('must not fetch'); });
  const result = await (await handler.POST(request())).json();
  assert.equal(result.alreadyRemoved, 1);
  assert.equal(result.eligible, 0);
  assert.equal(result.blocked.length, 0);
  assert.equal(db.removed.length, 0);
});

test('cleanup check never deletes and deletion requires explicit confirmation', async () => {
  const db = dbStub({ rows: [file] });
  const handler = cleanup(db, headOk);
  assert.equal((await (await handler.POST(request())).json()).eligible, 1);
  assert.equal(db.removed.length, 0);
  assert.equal((await handler.POST(request('delete'))).status, 400);
  assert.equal(db.removed.length, 0);
  const result = await (await handler.POST(request('delete', 'DELETE_VERIFIED_SUPABASE_COPIES'))).json();
  assert.equal(result.removed, 1);
  assert.equal(db.removed[0], file.name);
});

test('referenced, changed, missing manifest and failed reference checks fail closed', async () => {
  for (const rows of [[{ ...file, referenced: true }], [{ ...file, bytes: 11 }], []]) {
    const db = dbStub({ rows });
    const result = await (await cleanup(db, headOk).POST(request('delete', 'DELETE_VERIFIED_SUPABASE_COPIES'))).json();
    assert.equal(result.blocked.length, 1);
    assert.equal(db.removed.length, 0);
  }
  const db = dbStub({ rpcError: new Error('unavailable') });
  assert.equal((await cleanup(db, headOk).POST(request())).status, 500);
  assert.equal(db.removed.length, 0);
});

test('wrong R2 byte count blocks deletion', async () => {
  const db = dbStub({ rows: [file] });
  const handler = cleanup(db, async () => new Response(null, { headers: { 'content-length': '9' } }));
  const result = await (await handler.POST(request('delete', 'DELETE_VERIFIED_SUPABASE_COPIES'))).json();
  assert.equal(result.blocked.length, 1);
  assert.equal(db.removed.length, 0);
});

test('payment readiness requires keys and an explicit valid mode', () => {
  const names = ['MIDTRANS_SERVER_KEY','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_SUPABASE_URL','MIDTRANS_IS_PRODUCTION','MIDTRANS_SIGNATURE_SECRET_KEY'];
  const previous = names.map((name) => process.env[name]);
  try {
    const { paymentConfigurationStatus } = load('lib/paymentConfiguration.ts');
    for (const name of names) delete process.env[name];
    assert.equal(paymentConfigurationStatus().ready, false);
    process.env.MIDTRANS_SERVER_KEY = 'test-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    assert.equal(paymentConfigurationStatus().ready, false);
    process.env.MIDTRANS_IS_PRODUCTION = 'yes';
    assert.equal(paymentConfigurationStatus().ready, false);
    process.env.MIDTRANS_IS_PRODUCTION = 'true';
    assert.equal(paymentConfigurationStatus().mode, 'production');
    assert.equal(paymentConfigurationStatus().ready, false);
    assert.ok(paymentConfigurationStatus().missing.includes('MIDTRANS_SIGNATURE_SECRET_KEY'));
    process.env.MIDTRANS_SIGNATURE_SECRET_KEY = 'test-signature-secret';
    assert.equal(paymentConfigurationStatus().ready, true);
    process.env.MIDTRANS_IS_PRODUCTION = 'false';
    assert.equal(paymentConfigurationStatus().mode, 'sandbox');
  } finally {
    names.forEach((name, i) => previous[i] === undefined ? delete process.env[name] : process.env[name] = previous[i]);
  }
});

test('media uploads require same-origin and an authorized account', async () => {
  const handler = load('app/api/media/presign/route.ts', {
    '@/lib/supabase/server': { createClient: async () => dbStub({ user: null }) },
    '@/lib/r2': {},
  });
  for (const method of ['POST', 'PUT']) {
    const make = (origin) => new Request('https://vistiqinvitation.com/api/media/presign', { method, headers: { Origin: origin } });
    assert.equal((await handler[method](make('https://evil.example'))).status, 403);
    assert.equal((await handler[method](make('https://vistiqinvitation.com'))).status, 401);
  }
});

test('infrastructure subdomains remain reserved and worker previews are platform hosts', () => {
  const { validateSubdomain, isPlatformHostname } = load('lib/customDomain.ts');
  for (const name of ['media', 'cdn', 'preview', 'staging']) assert.ok(validateSubdomain(name));
  assert.equal(validateSubdomain('my-brand'), null);
  assert.equal(isPlatformHostname('vistiq-recovery-preview.vistiqstudio.workers.dev'), true);
  assert.equal(isPlatformHostname('other.workers.dev'), false);
  assert.equal(isPlatformHostname('brand.vistiqinvitation.com'), false);
});

test('system status is owner-only and contains no secret values', async () => {
  const stub = { '@/lib/supabase/server': { createClient: async () => dbStub({ role: 'reseller' }) } };
  assert.equal((await load('app/api/admin/system-status/route.ts', stub).GET()).status, 403);
  stub['@/lib/supabase/server'].createClient = async () => dbStub();
  const response = await load('app/api/admin/system-status/route.ts', stub).GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const data = await response.json();
  assert.equal(typeof data.adminServer.configured, 'boolean');
  assert.equal(Object.keys(data.media).sort().join(','), 'configured,missing');
});


test('malformed Unicode payment signatures are rejected without a server exception', async () => {
  const previous = process.env.MIDTRANS_SIGNATURE_SECRET_KEY;
  process.env.MIDTRANS_SIGNATURE_SECRET_KEY = 'test-signature-key';
  try {
    const route = load('app/api/payments/notification/route.ts', {
      '@/lib/paymentPackages': {},
      '@/lib/provisionPaidOrder': {},
      '@/lib/paymentWhatsApp': {},
    });
    const response = await route.POST(new Request('https://vistiqinvitation.com/api/payments/notification', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: 'VSTQ-RS-test', signature_key: 'é'.repeat(128), gross_amount: '79000', status_code: '200' }),
    }));
    assert.equal(response.status, 403);
  } finally {
    if (previous === undefined) delete process.env.MIDTRANS_SIGNATURE_SECRET_KEY;
    else process.env.MIDTRANS_SIGNATURE_SECRET_KEY = previous;
  }
});

test('payment notifications require the independent signature secret before database writes', async () => {
  const names = ['MIDTRANS_SERVER_KEY', 'MIDTRANS_SIGNATURE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_URL'];
  const previous = names.map(name => process.env[name]);
  try {
    process.env.MIDTRANS_SERVER_KEY = 'new-api-server-key';
    process.env.MIDTRANS_SIGNATURE_SECRET_KEY = 'independent-webhook-secret';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    let databaseCalls = 0;
    const route = load('app/api/payments/notification/route.ts', {
      '@supabase/supabase-js': { createClient: () => {
        databaseCalls++;
        return { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }) };
      } },
      '@/lib/paymentPackages': {}, '@/lib/provisionPaidOrder': {}, '@/lib/paymentWhatsApp': {},
    });
    const body = { order_id: 'VSTQ-IA-test-order', status_code: '200', gross_amount: '20000.00', transaction_status: 'settlement' };
    const signedRequest = (secret, amount = body.gross_amount) => new Request('https://vistiqinvitation.com/api/payments/notification', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, gross_amount: amount, signature_key: require('node:crypto').createHash('sha512').update(body.order_id + body.status_code + body.gross_amount + secret).digest('hex') }),
    });
    let response = await route.POST(signedRequest(process.env.MIDTRANS_SERVER_KEY));
    assert.equal(response.status, 403);
    assert.equal(databaseCalls, 0);
    response = await route.POST(signedRequest(process.env.MIDTRANS_SIGNATURE_SECRET_KEY, '1.00'));
    assert.equal(response.status, 403);
    assert.equal(databaseCalls, 0);
    response = await route.POST(signedRequest(process.env.MIDTRANS_SIGNATURE_SECRET_KEY));
    assert.equal(databaseCalls, 1);
    // Valid signature still cannot authorize an unknown transaction.
    assert.equal((await response.json()).error, 'Invalid reseller client transaction');
    delete process.env.MIDTRANS_SIGNATURE_SECRET_KEY;
    response = await route.POST(signedRequest(process.env.MIDTRANS_SERVER_KEY));
    assert.equal(response.status, 503);
    assert.equal(databaseCalls, 1);
  } finally {
    names.forEach((name, index) => previous[index] === undefined ? delete process.env[name] : process.env[name] = previous[index]);
  }
});

test('authorized media rejects unsupported or oversized files before signing', async () => {
  const route = load('app/api/media/presign/route.ts', {
    '@/lib/supabase/server': { createClient: async () => dbStub({ role: 'client' }) },
    '@/lib/r2': { createR2PresignedPutUrl: () => { throw new Error('must not sign'); } },
  });
  for (const [contentType, fileSize, status] of [['text/html', 100, 400], ['image/jpeg', 9*1024*1024, 413], ['audio/mpeg', 16*1024*1024, 413], ['image/png', -1, 400]]) {
    const response = await route.POST(new Request('https://vistiqinvitation.com/api/media/presign', {
      method: 'POST', headers: { Origin: 'https://vistiqinvitation.com', 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType, fileSize }),
    }));
    assert.equal(response.status, status);
  }
});

test('browser upload falls back to same-origin R2 upload when bucket CORS blocks it', async () => {
  const calls = [];
  const { uploadMediaToR2 } = load('lib/uploadMedia.ts', {}, {
    FormData,
    fetch: async (url, init) => {
      calls.push({ url, method: init.method });
      if (init.method === 'POST') return Response.json({ uploadUrl: 'https://r2.example/upload', publicUrl: 'https://media.example/direct.gif' });
      if (url === 'https://r2.example/upload') throw new TypeError('Failed to fetch');
      assert.ok(init.body instanceof FormData);
      return Response.json({ publicUrl: 'https://media.example/fallback.gif' });
    },
  });
  const file = new File(['GIF89a'], 'photo.gif', { type: 'image/gif' });
  assert.equal(await uploadMediaToR2(file, 'gallery', '123'), 'https://media.example/fallback.gif');
  assert.equal(calls.length, 3);
  assert.equal(calls[2].url, '/api/media/presign');
  assert.equal(calls[2].method, 'PUT');
});

test('platform requests cannot supply their own tenant headers', async () => {
  const { proxy } = load('proxy.ts', {
    'next/server': { NextResponse: { next: ({ request }) => ({ headers: request.headers }) } },
    '@supabase/ssr': {},
  }, { fetch: async () => { throw new Error('Platform host must not query a reseller'); } });
  for (const host of ['vistiqinvitation.com', 'vistiq-recovery-preview.vistiqstudio.workers.dev']) {
    const result = await proxy({
      nextUrl: { pathname: '/' },
      headers: new Headers({ host, 'x-vistiq-reseller-id': 'forged', 'x-vistiq-custom-domain': 'fake.example' }),
    });
    assert.equal(result.headers.has('x-vistiq-reseller-id'), false);
    assert.equal(result.headers.has('x-vistiq-custom-domain'), false);
  }
});

test('inactive reseller domains return a neutral 404 and lookup outages return 503', async () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'public-test-key';
  class NextResponse extends Response {}
  try {
    for (const [fetch, expected] of [
      [async () => Response.json([]), 404],
      [async () => new Response(null, { status: 503 }), 503],
    ]) {
      const { proxy } = load('proxy.ts', { 'next/server': { NextResponse }, '@supabase/ssr': {} }, { fetch });
      const result = await proxy({ nextUrl: { pathname: '/' }, headers: new Headers({ host: 'inactive.vistiqinvitation.com' }) });
      assert.equal(result.status, expected);
      assert.match(result.headers.get('cache-control'), /no-store/);
      assert.ok(!(await result.text()).includes('Vistiq'));
    }
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
  }
});

test('origin validation uses public Host behind an internal adapter URL', () => {
  const { isSameOriginRequest } = load('lib/requestOrigin.ts');
  assert.equal(isSameOriginRequest(new Request('https://internal.local/api', {
    headers: { host: 'vistiqinvitation.com', origin: 'https://vistiqinvitation.com' },
  })), true);
  for (const origin of ['https://evil.example', 'null', 'http://vistiqinvitation.com', 'https://vistiqinvitation.com/path']) {
    assert.equal(isSameOriginRequest(new Request('https://internal.local/api', {
      headers: { host: 'vistiqinvitation.com', origin },
    })), false);
  }
});

test('client, reseller and admin invitation share links use the same Vistiq domain', () => {
  const { PUBLIC_INVITATION_ORIGIN, publicInvitationUrl } = load('lib/publicInvitationUrl.ts');
  assert.equal(PUBLIC_INVITATION_ORIGIN, 'https://www.vistiqinvitation.com');
  assert.equal(publicInvitationUrl('lina-rifky'), 'https://www.vistiqinvitation.com/lina-rifky');
  assert.equal(publicInvitationUrl('lina-rifky', 'Bapak Ahmad & Ibu Siti'), 'https://www.vistiqinvitation.com/lina-rifky?to=Bapak%20Ahmad%20%26%20Ibu%20Siti');

  const client = fs.readFileSync(path.resolve(__dirname, '../app/client/page.tsx'), 'utf8');
  const reseller = fs.readFileSync(path.resolve(__dirname, '../app/reseller/invitations/page.tsx'), 'utf8');
  const admin = fs.readFileSync(path.resolve(__dirname, '../app/admin/invitations/page.tsx'), 'utf8');
  assert.match(client, /const invitationUrl=publicInvitationUrl/);
  assert.doesNotMatch(client, /custom_domain_status==="active"/);
  for (const source of [reseller, admin]) {
    assert.match(source, /const url = publicInvitationUrl\(slug\)/);
  }
});
