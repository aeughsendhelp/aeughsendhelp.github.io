// this code is a fucking mess already and i'm only a few days in. this does not bode well
// since this is a kinda quick project for fun im not too worried about the code quality
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';

// Initialization
const scene = initScene();
const camera = initCamera();
const renderer = initRenderer();
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

const keyDown = {};

var subInfo;

var waterFog;
var airFog;
var waterColor = 0x071516;
var airColor = 0xafc5d3;

// Initialize scene
function initScene() {
    const scene = new THREE.Scene();


    const near = 1;
    const far = 200;
    waterFog = new THREE.Fog(waterColor, near, far);
    airFog = new THREE.Fog(airColor, near, far);

    scene.fog = airFog;
    scene.background = new THREE.Color(airFog);
    return scene;
}

// Initialize camera
function initCamera() {
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 40, 50);
    camera.rotation.y = 40;
    return camera;
}

// Initialize renderer
function initRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

// Set up input
function setupInput() {
    document.addEventListener('keydown', event => {
        keyDown[event.key] = true;

        if(event.key == 'w') {
            submarineThrottle(1);
        }
        if(event.key == 's') {
            submarineThrottle(-1);
        }

    });
    document.addEventListener('keyup', event => {
        keyDown[event.key] = false;
    });
}

// Set up scene
function setupScene() {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8abbce, 10);
    hemisphereLight.position.set(0, 10, 5);
    scene.add(hemisphereLight);

    // ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -300;
    scene.add(ground);

    // ocean
    const oceanGeometry = new THREE.PlaneGeometry(1000, 1000);
    textureLoader.load('../images/evgames.jpg',
        function(texture) {
            const oceanMaterial = new THREE.MeshBasicMaterial({ color: 0x41a2fc, side: THREE.DoubleSide, map:texture});
            const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
            ocean.rotation.x = Math.PI / 2;
            ocean.position.y = 0;
            scene.add(ocean);
        }
    );

    subInfo = document.getElementById("subInfo");
}

// Load submarine
function loadSubmarine() {
    gltfLoader.load('../references/submarine/submarine.glb', function(gltf) {
        submarine = gltf.scene;
        scene.add(submarine);
        submarine.position.y = -20;
    });
}


var throttle = 0;
var setDepth = 0;

var maxSpeed = 0.3;
var rotationSpeed = 0.01;
var ascensionSpeed = 0.02;
function submarineMovement() {
    var speed = maxSpeed * (throttle/10)
    submarine.position.z -= speed;
    if(keyDown['a']) submarine.rotation.y += rotationSpeed;
    if(keyDown['d']) submarine.rotation.y -= rotationSpeed;

    if(setDepth > submarine.position.y) {
        submarine.position.y += ascensionSpeed;
    } else if(setDepth < submarine.position.y) {
        submarine.position.y -= ascensionSpeed;
    }

    subInfo.innerHTML = `Depth: ${Math.round(submarine.position.y * 10) / 10} <br>
    Set Depth: ${setDepth} <br>
    Speed: ${speed} <br>
    Bearing: ${Math.round(submarine.rotation.y * (180/3.1415) * 10) / 10}`;
}

function submarineThrottle(toIncrement) {
    throttle += toIncrement;
    throttle = clamp(throttle, -5, 10);
    console.log(throttle);
}

function fog() {
    if(camera.position.y >= 0) {
        scene.fog = airFog;
        scene.background = new THREE.Color(airColor);
        console.log("above");
    } else {
        scene.fog = waterFog;
        scene.background = new THREE.Color(waterColor);
        console.log("below");

    }

}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    submarineMovement()
    fog();
    const offset = new THREE.Vector3(0, 15, 55);
    followObject(camera, submarine, offset);

    renderer.render(scene, camera);
}

// Camera follows the submarine
function followObject(toMove, toFollow, offset) {
    const targetPos = toFollow.position.clone().add(offset);
    toMove.position.lerp(targetPos, 0.1);
    toMove.lookAt(toFollow.position);
}

function clamp(toClamp, min, max) {
    return Math.min(Math.max(toClamp, min), max);
};

setupInput();
setupScene();

let submarine;
loadSubmarine();

animate();