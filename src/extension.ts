import * as vscode from 'vscode';
import * as https from 'https';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.pixelart', () => {
        // The GitHub API URL for the contents of your pixel art directory
        const url = 'https://api.github.com/repos/yourusername/pixel-art-repo/contents';

        https.get(url, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                const files = JSON.parse(body);
                const randomIndex = Math.floor(Math.random() * files.length);
                const imageUrl = files[randomIndex].download_url;

                vscode.window.showInformationMessage(`![Pixel Art](${imageUrl})`);
            });
        }).on('error', (error) => {
            console.error(error.message);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
