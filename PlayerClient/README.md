### 安裝@angular/material和@angular/cdk

```
npm install --save @angular/material @angular/cdk
```

### 安裝@angular/animations

```
npm install --save @angular/animations
```
加入SharedAngularMaterial <https://ithelp.ithome.com.tw/articles/10209937>

```
ng g m share\SharedAngularMaterial
```
### 加入theme設定

在'styles.scss'中

```scss
@import "~@angular/material/prebuilt-themes/purple-green.css";
```

### 加入Material Icons

可以到此網站找到需要的Icon,[Material Icons](https://material.io/icons/)

在'index.html'

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```
#### 在MatIcon中使用Icon Font

以FontAwesome為例，我們先來安裝庫

```
npm install --save @fortawesome/fontawesome-free
```

接下來在`src\styles.scss`中

```scss
@import "~@angular/material/prebuilt-themes/purple-green.css";
@import "~@fortawesome/fontawesome-free/css/all.css";
```

加入讀圖檔的服務

```
ng g s services\ImageFile
```
指定安裝material版本
```
npm install --save @angular/material
```


