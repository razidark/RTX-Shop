import fs from 'fs';
import path from 'path';

const urls = {
  'rtx-4090.jpg': 'https://m.media-amazon.com/images/I/81xP3m4QY+L._AC_SL1500_.jpg',
  'ryzen-7950x3d.jpg': 'https://m.media-amazon.com/images/I/51w7wD0Q1hL._AC_SL1500_.jpg',
  'trident-z5.jpg': 'https://m.media-amazon.com/images/I/61U0t4pA90L._AC_SL1500_.jpg',
  'z790.jpg': 'https://m.media-amazon.com/images/I/81B4Bf7M5sL._AC_SL1500_.jpg',
  '990-pro.jpg': 'https://m.media-amazon.com/images/I/71R2H93f1-L._AC_SL1500_.jpg',
  'rm1000x.jpg': 'https://m.media-amazon.com/images/I/71z142eX15L._AC_SL1500_.jpg'
};

async function download() {
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }

  for (const [filename, url] of Object.entries(urls)) {
    try {
      console.log(`Downloading ${filename} from Amazon...`);
      const imgResponse = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
      if (imgResponse.ok) {
        const buffer = await imgResponse.arrayBuffer();
        fs.writeFileSync(path.join('public/images', filename), Buffer.from(buffer));
        console.log(`Saved ${filename}`);
      } else {
        console.log(`Failed to download ${filename}: ${imgResponse.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${filename}:`, e);
    }
  }
}

download();
