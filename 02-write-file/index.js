import { createWriteStream } from 'fs';
import { resolve } from 'path';

const FILE_NAME = 'file-to-write.txt';
const filePath = resolve('./02-write-file', FILE_NAME);

const writeStream = createWriteStream(filePath, { flags: 'w' });

writeStream.on('error', (error) => {
  console.error('Error writing to the file:', error.message);
  throw new Error('FS operation failed');
});

console.log(
  'Start typing to write to the file. Press Ctrl+C or type "exit" to quit.',
);

process.stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    writeStream.end();
    process.exit();
  }

  writeStream.write(input + '\n');
});

process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  writeStream.end();
  process.exit();
});
