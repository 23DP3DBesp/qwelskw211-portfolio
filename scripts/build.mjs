import fs from 'node:fs/promises';
await fs.mkdir('dist/client',{recursive:true});
for(const path of ['index.html','css','js','assets','work'])await fs.cp(path,`dist/client/${path}`,{recursive:true});
