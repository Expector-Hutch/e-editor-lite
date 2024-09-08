import * as monaco from 'monaco-editor';

function InitMonacoEnv() {
  self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'typescript' || label === 'javascript') {
        return 'monaco-editor/esm/vs/language/ts.worker.js';
      }
      return 'monaco-editor/esm/vs/language/editor.worker.js';
    }
  };
}

import * as github_dark from 'monaco-themes/themes/GitHub Dark.json';
function SetMonacoTheme() {
  monaco.editor.defineTheme('github-dark', github_dark as any);
  monaco.editor.setTheme('github-dark');

  var style = document.createElement("style");
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

function LoadMonacoEditor() {
  var container = document.getElementsByTagName('main')[0];

  var editor = monaco.editor.create(container, {
    value: "function hello() {\n\talert('Hello world!');\n}",
    language: 'javascript',
    cursorSmoothCaretAnimation: "on",
    cursorBlinking: "phase",
    rulers: [
      60,
      80
    ],
    theme: 'github-dark'
  });

  editor.onDidChangeCursorPosition((_) => {
    document.getElementsByTagName("cursor-position")[0].innerHTML =
      `行 ${editor.getPosition()!.lineNumber}, 列 ${editor.getPosition()!.column}`
  });

  window.onresize = () => { editor.layout(); };

  window.addEventListener("DOMContentLoaded", () => {
    editor.layout();
    document.getElementsByTagName("cursor-position")[0].innerHTML =
      `行 ${editor.getPosition()!.lineNumber}, 列 ${editor.getPosition()!.column}`
  });
}

function main() {
  InitMonacoEnv();
  SetMonacoTheme();
  LoadMonacoEditor();
}

main();