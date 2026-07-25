const fs = require('fs');

const targetPath = './src/environment/environment.ts';

const envFileContent = `export const environment = {
  production: true,
  SUPABASE_URL: '${process.env['SUPABASE_URL']}',
  SUPABASE_ANON: '${process.env['SUPABASE_ANON']}',
};
`;

fs.writeFileSync(targetPath, envFileContent);
console.log(`Fichier ${targetPath} généré avec succès.`);
