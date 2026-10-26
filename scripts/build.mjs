import {copyFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist',{recursive:true});copyFileSync('src/style.css','dist/style.css');
mkdirSync('example/public',{recursive:true});copyFileSync('README.md','example/public/README.md');
copyFileSync('docs/THIRD-PARTY-NOTICES.txt','example/public/THIRD-PARTY-NOTICES.txt');
