import {constants,copyFileSync,existsSync,lstatSync,mkdirSync,readFileSync,realpathSync} from 'node:fs';
import {dirname,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const destination=process.argv[2];
if(!destination||process.argv.length!==3) throw new Error('Usage: node install-agent-skill.mjs <consumer-project-directory>');
const root=realpathSync(resolve(destination));
if(!existsSync(join(root,'package.json')))throw new Error('Choose a consumer project containing package.json.');
const segments=['.agents','skills','lightstage'];let directory=root;
for(const segment of segments){
  directory=join(directory,segment);
  if(existsSync(directory)){
    if(lstatSync(directory).isSymbolicLink())throw new Error('Refusing to install through a symlink.');
    const rel=relative(root,realpathSync(directory));
    if(rel==='..'||rel.startsWith(`..${sep}`))throw new Error('Skill destination escapes the consumer project.');
  }else mkdirSync(directory);
}
const source=resolve(dirname(fileURLToPath(import.meta.url)),'../skills/lightstage/SKILL.md');
const target=join(directory,'SKILL.md');
if(existsSync(target)){
  if(lstatSync(target).isSymbolicLink()||readFileSync(target,'utf8')!==readFileSync(source,'utf8'))throw new Error('An existing skill differs; review and merge it manually.');
}else copyFileSync(source,target,constants.COPYFILE_EXCL);
console.log(`LightStage skill ready: ${target}`);
