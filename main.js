/*jshint esversion: 8 */
var width = window.innerWidth;
var height = window.innerHeight;
var x = width/2;
var y = height/2;

const canvas = document.querySelector('canvas');
const rendererThree = new THREE.WebGLRenderer({
	canvas: canvas,
	transparent: true,
	antialias: true,//omotai
	alpha:true
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
//var axis = new THREE.AxesHelper((width/height)*cam_z*Math.tan(Math.PI/6));
//scene.add(axis);//########################################
//axis.position.z=-1000;
//camera.lookAt(new THREE.Vector3(0, 0, 0));
//var controls = new THREE.TrackballControls(camera);
var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

var pic_data;
var pic1_x=[];
var pic1_dir=[];
var pic2_x=[];
var pic2_y=[];
var fish=[];
var other=[];
var texture1=[];
var texture2=[];
var loader = new THREE.TextureLoader();
async function loadTexture1(pida,i) {
	return new Promise( (res) => {
		texture1[i] = loader.load(pida.src,(a)=>{
			tex1(texture1[i],i,pida.dir);
			res(a);
		});
	});
}

async function loadTexture2(pida,i) {
	return new Promise( (res) => {
		texture2[i] = loader.load(pida.src,(a)=>{
			tex2(texture2[i],i);
			res(a);
		});
	});
}

var num1 = 0;
var num2 = 0;
async function loop(s,e) {
	for(var i=s;i<e;i++){
		if(pic_data[i].num==1){
			await loadTexture1(pic_data[i],num1);
			num1++;
		}else if(pic_data[i].num==2){
			await loadTexture2(pic_data[i],num2);
			num2++;
		}
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

function tex1(tex,i,dirnum){
	var tex_w = tex.image.width;
	pic1_x[i]=tex_w;
	pic1_dir[i]=dirnum;
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

var oth_wall_x=[];
var oth_wall_y=[];
var oth_move_x=[];
var oth_move_y=[];
function tex2(tex,i){
	oth_move_x[i]=moverand();
	oth_move_y[i]=moverand();
	oth_wall_x[i]=1;
	oth_wall_y[i]=1;
	var tex_w = tex.image.width;
	var tex_h = tex.image.height;
	pic2_x[i]=tex_w;
	pic2_y[i]=tex_h;
	var h = tex.image.height/(tex.image.width/tex_w);
	var geometry = new THREE.PlaneGeometry(1, 1);
	var material = new THREE.MeshPhongMaterial( { map:texture2[i],transparent: true, side: THREE.DoubleSide } );
	other[i] = new THREE.Mesh( geometry, material );
	other[i].scale.set(tex_w, h, 1);
	other[i].position.z=0;
	other[i].position.y+= rand(height/2-tex_h*2,-height/2+tex_h*2);
	other[i].position.x+= rand(width/2-tex_w*2,-width/2+tex_w*2);
	scene.add( other[i] );
}

function moverand(){
	while(true){
		var a=rand(10,-10);
		if(a!=0){return a;}
	}
}

async function start(s,e){
	if(s==0){
		animate();
	}

}

var cou=0;
function animate(){
	requestAnimationFrame(animate);
	for(var i=0;i<fish.length;i++){
		fish[i].position.x+=10*((pic1_dir[i]==0)?1:-1);
		fish[i].position.y+=5*Math.cos(Number(cou+i*10)/30);
		var mami_x = (width/height)*Math.tan(Math.PI/6)*(1000-fish[i].position.z);
		var max_x=pic1_x[i]*2+mami_x;
		var min_x=-pic1_x[i]*2-mami_x;
		if(fish[i].position.x<min_x-1){
			fish[i].position.x=max_x;
			fish[i].position.y= Math.floor(Math.random()*height*2)-height;
			fish[i].position.z=Math.floor(rand(1,-1)*2*pic1_x[i]*Math.sin(Math.PI/4));
		}else if(fish[i].position.x>max_x+1){
			fish[i].position.x=min_x;
			fish[i].position.y= Math.floor(Math.random()*height*2)-height;
			fish[i].position.z=Math.floor(rand(1,-1)*2*pic1_x[i]*Math.sin(Math.PI/4));
		}
	}

	for(var i=0;i<other.length;i++){
		other[i].position.x+=oth_wall_x[i]*oth_move_x[i];
		other[i].position.y+=oth_wall_y[i]*oth_move_y[i];
		var max_x=(width/height)*cam_z*Math.tan(Math.PI/6)-pic2_x[i]/2;
		var min_x=-(width/height)*cam_z*Math.tan(Math.PI/6)+pic2_x[i]/2;
		var max_y=(height/width)*cam_z*Math.tan(Math.PI/6)+pic2_y[i];//nannde ugokunn
		var min_y=-(height/width)*cam_z*Math.tan(Math.PI/6)-pic2_y[i];//nannde ugokunn

		check(i,max_x,min_x,max_y,min_y);

	}
	cou++;

	addpic();
	rendererThree.render(scene,camera);

	//controls.update();
}

function check(p,max_x,min_x,max_y,min_y){
	if(other[p].position.x<min_x-1){
		oth_wall_x[p]=(oth_wall_x[p]==1)?-1:1;
	}else if(other[p].position.x>max_x+1){
		oth_wall_x[p]=(oth_wall_x[p]==1)?-1:1;
	}
	if(other[p].position.y<min_y-1){
		oth_wall_y[p]=(oth_wall_y[p]==1)?-1:1;
	}else if(other[p].position.y>max_y+1){
		oth_wall_y[p]=(oth_wall_y[p]==1)?-1:1;
	}
}


function rand(a,b){
	return Math.floor(Math.random()*(a-b))+b;
}