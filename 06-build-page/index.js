import fs from 'fs/promises';
import { extname, resolve } from 'path';

const projectDistPath = resolve('06-build-page', 'project-dist');
const templatePath = resolve('06-build-page', 'template.html');
const componentsPath = resolve('06-build-page', 'components');
const stylesPath = resolve('06-build-page', 'styles');
const assetsPath = resolve('06-build-page', 'assets');
const outputHtmlPath = resolve(projectDistPath, 'index.html');
const outputCssPath = resolve(projectDistPath, 'style.css');
const outputAssetsPath = resolve(projectDistPath, 'assets');

async function createDistFolder() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true });
  } catch (err) {
    console.error('Error creating project-dist folder:', err);
  }
}

async function buildHtml() {
  try {
    let template = await fs.readFile(templatePath, 'utf-8');
    const tags = template.match(/{{\s*[\w]+\s*}}/g);

    for (const tag of tags || []) {
      const tagName = tag.replace(/{{\s*|\s*}}/g, '');
      const componentPath = resolve(componentsPath, `${tagName}.html`);

      try {
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        template = template.replace(new RegExp(tag, 'g'), componentContent);
      } catch (err) {
        console.error(`Component ${tagName} not found`);
      }
    }

    await fs.writeFile(outputHtmlPath, template);
  } catch (err) {
    console.error('Error building HTML:', err);
  }
}

async function buildStyles() {
  try {
    const files = await fs.readdir(stylesPath, { withFileTypes: true });
    const cssFiles = files.filter(file => file.isFile() && extname(file.name) === '.css');

    let cssContent = '';
    for (const file of cssFiles) {
      const filePath = resolve(stylesPath, file.name);
      const styleContent = await fs.readFile(filePath, 'utf-8');
      cssContent += styleContent + '\n';
    }

    await fs.writeFile(outputCssPath, cssContent);
  } catch (err) {
    console.error('Error building CSS:', err);
  }
}

async function copyAssets(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = resolve(src, entry.name);
      const destPath = resolve(dest, entry.name);

      if (entry.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Error copying assets:', err);
  }
}

async function buildPage() {
  try {
    await createDistFolder();
    await buildHtml();
    await buildStyles();
    await copyAssets(assetsPath, outputAssetsPath);

    console.log('Page successfully built!');
  } catch (err) {
    console.error('Error building the page:', err);
  }
}

buildPage();
