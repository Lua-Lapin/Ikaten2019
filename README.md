# Ikaten2019
jsonファイルを書き換えると自動的に描写されます  
[プロジェクションマッピング](https://akatsuki1910.github.io/Ikaten2019/index.html)  
## jsonの書き方
|変数名|値|詳細|
|--|--|--|
| src | 画像 | pic/*.png |
| num | 種類 | 1:魚,2:浮遊 |
| dir | 向き | 0:右,1:左 |

## 表示部分
### index.html
表示させるもの。F11のあとF5
### index.js
動く部分。three.js+pixi.js
### back.js
背景画像がかわる部分。重いと動かない。pixi.js
### main.css
canvasの体裁を整えるもの。
### pic.json
pictureが入るもの。
### その他外部ファイル
- jquery-3.3.1.min.js
- pixi.min.js
- three.min.js
## java
外部APIが足りてないので動かすときはJacksonとSpire.pdfを入れてから動かしてください
