import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.pixelart', () => {
        const artFolder = vscode.Uri.file(
            path.join(context.extensionPath, 'artsource')
        );
        vscode.workspace.fs.readDirectory(artFolder).then(files => {
            const gifFiles = files.filter(([name, type]) => type === vscode.FileType.File && name.endsWith('.gif'));
            if (gifFiles.length === 0) {
                vscode.window.showInformationMessage('No pixel art GIFs found.');
                return;
            }
            const randomIndex = Math.floor(Math.random() * gifFiles.length);
            const randomGifFile = gifFiles[randomIndex];
            const gifUri = vscode.Uri.joinPath(artFolder, randomGifFile[0]);

            const jsonFileName = randomGifFile[0].replace('.gif', '.json');
            const jsonUri = vscode.Uri.joinPath(artFolder, jsonFileName);

            vscode.workspace.fs.readFile(jsonUri).then(jsonData => {
                const { author, source } = JSON.parse(jsonData.toString());
                const message = `Pixel Art by ${author}\nSource: ${source}`;

                vscode.window.showInformationMessage(message, {
                    title: 'Open Image',
                    action: 'openImage',
                }).then(selection => {
                    if (selection && selection.action === 'openImage') {
                        vscode.env.openExternal(gifUri);
                    }
                });
            });
        });
    });

    context.subscriptions.push(disposable);
}
