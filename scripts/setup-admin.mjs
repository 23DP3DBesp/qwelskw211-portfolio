import {randomBytes,pbkdf2Sync} from 'node:crypto';
import fs from 'node:fs/promises';
// Generated credentials never enter source control or the public build.
const directory='.sites-runtime';await fs.mkdir(directory,{recursive:true});
const configPath=`${directory}/admin-auth.json`;
try{await fs.access(configPath);console.log('Admin credentials already exist in .sites-runtime/admin-credentials.txt');process.exit(0);}catch{}
const password=randomBytes(24).toString('base64url'),salt=randomBytes(16);
const hash=`pbkdf2-sha256-100000:${salt.toString('hex')}:${pbkdf2Sync(password,salt,100000,32,'sha256').toString('hex')}`;
await fs.writeFile(configPath,JSON.stringify({ADMIN_USERNAME:'admin',ADMIN_PASSWORD_HASH:hash},null,2),{mode:0o600,flag:'wx'});
await fs.writeFile(`${directory}/admin-credentials.txt`,`Логин: admin\nПароль: ${password}\n\nВход: https://deniss-editorial-portfolio.mamatkunem0210.chatgpt.site/admin/login\nСохраните данные в менеджере паролей. Не публикуйте этот файл.\n`,{mode:0o600,flag:'wx'});
console.log('Credentials saved privately to .sites-runtime/admin-credentials.txt');
