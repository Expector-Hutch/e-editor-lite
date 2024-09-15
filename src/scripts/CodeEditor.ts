import * as monaco from 'monaco-editor';
import * as github_dark from 'monaco-themes/themes/GitHub Dark.json';
import * as github_light from 'monaco-themes/themes/GitHub Light.json';
import { invoke } from '@tauri-apps/api/core';
import { ask } from '@tauri-apps/plugin-dialog';

export async function openFileDialog() {
    const answer = await ask('This action cannot be reverted. Are you sure?', {
        title: 'Tauri',
        kind: 'warning',
      });
}

export class CodeEditor {
    private editor: monaco.editor.IStandaloneCodeEditor;

    constructor(container: HTMLElement) {
        this.editor = monaco.editor.create(container, {
            value: "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n",
            language: 'rust',
            cursorSmoothCaretAnimation: "on",
            cursorBlinking: "phase",
            rulers: [60, 80],
            theme: 'github-dark'
        });
        this.SetMonacoTheme();
        this.LoadMonacoEditor();
    }

    private SetMonacoTheme() {
        monaco.editor.defineTheme('github-dark', github_dark as any);
        monaco.editor.setTheme('github-dark');

        const style = document.createElement("style");
        style.innerHTML = `
        body {
            background-color: ${github_dark.colors['editor.background']};
        }
        footer {
            color: ${github_dark.colors['editor.foreground']};
        }
        `;
        document.body.appendChild(style);
    }

    private LoadMonacoEditor() {
        this.editor.onDidChangeCursorPosition((_) => {
            const currentPositionElement = document.getElementsByTagName("cursor-position")[0];
            currentPositionElement.innerHTML = `行 ${this.editor.getPosition()?.lineNumber}, 列 ${this.editor.getPosition()?.column}`;
        });

        window.onresize = () => { this.editor.layout(); };

        window.addEventListener("DOMContentLoaded", () => {
            this.editor.layout();
            const currentPositionElement = document.getElementsByTagName("cursor-position")[0];
            currentPositionElement.innerHTML = `行 ${this.editor.getPosition()?.lineNumber}, 列 ${this.editor.getPosition()?.column}`;
        });
    }

    async readFile(filePath: string): Promise<void> {
        try {
            const content = await invoke<string>('read_file', { path: filePath });
            this.editor.setValue(content);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }

    async writeFile(filePath: string): Promise<void> {
        try {
            const content = this.editor.getValue();
            await invoke('write_file', { path: filePath, content });
        } catch (error) {
            console.error('Error writing file:', error);
        }
    }
}