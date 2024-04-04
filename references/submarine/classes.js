// import { main } from './main.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/OrbitControls.js';


// Initialization
const scene = initScene();
const camera = initCamera();
const renderer = initRenderer();
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

let waterFog;
let airFog;
let waterColor = new THREE.Color(0x071516);
let airColor = new THREE.Color(0xafc5d3);

const keyDown = {};
let subInfo;
const forward = new THREE.Vector3(0, 0, -1); 


export class GameScene {
    // Initialize scene
    initScene() {
        const scene = new THREE.Scene();


        const near = 1;
        const far = 200;
        waterFog = new THREE.Fog(waterColor, near, far);
        airFog = new THREE.Fog(airColor, near, far);

        scene.fog = waterFog;
        scene.background = waterColor;
        return scene;
    }

    // Initialize camera
    initCamera() {
        const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 40, 50);
        camera.rotation.y = 40;
        return camera;
    }

    // Initialize renderer
    initRenderer() {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    // Set up input
    setupInput() {
        document.addEventListener('keydown', event => {
            keyDown[event.key] = true;

            if(event.key == 'w') {
                submarineThrottle(1);
            }
            if(event.key == 's') {
                submarineThrottle(-1);
            }
            if(event.key == '`') {
                aim();
            }

        });
        document.addEventListener('keyup', event => {
            keyDown[event.key] = false;
        });
    }

    // Set up scene
    setupScene() {
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
}

class Submarine {
    name = "Submarine";


}