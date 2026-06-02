import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, 'public/uploads/farms');
console.log('Upload path:', uploadPath);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('Created directory');
} else {
  console.log('Directory already exists');
}

fs.writeFileSync(path.join(uploadPath, 'test.txt'), 'hello');
console.log('Wrote file');
