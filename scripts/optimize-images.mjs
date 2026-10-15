import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const targetDirs = [
  'src/Images',
  'src/assets',
  'public/assets/images'
];

async function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(await getFiles(fullPath));
    } else if (/\.(png|jpg|jpeg)$/i.test(item.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function run() {
  console.log('🔍 Scanning images for optimization...');
  let totalSaved = 0;
  let optimizedCount = 0;

  for (const dir of targetDirs) {
    const files = await getFiles(dir);
    for (const file of files) {
      try {
        const stats = fs.statSync(file);
        // Only convert files larger than 400KB
        if (stats.size > 400 * 1024) {
          const webpPath = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          // If webp already exists and is newer, skip
          if (fs.existsSync(webpPath) && fs.statSync(webpPath).mtimeMs >= stats.mtimeMs) {
            continue;
          }

          const beforeMb = stats.size / (1024 * 1024);
          await sharp(file)
            .webp({ quality: 82, effort: 4 })
            .toFile(webpPath);

          const afterStats = fs.statSync(webpPath);
          const afterMb = afterStats.size / (1024 * 1024);
          const savedMb = beforeMb - afterMb;
          totalSaved += savedMb;
          optimizedCount++;

          console.log(`✅ [${path.basename(file)}] ${beforeMb.toFixed(2)} MB ➔ ${afterMb.toFixed(2)} MB (${((1 - afterMb/beforeMb)*100).toFixed(0)}% reduction)`);
        }
      } catch (err) {
        console.warn(`⚠️ Could not optimize ${file}:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Optimization complete: ${optimizedCount} images converted to WebP. Total saved: ${totalSaved.toFixed(2)} MB`);
}

run();
