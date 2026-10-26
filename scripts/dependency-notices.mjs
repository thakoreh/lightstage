import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
const lock=JSON.parse(readFileSync('package-lock.json','utf8'));
const inventory=Object.entries(lock.packages).filter(([path])=>path).map(([path,pkg])=>({
  path,version:pkg.version,license:pkg.license??null,resolved:pkg.resolved??null,integrity:pkg.integrity??null,optional:pkg.optional??false,
}));
mkdirSync('docs',{recursive:true});
writeFileSync('docs/DEPENDENCIES.json',JSON.stringify({source:'package-lock.json',packages:inventory},null,2)+'\n');
const bundled=['react','react-dom','scheduler'];
const notices=bundled.map(name=>{
  const location=join('node_modules',name);
  const pkg=JSON.parse(readFileSync(join(location,'package.json'),'utf8'));
  return `===== ${name} ${pkg.version} =====\n\n${readFileSync(join(location,'LICENSE'),'utf8').trim()}\n`;
}).join('\n');
writeFileSync('docs/THIRD-PARTY-NOTICES.txt',`Existing licenses for dependencies bundled into the showcase.\nThis file grants no license to LightStage's own code.\n\n${notices}`);
mkdirSync('example/public',{recursive:true});
writeFileSync('example/public/THIRD-PARTY-NOTICES.txt',readFileSync('docs/THIRD-PARTY-NOTICES.txt'));
