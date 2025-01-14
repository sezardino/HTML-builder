import { createWriteStream, promises as fsPromises } from 'fs';
import { extname, join, resolve } from 'path';

const stylesFolder = resolve('05-merge-styles', 'styles');
const outputFolder = resolve('05-merge-styles', 'project-dist');
const bundleFile = resolve(outputFolder, 'bundle.css');

const isCSSFile = (fileName) => extname(fileName) === '.css';

const buildCSSBundle = async () => {
  try {
    await fsPromises.mkdir(outputFolder, { recursive: true });
    const files = await fsPromises.readdir(stylesFolder, { withFileTypes: true });
    const writeStream = createWriteStream(bundleFile);

    for (const file of files) {
      if (file.isFile() && isCSSFile(file.name)) {
        const filePath = join(stylesFolder, file.name);
        const data = await fsPromises.readFile(filePath, 'utf-8');
        writeStream.write(data + '\n');
      }
    }

    writeStream.end();
    console.log('Build complete: bundle.css created.');
  } catch (err) {
    console.error('Error during styles bundling:', err);
  }
};

buildCSSBundle();
