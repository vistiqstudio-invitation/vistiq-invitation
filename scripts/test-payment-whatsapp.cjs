// Run: TYPESCRIPT_PATH=/path/to/typescript node scripts/test-payment-whatsapp.cjs
// Tests use local fakes only; no payments or WhatsApp messages are sent.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require(process.env.TYPESCRIPT_PATH || 'typescript');
const root = path.resolve(__dirname, '..');
function moduleFor(file, env, fetcher, modules = {}) {
  const source = fs.readFileSync(path.join(root,file),'utf8');
  const js = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const exports = {};
  const context = {exports,process:{env},fetch:fetcher,AbortSignal,Response,URL,console:{warn(){},error(){}},require:name=>{
    if(name==='server-only') return {};
    if(name in modules) return modules[name];
    throw Error('Unexpected dependency '+name);
  }};
  vm.runInNewContext(js,context,{filename:file}); return exports;
}
const env = {WHATSAPP_ACCESS_TOKEN:'TEST_ONLY_TOKEN',WHATSAPP_PHONE_NUMBER_ID:'123456',WHATSAPP_BUSINESS_ACCOUNT_ID:'654321'};
const job = {id:'test-job',order_id:'VSTQ-RC-TEST12345',customer_name:'Pelanggan\nContoh',amount:100000,payment_type:'qris',recipient:'6281261581332',claim_token:'test-claim'};
const json = (data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
let checks = 0;
function ok(condition,message){assert.ok(condition,message);checks++;}

async function scenario(mode, options={}) {
  let helper, claims=0, sent=0; const updates=[];
  const fetcher = async(url,init)=>{
    assert.equal(init.headers.Authorization,'Bearer TEST_ONLY_TOKEN');
    if(url.includes('display_phone_number')) return json({display_phone_number:options.wrongSender?'+62 812 0000 0000':'+62 813-7133-8032'});
    if(url.includes('message_templates')) return json({data:[{name:helper.PAYMENT_TEMPLATE_NAME,status:options.unapproved?'PENDING':'APPROVED',language:'id',parameter_format:'POSITIONAL',components:[{type:'BODY',text:helper.PAYMENT_TEMPLATE_BODY}]}]});
    sent++; const body=JSON.parse(init.body); assert.equal(body.to,job.recipient); assert.equal(body.type,'template');
    if(mode==='timeout') throw new Error('network timeout');
    if(mode==='reject') return json({error:{code:131000,message:'DO_NOT_LOG_RAW_PROVIDER_TEXT'}},400);
    if(mode==='server') return json({error:{code:1}},500);
    return json({messages:[{id:'wamid.test-only'}]});
  };
  helper=moduleFor('lib/paymentWhatsApp.ts',options.disabled?{}:env,fetcher);
  const db={
    from(table){
      if(table==='payment_whatsapp_settings') return {select(){return this},eq(){return this},async single(){return {data:{enabled:true,sender:'6281371338032',recipient:job.recipient},error:null}}};
      assert.equal(table,'payment_whatsapp_outbox');
      let change;return {update(value){change=value;return this},eq(key,value){if(key==='claim_token')assert.equal(value,job.claim_token);return this},then(resolve){updates.push(change);resolve({error:null})}};
    },
    async rpc(name){assert.equal(name,'claim_payment_whatsapp_jobs');claims++;return {data:[job],error:null}}
  };
  await helper.processPaymentWhatsApp(db);return {helper,claims,sent,updates};
}

(async()=>{
  const disabled=await scenario('ok',{disabled:true});ok(disabled.claims===0&&disabled.sent===0,'Missing credentials must not claim or send');
  const wrong=await scenario('ok',{wrongSender:true});ok(wrong.claims===0&&wrong.sent===0,'Wrong sender must not send');
  const pending=await scenario('ok',{unapproved:true});ok(pending.claims===0&&pending.sent===0,'Unapproved template must not send');
  const success=await scenario('ok');ok(success.sent===1&&success.updates[0].status==='accepted','Record accepted only with a provider ID');
  ok(success.updates[0].provider_message_id==='wamid.test-only','Persist provider message ID');
  const payload=success.helper.paymentWhatsAppPayload(job);ok(payload.template.components[0].parameters[0].text==='Pelanggan Contoh','Normalize template whitespace');
  ok(payload.template.components[0].parameters[1].text==='Rp 100.000','Format exact amount');
  assert.throws(()=>success.helper.paymentWhatsAppPayload({...job,recipient:'628999999999'}));checks++;
  assert.throws(()=>success.helper.paymentWhatsAppPayload({...job,amount:0}));checks++;
  const rejected=await scenario('reject');ok(rejected.updates[0].status==='failed'&&!rejected.updates[0].last_error.includes('DO_NOT_LOG'),'Definite rejection permits safe manual retry without raw logs');
  const timeout=await scenario('timeout');ok(timeout.updates[0].status==='unknown','Timeout must not cause blind resend');
  const server=await scenario('server');ok(server.updates[0].status==='unknown','Server failure is ambiguous');
  for(const role of [null,'reseller','client']){
    const api=moduleFor('app/api/admin/payment-whatsapp/route.ts',{},()=>{throw Error('No external call allowed')},{
      'next/server':{NextResponse:Response,after:()=>{throw Error('Unauthorized background work')}},
      '@supabase/supabase-js':{createClient:()=>{throw Error('Unauthorized service client')}},
      '@/lib/supabase/dal':{getSessionProfile:async()=>role?{role}:null},
      '@/lib/paymentWhatsApp':{}
    });
    ok((await api.GET()).status===403,'Non-owner cannot read settings');
    ok((await api.POST(new Request('https://example.com/api/admin/payment-whatsapp',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"action":"enable"}'}))).status===403,'Non-owner cannot enable notifications');
  }
  console.log(`${checks} payment WhatsApp checks passed; no network messages sent.`);
})().catch(error=>{console.error(error);process.exit(1)});
