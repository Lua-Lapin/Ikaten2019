/*jshint esversion: 6 */
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
var plane;
$.ajaxSetup({async: false});
$.getJSON("./pic.json",(data)=>{
    pic_data=data;
});
$.ajaxSetup({async: true});

var pic1_x;
var texture1 = new THREE.TextureLoader().load(pic_data[0].src1,
(tex) => {
    var w = tex.image.width;
    pic1_x=w;
    var h = tex.image.height/(tex.image.width/w);
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshPhongMaterial( { map:texture1 } );
    plane = new THREE.Mesh( geometry, material );
    plane.scale.set(w, h, 1);
    scene.add( plane );
});
var plane2;
var tail=new THREE.Group();
var pic2_x;
var texture2 = new THREE.TextureLoader().load(pic_data[0].src2,
(tex) => {
    var w = tex.image.width;
    pic2_x=w;
    var h = tex.image.height/(tex.image.width/w);
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshPhongMaterial( { map:texture2 } );
    plane2 = new THREE.Mesh( geometry, material );
    plane2.scale.set(w, h, 1);
    plane2.position.x-=w/2;
    tail.add(plane2);
    tail.position.x-=pic1_x/2;
    scene.add( tail );

    start();
});

var pic_siz_x;
function start(){
    pic_siz_x=pic1_x+pic2_x;
    animate();

}
var n=1;
var cou=0;
function animate(){
    requestAnimationFrame(animate);

    if(tail.rotation.y>=Math.PI/4){
        n=-1;
    }else if(tail.rotation.y<=-Math.PI/4){
        n=1;
    }
    tail.rotation.y+=n*Math.PI/180;

    plane.position.x+=5;
    plane.position.y+=5*Math.cos(Number(cou+1)/30);
    if(plane.position.x<-pic_siz_x*2){
        plane.position.x=width+pic_siz_x;
    }else if(plane.position.x>width+pic_siz_x/2){
        plane.position.x=-pic_siz_x*2;
    }


    movepic();

    cou++;

    rendererThree.render(scene,camera);
}

function movepic(){
    tail.position.x=plane.position.x-pic1_x/2;
    tail.position.y=plane.position.y;
    tail.position.z=plane.position.z;
}