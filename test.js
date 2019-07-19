/*jshint esversion: 6 */
var width = window.innerWidth;
var height = window.innerHeight;
var x = width/2;
var y = height/2;

const bulletCapacity = 3000;

var stage = new PIXI.Sprite();
var renderer = PIXI.autoDetectRenderer(width, height,{
    resolution: 1,
    antialias: true,
});
document.getElementById("pixiview").appendChild(renderer.view);
window.onresize = function () {
    location.reload();
};

function animate(){
    requestAnimationFrame(animate);
    for(var i=0;i<pic_data.length;i++){
        pic[i][0].x+=pic[i][1];
        pic[i][0].y+=5*Math.cos(Number(textobj.text+1-i)/30);
        if(pic[i][0].x<-pic_siz_x){
            pic[i][0].x=width+pic_siz_x;
        }else if(pic[i][0].x>width+pic_siz_x){
            pic[i][0].x=-pic_siz_x;
        }
    }
    textobj.text++;
    renderer.render(stage);
}


var word = "0";
var style = {fontFamily : 'Arial',fontSize : '40px', fill:'white', fontWeight : "bold"};
var textobj = new PIXI.Text(word, style);
stage.addChild(textobj);

var pic_data;
$.ajaxSetup({async: false});
$.getJSON("./pic.json",(data)=>{
    pic_data=data;
});
$.ajaxSetup({async: true});

var pic=[];
var spe_num=10;

var pic_siz_x=33;
var pic_siz_y=33;

console.log(pic_data.length);

for(var i=0;i<pic_data.length;i++){
    pic[i]=[];
    pic[i][0]=new PIXI.Sprite(PIXI.Texture.fromImage(pic_data[i].src));
    pic[i][0].anchor.x = 0.5;
    pic[i][0].anchor.y = 0.5;
    pic[i][0].x=Math.floor(Math.random()*(width));
    pic[i][0].y=Math.floor(Math.random()*(height));

    while(true){
        pic[i][1]=Math.floor(Math.random()*(spe_num*2+1))-spe_num;
        if(pic[i][1]!=0)break;
    }

    stage.addChild(pic[i][0]);
}

animate();