const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const source=readFileSync('reference/original.test.cjs','utf8');
const originalFs={...require('node:fs'),readFileSync(path,...args){return readFileSync(path==='dist/app.js'?'reference/app.js':path,...args);}};
vm.runInNewContext(source,{require:name=>name==='node:fs'?originalFs:require(name),console},{filename:'reference/original.test.cjs'});
