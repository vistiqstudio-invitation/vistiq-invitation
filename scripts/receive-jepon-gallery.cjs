const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const temp = process.env.RUNNER_TEMP;
const expected = ["66751927af8ed35416ca91150ba1025c84a0696fc524c724ff72362cf9f0b0bd", "c5e43d39a4eff0244ca97c548a61567e55192490296d0bc56dbf362785dc5af8", "03d1ec639880ebbe83d535cd25a5aea97e2589545ee9b0eef74b3db86ba24f27", "5775b06e14bf333ef625467a2977b1e394641291d5c1a234aa93da20aa2c4263", "beebdc06ac0305a227bdecb1d70f6c3424a29125c9b05b0ad8171fe1a049abe9", "994d7534cce217a5e2a5abeb569c4d22509f395f52adfae54d584ce479f53bde", "7c8c675e3b6b3ba0cf164283997f0a6cdbbd3f9727476d103e809a0cf01ffbad"];
const privateKey = crypto.createPrivateKey(fs.readFileSync(path.join(temp, 'gallery-key.pem')));
for (const [index, digest] of expected.entries()) {
  const n = index + 1;
  const payload = fs.readFileSync('transfer/galeri-' + n + '.enc');
  const publicKey = crypto.createPublicKey({key: payload.subarray(0,44), type:'spki',format:'der'});
  const shared = crypto.diffieHellman({privateKey, publicKey});
  const key = crypto.hkdfSync('sha256',shared,Buffer.alloc(0),'Jepon gallery photo '+n,32);
  const decipher = crypto.createDecipheriv('aes-256-gcm',key,payload.subarray(44,56));
  decipher.setAuthTag(payload.subarray(56,72));
  const photo = Buffer.concat([decipher.update(payload.subarray(72)),decipher.final()]);
  if (crypto.createHash('sha256').update(photo).digest('hex') !== digest) throw Error('Unexpected photo '+n);
  fs.writeFileSync(path.join(temp,'galeri-'+n+'.webp'),photo,{mode:0o600});
}
