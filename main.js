/*jshint esversion: 8 */
var width = window.innerWidth;
var height = window.innerHeight;
var x = width/2;
var y = height/2;

const canvas = document.querySelector('canvas');
const rendererThree = new THREE.WebGLRenderer({
	canvas: canvas,
	transparent: true,
	// antialias: true,
	// alpha:true
});
rendererThree.setPixelRatio(window.devicePixelRatio);
rendererThree.setSize(width, height);
// シーンを作成
const scene = new THREE.Scene();
// カメラを作成
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
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
var fish=[];
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

// var loderfont = new THREE.FontLoader();
// var textGeometry;
// var text_mas;
// async function loadfont(){
//     loderfont.load( './optimer_regular.typeface.json',(font)=>{
//         textGeometry = new THREE.TextGeometry( '123', {
//             font: font,
//             size: 300.0,
//             height: 5,
//             curveSegments: 10,
//             bevelThickness: 3,
//             bevelSize: 1.0,
//             bevelEnabled: true
//         } );
//         //textGeometry.verticesNeedUpdate =true;
//         //textGeometry.elementNeedUpdate =true;
//         //textGeometry.computeFaceNormals();
//         textGeometry.center();
//         var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//         text_mas = new THREE.Mesh( textGeometry, material );
//         scene.add( text_mas );
//     } );
// }

async function loop(s,e) {
	for(var i=s;i<e;i++){
		await loadTexture1(pic_data[i],i);
		await loadTexture2(pic_data[i],i);
	}
	start(s,e);
}

var mem_pic;
$.ajaxSetup({async: false});
$.getJSON("./pic.json",(data)=>{
	pic_data=data;
	mem_pic=pic_data.length;
	loop(0,pic_data.length);
});
$.ajaxSetup({async: true});

function addpic(){
	$.ajaxSetup({async: false});
	$.getJSON("./pic.json",(data)=>{
		var a=mem_pic;
		pic_data=data;
		mem_pic=pic_data.length;
		loop(a,pic_data.length);
	});
	$.ajaxSetup({async: true});
}

var tex_w;
function tex1(tex,i){
	tex_w = tex.image.width;
	pic1_x[i]=tex_w;
	var h = tex.image.height/(tex.image.width/tex_w);
	var geometry = new THREE.PlaneGeometry(1, 1);
	var material = new THREE.MeshPhongMaterial( { map:texture1[i],transparent: true } );
	fish[i] = new THREE.Mesh( geometry, material );
	fish[i].scale.set(tex_w, h, 1);
	fish[i].position.z+= Math.floor(rand(1,-2)*2*tex_w*Math.sin(Math.PI/4));
	fish[i].position.y+= Math.floor(Math.random()*height*2)-height;
	fish[i].position.x+= Math.floor(Math.random()*width*2)-width;
	scene.add( fish[i] );
}

function tex2(tex,i){
	var w = tex.image.width;
	pic2_x[i]=w;
	var h = tex.image.height/(tex.image.width/w);
	var geometry = new THREE.PlaneGeometry(1, 1);
	var material = new THREE.MeshPhongMaterial( { map:texture2[i],transparent: true } );
	var plane2 = new THREE.Mesh( geometry, material );
	plane2.scale.set(w, h, 1);
	plane2.position.x-=w/2;
	tail[i]=new THREE.Group();
	tail[i].add(plane2);
	tail[i].position.z+=fish[i].position.z;
	tail[i].position.y+=fish[i].position.y;
	tail[i].position.x-=pic1_x[i]/2+fish[i].position.x;
	tail[i].rotation.y=rand(40,-20)*Math.PI/180;
	scene.add( tail[i] );
}

var pic_siz_x=[];
async function start(s,e){
	for(var i=s;i<e;i++){
		pic_siz_x[i]=pic1_x[i]+pic2_x[i];
	}
	if(s==0){
		//await loadfont();
		animate();
	}

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

	fish[i].position.x+=5;
	fish[i].position.y+=5*Math.cos(Number(cou+i*10)/30);

	var max_x=(width/2+pic_siz_x[i]*2)+(width/height)*(-fish[i].position.z);
	var min_x=(-pic_siz_x[i]*2-width/2)-(width/height)*(-fish[i].position.z);

	if(fish[i].position.x<min_x){
		fish[i].position.x=max_x;
		fish[i].position.y= Math.floor(Math.random()*height*2)-height;
		fish[i].position.z=Math.floor(rand(1,-2)*2*tex_w*Math.sin(Math.PI/4));
	}else if(fish[i].position.x>max_x){
		fish[i].position.x=min_x;
		fish[i].position.y= Math.floor(Math.random()*height*2)-height;
		fish[i].position.z=Math.floor(rand(1,-2)*2*tex_w*Math.sin(Math.PI/4));
	}


	movepic(i);
	}
	cou++;

	addpic();
	rendererThree.render(scene,camera);

	//controls.update();
}

function movepic(i){
	tail[i].position.x=fish[i].position.x-pic1_x[i]/2;
	tail[i].position.y=fish[i].position.y;
	tail[i].position.z=fish[i].position.z;
}

function rand(a,b){
	return Math.floor(Math.random()*(a-b))+b;
}