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
    pic="pic/"+pic;
    pic_back = new PIXI.Graphics();
    pic_back=new PIXI.Sprite(PIXI.Texture.fromImage(pic));
    pic_back.anchor.x = 0.5;
    pic_back.anchor.y = 0.5;
    pic_back.x=x;
    pic_back.y=y;
    stage.addChild(pic_back);
}

var p="b.png";
bc_change(p);

var cou=0;
function background(){
    requestAnimationFrame(background);
    cou++;
    //console.log(cou);
    if(cou%1000==0){
        pic_back.destroy();
        switch(p){
            case "b.png":p="c.png";break;
            case "c.png":p="b.png";break;
        }
        bc_change(p);
    }
    renderer.render(stage);
}

background();