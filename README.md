这几日被`electron`折磨了好久，索性就暂时放下`electron`去光顾了下`tauri`，这里记录下练手用的简单项目开发过程吧！

首先得有一台安装了`msedge webview`以及`msvc`的`win`机器，然后要有`node.js`和`rust`的开发环境……

随便找个文件夹，打开`pwsh`，使用`irm https://create.tauri.app/ps | iex`来初始化，此间其将提问数个问题，其中`Choose which language to use for your frontend`选择`TypeScript / JavaScript  (pnpm, yarn, npm)`，`Choose your package manager`选择`yarn`（个人选择，其他选项也都OK），`Choose your UI template`选择`Vanilla`，`Choose your UI flavor`选择`JavaScript`（强烈建议如果你不想用`Vite`就别选`TypeScript`）。

下面是我的`package.json`：

```json
{
  "name": "e-editor-lite",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "parcel ./src/index.html",
    "build": "parcel ./src/index.html",
    "tauri": "tauri"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^1.4.0",
    "parcel-bundler": "^1.12.5"
  },
  "dependencies": {
    "monaco-editor": "^0.41.0",
    "monaco-themes": "^0.4.4"
  }
}
```

然后生成的项目中`src`目录是你页面源代码，下面展示一下我的的代码：

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="./styles.css" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tauri App</title>
  <script type="module" src="./main.js"></script>
</head>

<body>
  <div id="container"></div>
</body>

</html>
```

```css
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
}

#container {
  height: 100%;
  width: 100%;
}
```

```js
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
```

这里简单给编辑器加了个`github-dark`主题，另外还有编辑器大小自适应的一种自创方案（monaco的大小自适应向来是个大坑）

另外还要改一下`rust`代码，直接初始化时是混入了一些没必要的东西的，以下是`src-tauri\src\main.rs`修改后的代码：

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

另外由于使用了`parcel`进行打包，`src-tauri\tauri.conf.json`也是要改一部分的：

```json
...
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:1234 ",
    "distDir": "../dist",
    "withGlobalTauri": true
  },
...
```

最后`npm run tauri dev`就可以预览成果了！