// import { main } from './main.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';

import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';
import { clamp } from './utils.js';
import { Input } from './input.js';

const gltfLoader = new GLTFLoader();
const forward = new THREE.Vector3(0, 0, -1); 

const input = new Input();

export class Submarine {
    constructor(scn) {
        this.scene = scn;
        this.transform = null;
        this.acceleration = 0.001;
        this.ascentRate = 0.1;

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

        // console.log(input);
        input.listenKeyClick('w', this.throttleChange, this);
        // input.listenKeyClick('s', this.throttleChange(-1));

    }

    throttleChange(increment) {
        this.throttle += increment;
        this.throttle = clamp(this.throttle, -3, 5);
    }

    depthChange(increment) {
        this.setDepth += increment;
        this.setDepth = clamp(this.setDepth, -150, 0);
    }

    bearingChange(increment) {
        this.bearing += increment * clamp(this.speed, -1, 1);

        if(this.bearing > 360) {
            this.bearing -= 360;
        } else if(this.bearing < 360) {
            this.bearing += 360;
        }
    }

    move(speed) {
        if(input.isPressed['q']) {
            console.log("gay");
        }
        if(input.isPressed['a']) {
            this.bearingChange(1);
        }
        if(input.isPressed['d']) {
            this.bearingChange(-1);
        }
        if(input.isPressed['e']) {
            this.depthChange(1);
        }
        if(input.isPressed['q']) {
            this.depthChange(-1);
        }
        if(input.isPressed['`']) {
            aim();
        }

        // Speed
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

        // Depth
        if(this.setDepth > this.depth) {
            this.depth += this.ascentRate;
        } else if(this.setDepth < this.speed) {
            this.depth -= this.ascentRate;
        }
        
        // this.speed = this.throttle * 1;
        this.transform.translateOnAxis(forward, this.speed);
        this.transform.position.y = this.depth;
        this.transform.rotation.y = THREE.MathUtils.degToRad(this.bearing);
    }
}