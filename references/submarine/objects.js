// import { main } from './main.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';

const gltfLoader = new GLTFLoader();

const keyDown = {};
let subInfo;
const forward = new THREE.Vector3(0, 0, -1); 

export class Submarine {
    constructor(scene) {
        this.scene = scene;
        this.transform = null;
        this.throttle = 0;
        this.setDepth = 0;
        this.depth = 0;
        this.speed = 0;
        this.bearing = 0;

        // Load submarine model
        gltfLoader.load('../references/submarine/submarine.glb', (gltf) => {
            this.transform = gltf.scene;
            this.scene.add(this.transform);
            // this.transform.position.y = 20;
        });
    }
}

export function submarineMove(speed, ) {
    transform.translateOnAxis(forward, speed);

}