/*jshint esversion: 8 */
var width = window.innerWidth;
var height = window.innerHeight;
var x = width/2;
var y = height/2;

const canvas = document.querySelector('canvas');
const rendererThree = new THREE.WebGLRenderer({
 canvas: canvas,
 // antialias: true,
 // alpha:true
});
rendererThree.setPixelRatio(window.devicePixelRatio);
rendererThree.setSize(width, height);
// シーンを作成
const scene = new THREE.Scene();
// カメラを作成
const camera = new THREE.PerspectiveCamera(60, width / height);
var cam_x = 0;
var cam_y = 0;
var cam_z = 1000;
camera.position.set(cam_x,cam_y,cam_z);
//camera.lookAt(new THREE.Vector3(0, 0, 0));
//var controls = new THREE.TrackballControls(camera);
var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

var pic_data;
var pic1_x=[];
var plane=[];
var tail=[];
var pic2_x=[];
var texture1=[];
var texture2=[];
var loader = new THREE.TextureLoader();
async function loadTexture1(pida,i) {
    return new Promise( (res) => {
        texture1[i] = loader.load(pida.src1,(a)=>{
            tex1(texture1[i],i);
            res(a);
        });
    });
}
async function loadTexture2(pida,i) {
    return new Promise( (res) => {
        texture2[i] = loader.load(pida.src2,(a)=>{
            tex2(texture2[i],i);
            res(a);
        });
    });
}

async function loop(end) {
    for(var i=0;i<end;i++){
        await loadTexture1(pic_data[i],i);
        await loadTexture2(pic_data[i],i);
    }
    start();
}
$.ajaxSetup({async: false});
$.getJSON("./pic.json",(data)=>{
    pic_data=data;
    loop(pic_data.length);
});
$.ajaxSetup({async: true});

function tex1(tex,i){
    var w = tex.image.width;
    pic1_x[i]=w;
    var h = tex.image.height/(tex.image.width/w);
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshPhongMaterial( { map:texture1[i] } );
    console.log(i);
    plane[i] = new THREE.Mesh( geometry, material );
    plane[i].scale.set(w, h, 1);
    plane[i].position.y+= Math.floor(Math.random()*600)-300;
    plane[i].position.x+= Math.floor(Math.random()*600)-300;
    console.log(plane[i].position.y);
    scene.add( plane[i] );
}

function tex2(tex,i){
    var w = tex.image.width;
    pic2_x[i]=w;
    var h = tex.image.height/(tex.image.width/w);
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshPhongMaterial( { map:texture2[i] } );
    var plane2 = new THREE.Mesh( geometry, material );
    plane2.scale.set(w, h, 1);
    plane2.position.x-=w/2;
    console.log(i);
    tail[i]=new THREE.Group();
    tail[i].add(plane2);
    tail[i].position.y+=plane[i].position.y;
    tail[i].position.x-=pic1_x[i]/2+plane[i].position.x;
    scene.add( tail[i] );
}

var pic_siz_x=[];
function start(){
    for(var i=0;i<pic_data.length;i++){
    pic_siz_x[i]=pic1_x[i]+pic2_x[i];
    }
    animate();

}
var n=1;
var cou=0;
function animate(){
    requestAnimationFrame(animate);
    for(var i=0;i<pic_data.length;i++){
    if(tail[i].rotation.y>=Math.PI/4){
        n=-1;
    }else if(tail[i].rotation.y<=-Math.PI/4){
        n=1;
    }
    tail[i].rotation.y+=n*Math.PI/180;

    plane[i].position.x+=5;
    plane[i].position.y+=5*Math.cos(Number(cou+1)/30);
    if(plane[i].position.x<-pic_siz_x[i]*2){
        plane[i].position.x=width+pic_siz_x[i];
    }else if(plane[i].position.x>width+pic_siz_x[i]/2){
        plane[i].position.x=-pic_siz_x[i]*2;
    }


    movepic(i);
    }
    cou++;

    rendererThree.render(scene,camera);
}

function movepic(i){
    tail[i].position.x=plane[i].position.x-pic1_x[i]/2;
    tail[i].position.y=plane[i].position.y;
    tail[i].position.z=plane[i].position.z;
}