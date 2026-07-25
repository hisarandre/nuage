// scripts/set-env.js
const fs = require('fs');

const targetPath = './src/environment/environment.ts';

console.log('SUPABASE_URL brut:', JSON.stringify(process.env['SUPABASE_URL']));
console.log('SUPABASE_ANON brut:', JSON.stringify(process.env['SUPABASE_ANON']));

const envFileContent = `export const environment = {
  production: true,
  SUPABASE_URL: '${process.env['SUPABASE_URL']}',
  SUPABASE_ANON: '${process.env['SUPABASE_ANON']}',
};
`;

fs.writeFileSync(targetPath, envFileContent);
console.log(`Fichier ${targetPath} généré avec succès.`);
