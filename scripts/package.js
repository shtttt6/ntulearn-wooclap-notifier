const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifest.json'), 'utf8'));
const version = manifest.version || '1.0.0';
const zipName = `ntulearn-wooclap-notifier-v${version}.zip`;
const zipPath = path.join(distDir, zipName);

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

const itemsToPack = ['manifest.json', 'assets', 'src', 'README.md', 'LICENSE'];

console.log(`Packaging ${zipName}...`);

let packaged = false;

// Try bsdtar / tar -a (built-in on Windows 10/11 and modern environments)
try {
  execSync(`tar -a -c -f "${zipPath}" ${itemsToPack.join(' ')}`, {
    cwd: rootDir,
    stdio: 'ignore',
  });
  packaged = true;
} catch {
  // Fallback to powershell on Windows or zip on Unix
  try {
    if (process.platform === 'win32') {
      const itemsList = itemsToPack.map((item) => `'${item}'`).join(',');
      execSync(`powershell -Command "Compress-Archive -Path ${itemsList} -DestinationPath '${zipPath}' -Force"`, {
        cwd: rootDir,
        stdio: 'ignore',
      });
      packaged = true;
    } else {
      execSync(`zip -r "${zipPath}" ${itemsToPack.join(' ')}`, {
        cwd: rootDir,
        stdio: 'ignore',
      });
      packaged = true;
    }
  } catch (err) {
    console.error('Failed to create zip archive:', err.message);
    process.exit(1);
  }
}

if (packaged && fs.existsSync(zipPath)) {
  const stats = fs.statSync(zipPath);
  console.log(`Successfully created ${path.relative(rootDir, zipPath)} (${(stats.size / 1024).toFixed(1)} KB)`);
} else {
  console.error('Packaging failed: destination zip was not created.');
  process.exit(1);
}
