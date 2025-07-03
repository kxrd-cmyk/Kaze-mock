const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = __dirname;
const distPath = path.join(projectRoot, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Files to copy from root to dist
const filesToCopy = [
  'index.html',
  'worker.js',
  'wrangler.jsonc',
  '_routes.json',
  '_headers',
  '_redirects'
];

// Directories to sync
const dirsToSync = [
  'css',
  'js',
  'images',
  'assets'
];

console.log('Updating dist directory...');

// Copy individual files
filesToCopy.forEach(file => {
  const src = path.join(projectRoot, file);
  const dest = path.join(distPath, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Updated: ${file}`);
  }
});

// Sync directories
dirsToSync.forEach(dir => {
  const srcDir = path.join(projectRoot, dir);
  const destDir = path.join(distPath, dir);
  
  if (fs.existsSync(srcDir)) {
    // Remove existing directory if it exists
    if (fs.existsSync(destDir)) {
      fs.rmSync(destDir, { recursive: true, force: true });
    }
    
    // Create directory and copy contents
    fs.mkdirSync(destDir, { recursive: true });
    copyDirSync(srcDir, destDir);
    console.log(`Synced directory: ${dir}`);
  }
});

// Helper function to copy directories recursively
function copyDirSync(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Dist directory updated successfully!');
