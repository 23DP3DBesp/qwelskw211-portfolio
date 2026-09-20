import fs from 'node:fs/promises';
// dist is generated from the source on every build, including former static builds.
await fs.rm('dist',{recursive:true,force:true});
