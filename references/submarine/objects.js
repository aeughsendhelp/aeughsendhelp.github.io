// import { main } from './main.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';

const gltfLoader = new GLTFLoader();

const keyDown = {};
let subInfo;
const forward = new THREE.Vector3(0, 0, -1); 

export class Submarine {
    constructor(scn) {
        this.scene = scn;
        this.transform = null;
        this.acceleration = 0.001;

        this.throttle = 0;
        this.setDepth = 0;
        this.setSpeed = 0;

        this.depth = 0;
        this.speed = 0;
        this.bearing = 0;

        // Load submarine model
        gltfLoader.load('../references/submarine/submarine.glb', (gltf) => {
            this.transform = gltf.scene;
            this.scene.add(this.transform);
            // this.transform.position.y = 20;
        });

        document.addEventListener('keydown', event => {
            keyDown[event.key] = true;

            if(event.key == 'w') {
                this.throttleChange(1);
            }
            if(event.key == 's') {
                this.throttleChange(-1);
            }
            if(event.key == 'e') {
                this.depthChange(1);
            }
            if(event.key == 'q') {
                this.depthChange(-1);
            }
            if(event.key == '`') {
                aim();
            }

        });
        document.addEventListener('keyup', event => {
            keyDown[event.key] = false;
        });
    }

    throttleChange(increment) {
        this.throttle += increment;
        this.throttle = THREE.MathUtils.clamp(this.throttle, -3, 5);
    }

    depthChange(increment) {
        this.throttle += increment;
        this.throttle = THREE.MathUtils.clamp(this.throttle, -3, 5);
    }

    move(speed) {
        if(this.depth < 0) {
            this.setSpeed  = this.throttle / 8;
        } else {
            this.setSpeed = this.throttle / 4;
        }
        
        if(this.setSpeed > this.speed) {
            this.speed += this.acceleration;
        } else if(this.setSpeed < this.speed) {
            this.speed -= this.acceleration;
        }
        
        // this.speed = this.throttle * 1;
        this.transform.translateOnAxis(forward, this.speed);
    }
}