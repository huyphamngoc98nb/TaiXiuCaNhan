const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/store',
  'src/shared/components',
  'src/shared/constants',
  'src/shared/utils',
  'src/shared/types',
  'src/shared/config',
  'src/core/db/sqlite',
  'src/core/db/migrations',
  'src/core/db/repositories',
  'src/core/db/seed',
  'src/core/files',
  'src/core/security',
  'src/core/sync',
  'src/core/telemetry',
  'src/modules/transactions/components',
  'src/modules/transactions/hooks',
  'src/modules/transactions/domain',
  'src/modules/transactions/repositories',
  'src/modules/transactions/services',
  'src/modules/categories',
  'src/modules/reports',
  'src/modules/budgets',
  'src/modules/recurring-bills',
  'src/modules/export',
  'src/modules/backup',
  'src/modules/auth',
  'src/tests'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  fs.writeFileSync(path.join(fullPath, '.gitkeep'), '');
});

console.log('Directories created successfully.');
