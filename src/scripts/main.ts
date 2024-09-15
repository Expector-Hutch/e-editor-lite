import { openFileDialog, CodeEditor } from "./CodeEditor";

// 设置环境
self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'typescript' || label === 'javascript') {
            return 'monaco-editor/esm/vs/language/ts.worker.js';
        }
        return 'monaco-editor/esm/vs/language/editor.worker.js';
    }
};

// 创建 CodeEditor 实例
var maineditor = new CodeEditor(document.getElementsByTagName('main')[0]);
// maineditor.readFile("D:/oi/test.cpp");

document.getElementById('btn-save')?.addEventListener('click', async () => {
    await maineditor.writeFile("D:/oi/test.cpp");
});

document.getElementById('btn-open')?.addEventListener('click', async () => {
    await openFileDialog();
})
