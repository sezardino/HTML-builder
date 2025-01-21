import { createReadStream } from 'fs';
import path from 'path';

const filePath = path.resolve('./01-read-file/text.txt');

const readStream = createReadStream(filePath, { encoding: 'utf-8' });

readStream.on('data', (chunk) => process.stdout.write(chunk));

readStream.on('error', (err) => {
  console.error('Error reading file:', err.message);
});
