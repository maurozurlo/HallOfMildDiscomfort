const fs = require('fs');
const { PNG } = require('pngjs');
const { data, hts_textureData } = require('./rawdata'); // your number[][] arrays

// Make sure `data` and `hts_textureData` match by index
if (data.length !== hts_textureData.length) {
    console.error("Mismatch between pixel arrays and texture info!");
    process.exit(1);
}

hts_textureData.forEach((textureInfo, i) => {
    const pixels = data[i];
    const width = textureInfo.width;
    const height = textureInfo.height;

    // skip invalid textures
    if (!pixels || pixels.length === 0 || width === 0 || height === 0) return;

    const png = new PNG({ width, height });

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const value = pixels[idx] ?? 0;
            const pngIdx = (y * width + x) << 2;
            png.data[pngIdx] = value;
            png.data[pngIdx + 1] = value;
            png.data[pngIdx + 2] = value;
            png.data[pngIdx + 3] = 255;
        }
    }

    const filename = `texture_${i}.png`;
    png.pack().pipe(fs.createWriteStream(filename));
    console.log(`Saved ${filename} (${width}x${height})`);
});
