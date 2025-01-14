import fs from 'fs/promises';
import path from 'path';

const folderPath = path.join('./03-files-in-folder', 'secret-folder');

const displayFileInfo = async () => {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stats = await fs.stat(filePath);
        const extname = path.extname(file.name).slice(1);
        const size = (stats.size / 1024).toFixed(3);

        console.log(`${file.name} - ${extname} - ${size}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
};

displayFileInfo();
