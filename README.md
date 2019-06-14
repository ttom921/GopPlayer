### GopPlayer
測試播放

### PlayerClient
是以alan的專案來轉成angular8版本

### PlayerjMuxer

測試原來的作者的專案，要以sourcecode的方式來播放。<https://github.com/samirkumardas/jmuxer>

因為作者是使用`ES6`的專案，所以要轉換成可以執行的版本，因為ng的專案已建立好所以直接拿來用

首先先建立專案

```bash
ng new PlayerjMuxer
```

下載

```
npm install --save jmuxer
```

目前將js轉成ts

### jmuxer

先從git將專案clone下來

照他的readme.md的說明

```
npm install
npm run build OR npm run pro
```

要看到source code要修改`rollup.config.js`的內容

```javascript
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/jmuxer.js',
    output: [
        {
            file: 'example/jmuxer.min.js',
            format: 'iife',
            name: 'JMuxer',
            sourcemap: true // 'inline'
        },
        {
            file: 'dist/jmuxer.min.js',
            format: 'umd',
            name: 'JMuxer',
            sourcemap: true
        }
    ],
    plugins: [
        eslint(),
        babel({
            exclude: 'node_modules/**',
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        (process.env.NODE_ENV === 'production' && uglify()),
    ],
};
```

將`sourcemap: true`此變數設定為`true`

之後在vscode下的終端下可以下

```
npm run build
```

之後在vscode裏起動debug chrome就可以在source裏debug

也可以下此指令,它會一直監看有無檔案變化

```
npm run dev
```

**注意**有時候中斷不工作，重新中斷執行的程式再重新起動






###### 參考資料

[Typescript error TS2339: Property 'webkitURL' does not exist on type 'Window'
](https://stackoverflow.com/questions/38802171/typescript-error-ts2339-property-webkiturl-does-not-exist-on-type-window)