import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';
import { clamp } from './utils.js';

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

let airFog;
let airColor = new THREE.Color(0xafc5d3);
let airFogDistance = 800;

let waterFog;
let waterColor = new THREE.Color(0x071516);
let waterFogDistance = 100;


export function initScene() {
    const scene = new THREE.Scene();

    airFog = new THREE.Fog(airColor, 1, airFogDistance);
    waterFog = new THREE.Fog(waterColor, 1, waterFogDistance);

    scene.fog = airFog;
    scene.background = waterColor;
    return scene;
}

export function initRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.antialias = false;
    renderer.setPixelRatio( window.devicePixelRatio / 3 );

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    return renderer;
}

// ------------------------------------------

export function fog(scn, cam) {
    if(cam.position.y > 0.001) {
        scn.fog = airFog;
        scn.background = airColor;
    } else {
        scn.fog = waterFog;
        scn.background = waterColor;
    }
}


export function setupScene(scn) {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8abbce, 10);
    hemisphereLight.position.set(0, 10, 5);
    scn.add(hemisphereLight);

    // ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -300;
    scn.add(ground);

    // ocean
    const oceanGeometry = new THREE.PlaneGeometry(1000, 1000);
    textureLoader.load('../images/evgames.jpg',
        function(texture) {
            const oceanMaterial = new THREE.MeshBasicMaterial({ color: 0x41a2fc, side: THREE.DoubleSide, map:texture});
            const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
            ocean.rotation.x = Math.PI / 2;
            ocean.position.y = 0;
            scn.add(ocean);
        }
    );
}