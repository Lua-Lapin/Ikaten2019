var width = window.innerWidth;
var height = window.innerHeight;
var x = width/2;
var y = height/2;
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(width, height,{
    resolution: 1,
    antialias: true,
    //transparent: true,
});
document.getElementById("pixiview").appendChild(renderer.view);

var pic_back = new PIXI.Graphics();
pic_back=new PIXI.Sprite(PIXI.Texture.fromImage("pic/b.png"));
pic_back.anchor.x = 0.5;
pic_back.anchor.y = 0.5;
pic_back.x=x;
pic_back.y=y;

stage.addChild(pic_back);

function background(){
    requestAnimationFrame(background);

    renderer.render(stage);
}

background();