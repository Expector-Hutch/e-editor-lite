// const { invoke } = window.__TAURI__.tauri;

// let greetInputEl;
// let greetMsgEl;

// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }

// window.addEventListener("DOMContentLoaded", () => {
//   greetInputEl = document.querySelector("#greet-input");
//   greetMsgEl = document.querySelector("#greet-msg");
//   document.querySelector("#greet-form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     greet();
//   });
// });

import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return 'monaco-editor/esm/vs/language/json.worker.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return 'monaco-editor/esm/vs/language/css.worker.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return 'monaco-editor/esm/vs/language/html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return 'monaco-editor/esm/vs/language/ts.worker.js';
		}
		return 'monaco-editor/esm/vs/language/editor.worker.js';
	}
};


import('monaco-themes/themes/GitHub Dark.json')
  .then(data => {
    // @ts-ignore
    monaco.editor.defineTheme('github-dark', data);
    monaco.editor.setTheme('github-dark');
  })

var container = document.getElementById('container');

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

window.onresize = () => {
  container.style.width = '0';
  container.style.height = '0';
  editor.layout();
  container.style.removeProperty('width');
  container.style.removeProperty('height');
  editor.layout();
};

window.addEventListener("DOMContentLoaded", () => {
  container.style.width = '0';
  container.style.height = '0';
  editor.layout();
  container.style.removeProperty('width');
  container.style.removeProperty('height');
  editor.layout();
});