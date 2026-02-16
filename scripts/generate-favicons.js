const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(__dirname, '..', 'public', 'images', 'jebali_sweet_logo.png');
const PUBLIC = path.join(__dirname, '..', 'public');

async function generate() {
    const src = sharp(SOURCE);

    // 1. favicon.ico (32x32 PNG wrapped — browsers accept PNG in .ico)
    await src.clone().resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png().toFile(path.join(PUBLIC, 'favicon.ico'));
    console.log('✔ favicon.ico (32x32)');

    // 2. icon.png (32x32 for general browser tab)
    await src.clone().resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png().toFile(path.join(PUBLIC, 'icon.png'));
    console.log('✔ icon.png (32x32)');

    // 3. icon-192.png (Android / PWA)
    await src.clone().resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png().toFile(path.join(PUBLIC, 'icon-192.png'));
    console.log('✔ icon-192.png (192x192)');

    // 4. icon-512.png (Android / PWA)
    await src.clone().resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png().toFile(path.join(PUBLIC, 'icon-512.png'));
    console.log('✔ icon-512.png (512x512)');

    // 5. apple-touch-icon.png (180x180 for iOS)
    await src.clone().resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
    console.log('✔ apple-touch-icon.png (180x180)');

    console.log('\n✅ All favicon files generated in /public');
}

generate().catch(err => { console.error(err); process.exit(1); });
