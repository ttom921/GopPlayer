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