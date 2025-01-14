import fs from 'fs/promises';
import path from 'path';

const DIR_NAME = 'files';
const COPY_DIR_NAME = 'files-copy';
const directoryToCopy = path.resolve('./04-copy-directory', DIR_NAME);
const destinationToCopy = path.resolve('./04-copy-directory', COPY_DIR_NAME);

const copy = async () => {
    try {
        await fs.access(directoryToCopy);
    } catch (error) {
        throw new Error('FS operation failed: source directory does not exist');
    }

    try {
        await fs.access(destinationToCopy);
        await fs.rm(destinationToCopy, { recursive: true, force: true });
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw new Error('FS operation failed: unexpected error during access check');
        }
    }

    const files = await fs.readdir(directoryToCopy, { withFileTypes: true });

    await fs.mkdir(destinationToCopy, { recursive: true });

    await Promise.all(
        files.map(async (file) => {
            const srcFile = path.join(directoryToCopy, file.name);
            const destFile = path.join(destinationToCopy, file.name);

            if (file.isDirectory()) {
                await copyDir(srcFile, destFile);
            } else {
                await fs.copyFile(srcFile, destFile);
            }
        })
    );

    console.log('Files copied successfully');
};

const copyDir = async (src, dest) => {
    const files = await fs.readdir(src, { withFileTypes: true });
    await fs.mkdir(dest, { recursive: true });

    await Promise.all(
        files.map(async (file) => {
            const srcFile = path.join(src, file.name);
            const destFile = path.join(dest, file.name);

            if (file.isDirectory()) {
                await copyDir(srcFile, destFile);
            } else {
                await fs.copyFile(srcFile, destFile);
            }
        })
    );
};

await copy();
