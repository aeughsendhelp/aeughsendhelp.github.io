//  make fun of me 


var frame = 0;
var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	
// The three.js scene: the 3D world where you put objects
const scene = new THREE.Scene();

// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);

//light
const light = new THREE.PointLight( 0xc6eaf2, 1, 100 );
light.position.set( 0, 2, 0 );
scene.add( light );

// Background
const loader2 = new THREE.TextureLoader();
const bgTexture = loader2.load('../../images/yosemite.jpg');
bgTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = bgTexture;

// Texture
const loader = new THREE.CubeTextureLoader();
loader.setPath( 'textures/' );
const textureCube = loader.load( [
	'pickel.jpeg', 'pickel.jpeg',
	'pickel.jpeg', 'pickel.jpeg',
	'pickel.jpeg', 'pickel.jpeg'
] );
const cubeMat = new THREE.MeshToonMaterial( { color: 0xff6600 } );
const otherMat = new THREE.MeshStandardMaterial( { color: randomColor } );
const texture = new THREE.TextureLoader().load( '../../images/evgames.jpg' );
const texture2= new THREE.TextureLoader().load( '../../images/excuseme.png' );
const materialMat = new THREE.MeshBasicMaterial( { map: texture } );
const matmatmat = new THREE.MeshBasicMaterial( { map: texture2 } );


const tube = {
  geometry: new THREE.DodecahedronGeometry(0.2, 1),
  material: materialMat
};

const tube2 = {
  geometry: new THREE.TorusKnotGeometry(0.5),
  material: matmatmat
};

const cube = {
  geometry: new THREE.BoxGeometry(2, 2, 2),
  material: materialMat
};

const cube2 = {
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: cubeMat
};

const cube3 = {
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: cubeMat
};


const ground = {
  geometry: new THREE.BoxGeometry(2, 0.1, 2),
  material: otherMat
};

ground.mesh = new THREE.Mesh(ground.geometry, ground.material);
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);
cube2.mesh = new THREE.Mesh(cube2.geometry, cube2.material);
cube3.mesh = new THREE.Mesh(cube3.geometry, cube3.material);
tube.mesh = new THREE.Mesh(tube.geometry, tube.material);
tube2.mesh = new THREE.Mesh(tube2.geometry, tube2.material);

// Add the cube into the scene
scene.add(ground.mesh);
scene.add(cube.mesh);
scene.add(cube2.mesh);
scene.add(cube3.mesh);
scene.add(tube.mesh);
scene.add(tube2.mesh);

// Make the camera further from the cube so we can see it better
camera.position.z = 5;
camera.position.y = 1.5;
camera.rotation.x = -0.4;
	

function render() {
  // Render the scene and the camera
  renderer.render(scene, camera);

	camera.position.x = Math.sin(frame);
	camera.rotation.z += 0.01;

	// camera.position.y += 0.1;
	// camera.position.z += 0.1;

	
  // Rotate the cube every frame
  cube.mesh.position.x = 0.5 * Math.sin(frame*10);
  cube.mesh.position.y = 0.5 * Math.sin(frame*4);
  cube.mesh.position.z = Math.sin(frame*15);
  cube.mesh.rotation.z += 0.03
  cube.mesh.rotation.x += 0.02

  cube2.mesh.position.x = 4 * Math.sin(frame*2);
  cube2.mesh.position.y = 3 * Math.sin(frame*8);
  cube2.mesh.position.z = Math.sin(frame*35);
  cube2.mesh.rotation.z += 2;

  tube.mesh.position.x = 3 * Math.sin(frame * 15);
  tube2.mesh.position.y = 3 * Math.sin(frame * 1);
  tube2.mesh.rotation.z += 0.1;

  cube3.mesh.position.x = Math.random(-50,60);
  cube3.mesh.position.y = Math.random(-20,50);
  cube3.mesh.position.z = Math.random(-60,50);
	cube3.mesh.rotation.z += 2;
	
  ground.mesh.rotation.x = Math.sin(frame*9);
  ground.mesh.rotation.y += 0.12;
  ground.mesh.rotation.z += 0.14;
  ground.mesh.position.x = Math.tan(frame)

  cubeMat.color.setRGB(Math.random(1,255), Math.random(1,255), Math.random(1,255)
);
	
	frame += 1/60;	
	
  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();