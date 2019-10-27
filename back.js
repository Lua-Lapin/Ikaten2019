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

var pic_back;
function bc_change(pic){
    pic_back = new PIXI.Graphics();
    pic_back=new PIXI.Sprite(PIXI.Texture.fromImage(pic));
    pic_back.anchor.x = 0.5;
    pic_back.anchor.y = 0.5;
    pic_back.x=x;
    pic_back.y=y;
    stage.addChild(pic_back);
}

bc_change("pic/b.png");

var cou=0;
function background(){
    requestAnimationFrame(background);
    cou++;
    if(cou%1000==0){
        if((cou/1000)%2==0){
            pic_back.destroy();
            bc_change("pic/b.png");
        }else if((cou/1000)%2==1){
            pic_back.destroy();
            bc_change("pic/c.png");
        }
    }
    renderer.render(stage);
}

background();