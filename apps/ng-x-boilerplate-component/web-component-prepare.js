const fs = require('fs');
const path = require('path');

function concatJsFiles(directory, prefix = 'x') {
  const filesToConcat = ['runtime.js', 'polyfills.js', 'scripts.js'];
  const concatenatedContent = [];

  filesToConcat.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      concatenatedContent.push(fileContent);
    } else {
      console.error(
        `Failure: File ${fileName} not found in directory ${directory}`,
      );
    }
  });

  const outputFilePath = path.join(directory, `${prefix}-core.js`);
  const concatenatedContentStr = concatenatedContent.join('\n');

  fs.writeFileSync(outputFilePath, concatenatedContentStr, 'utf8');

  console.log(
    `Success: Files concatenated. ${prefix}-core.js created at ${outputFilePath}`,
  );

  return filesToConcat; // Returning the list of files to delete
}

function deleteJsFiles(directory, filesToDelete) {
  filesToDelete.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Success: File ${fileName} deleted.`);
    } else {
      console.error(
        `Failure: File ${fileName} not found in directory ${directory}`,
      );
    }
  });
}

function renameMainJsFile(directory, packName) {
  const oldFileName = 'main.js';
  const newFileName = `${packName}.js`;
  const oldFilePath = path.join(directory, oldFileName);
  const newFilePath = path.join(directory, newFileName);

  if (fs.existsSync(oldFilePath)) {
    fs.renameSync(oldFilePath, newFilePath);
    console.log(`Success: File renamed, ${oldFileName} to ${newFileName}`);
  } else {
    console.error(
      `Failure: File ${oldFileName} not found in directory ${directory}`,
    );
  }
}

function renameIndexHtml(directory, packName) {
  const indexPath = path.join(directory, `index.${packName}.html`);
  const newPath = path.join(directory, 'index.html');
  if (fs.existsSync(indexPath)) {
    fs.renameSync(indexPath, newPath);
    console.log(`Success: index.${packName}.html renamed to index.html.`);
  } else {
    console.error(
      `Failure: index.${packName}.html not found in directory ${directory}`,
    );
  }
}

function editIndexHtmlJs(directory, prefix = 'x') {
  const indexPath = path.join(directory, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    // Replace the script tags with {prefix}-core.js
    indexContent = indexContent.replace(
      /<script.*?runtime.js.*?<\/script>/g,
      '',
    );
    indexContent = indexContent.replace(
      /<script.*?polyfills.js.*?<\/script>/g,
      '',
    );
    indexContent = indexContent.replace(
      /<script.*?scripts.js.*?<\/script>/g,
      '',
    );
    indexContent = indexContent.replace(
      '</body>',
      `<script src="${prefix}-core.js" type="module"></script>\n</body>`,
    );

    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`Success: index.html (JS) edited.`);
  } else {
    console.error(`Failure: index.html not found in directory ${directory}`);
  }
}

function editIndexHtmlJsMain(directory, packName) {
  const indexPath = path.join(directory, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    // Replace the script tags with {packName}.js
    indexContent = indexContent.replace(/<script.*?main.js.*?<\/script>/g, '');
    indexContent = indexContent.replace(
      '</body>',
      `<script src="${packName}.js" type="module"></script>\n</body>`,
    );

    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`Success: index.html (JS main) edited.`);
  } else {
    console.error(`Failure: index.html not found in directory ${directory}`);
  }
}

function editIndexHtmlCss(directory, prefix = 'x') {
  const indexPath = path.join(directory, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    // Extract content from style tag
    const styleTagRegex = /<style>([\s\S]*?)<\/style>/g;
    let styleContent = '';
    let match;
    while ((match = styleTagRegex.exec(indexContent)) !== null) {
      styleContent += match[1];
    }

    // Prepend style content to {prefix}-core.css
    const stylesCssPath = path.join(directory, `${prefix}-core.css`);
    if (fs.existsSync(stylesCssPath)) {
      let existingStyles = fs.readFileSync(stylesCssPath, 'utf8');
      // Prepend new content
      const updatedStyles = styleContent + existingStyles;
      fs.writeFileSync(stylesCssPath, updatedStyles, 'utf8');
      console.log(`Success: Style content prepended to ${prefix}-core.css.`);
    } else {
      console.error(
        `Failure: ${prefix}-core.css not found in directory ${directory}`,
      );
    }

    // Remove style tag
    indexContent = indexContent.replace(/<style>[\s\S]*?<\/style>/g, '');

    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`Success: index.html (CSS) edited.`);
  } else {
    console.error(`Failure: index.html not found in directory ${directory}`);
  }
}

function deleteAssetFolders(directory, prefix = 'x') {
  const assetsPath = path.join(directory, `${prefix}-assets`);
  const foldersToDelete = ['icons'];

  foldersToDelete.forEach((folderName) => {
    const folderPath = path.join(assetsPath, folderName);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true });
      console.log(`Success: Folder ${folderName} deleted.`);
    } else {
      console.error(
        `Warning: Folder ${folderName} not found in directory ${assetsPath}`,
      );
    }
  });
}

// Get the arguments passed to the script
const args = process.argv.slice(2);
const packName = args[1];

// Call functions
const directory = `dist/apps/ng-x-boilerplate-component/${packName}`;
const filesToDelete = concatJsFiles(directory, 'x');
deleteJsFiles(directory, filesToDelete);
renameMainJsFile(directory, packName);
renameIndexHtml(directory, packName);
editIndexHtmlJs(directory, 'x');
editIndexHtmlJsMain(directory, packName);
editIndexHtmlCss(directory, 'x');
deleteAssetFolders(directory, 'x');
