import * as vscode from 'vscode';
import * as path from 'path';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.pixelart', () => {
    const artsourcePath = vscode.Uri.file(
      path.join(context.extensionPath, 'artsource')
    );

    console.log('artsourcePath:', artsourcePath.fsPath);

    vscode.workspace.fs.readDirectory(artsourcePath).then((files) => {
      const gifFiles = files.filter(([name, type]) => type === vscode.FileType.File && name.endsWith('.gif'));

      console.log('gifFiles:', gifFiles);

      if (gifFiles.length === 0) {
        vscode.window.showErrorMessage('No pixel art GIF files found.');
        return;
      }

      const randomIndex = getRandomInt(gifFiles.length);
      const randomGif = gifFiles[randomIndex];

      console.log('randomGif:', randomGif);

      const jsonFile = vscode.Uri.file(
        path.join(artsourcePath.fsPath, randomGif[0].replace('.gif', '.json'))
      );

      console.log('jsonFile:', jsonFile);

      vscode.workspace.openTextDocument(jsonFile).then((jsonDocument) => {
        console.log('jsonDocument:', jsonDocument);

        const panel = vscode.window.createWebviewPanel(
          'pixelArtPreview',
          'Pixel Art Preview',
          vscode.ViewColumn.Beside,
          {
            enableScripts: true,
          }
        );

        const imageUrl = panel.webview.asWebviewUri(vscode.Uri.file(path.join(artsourcePath.fsPath, randomGif[0])));

        const jsonContent = jsonDocument.getText();
        const { author, source } = JSON.parse(jsonContent);

        const htmlContent = `
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            img {
              max-width: 500px;
              max-height: 500px;
            }
            p {
              margin-top: 16px;
              font-weight: bold;
            }
          </style>
          <body>
            <img src="${imageUrl}" alt="Pixel Art">
            <p>Author: ${author}</p>
            <p>Source: <a href="${source}">${source}</a></p>
          </body>
        `;

        panel.webview.html = htmlContent;

        // Close the JSON file tab
        vscode.window.visibleTextEditors.forEach((editor) => {
          if (editor.document.uri.fsPath === jsonFile.fsPath) {
            vscode.commands.executeCommand('workbench.action.closeActiveEditor');
          }
        });
      });
    });
  });

  context.subscriptions.push(disposable);
}
