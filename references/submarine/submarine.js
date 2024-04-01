import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';

//  ---- Initialize things ---------------------------------------------------------------
const scene = new THREE.Scene(); {
  const color = 0x000000;  // white
  const near = 10;
  const far = 100;
  scene.fog = new THREE.Fog(color, near, far);
}
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---- Set up input ---------------------------------------------------------------
const keyboard = {};
document.addEventListener('keydown', event => {
    keyboard[event.key] = true;
});
document.addEventListener('keyup', event => {
    keyboard[event.key] = false;
});

// ---- Set up scene ---------------------------------------------------------------
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8abbce, 10);
hemisphereLight.position.set(0, 10, 5);
scene.add(hemisphereLight);


// Load HDRI
rgbeLoader.setDataType(THREE.UnsignedByteType);
rgbeLoader.load('../references/submarine/water.hdr', function(texture) {
    var envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.background = envMap;
    scene.environment = envMap;
    pmremGenerator.dispose();
    renderer.render(scene, camera);
});
var pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2; // Rotate the plane to make it horizontal
plane.position.y = -10
scene.add(plane);

var submarine;
gltfLoader.load('../references/submarine/submarine.glb', function(gltf) {
    submarine = gltf.scene;
    scene.add(submarine);
});
camera.position.x = 0;
camera.position.y = 40;
camera.position.z = 50;
camera.rotation.y = 40;



// Essentially the update function
function animate() {
    requestAnimationFrame(animate);

    var offset = new THREE.Vector3(10, 20, 30);
    followObject(camera, submarine, offset);

    renderer.render(scene, camera);
}

function followObject(toMove, toFollow, offset) {
    var targetPos = toFollow.position.clone().add(offset);
    toMove.position.lerp(targetPos, 0.1); // Adjust lerp value for smoother or faster follow
    toMove.lookAt(toFollow.position);
}

// Call necessary functions
animate();