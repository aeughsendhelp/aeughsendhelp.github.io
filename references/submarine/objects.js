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
        this.ascentRate = 0.0003;

        this.throttle = 0;
        this.setDepth = 0;
        this.setSpeed = 0;

        this.velocity = new THREE.Vector3(0, 0, 0);

        this.bearing = 0;
        this.wasPressed = {};


        // Load submarine model
        gltfLoader.load('../references/submarine/submarine.glb', (gltf) => {
            this.transform = gltf.scene;
            this.scene.add(this.transform);
            // this.transform.position.y = 20;
        });

        document.addEventListener('keydown', event => {
            if(!this.wasPressed[event.key]) {
                if(event.key === 'w') {
                    this.throttleChange(1);
                } else if(event.key === 's') {
                    this.throttleChange(-1);
                }

                this.wasPressed[event.key] = true;
            }
        });

        document.addEventListener('keyup', event => {
            this.wasPressed[event.key] = false;
        });

    }

    throttleChange(increment) {
        this.throttle += increment;
        this.throttle = clamp(this.throttle, -3, 5);
    }

    depthChange(increment) { // not to be confused with depth charge
        this.setDepth += increment;
        this.setDepth = clamp(this.setDepth, -150, 0);
    }

    bearingChange(increment) {
        this.bearing += increment * clamp(this.velocity.z, -3, 3);

        if(this.bearing > 360) {
            this.bearing -= 360;
        } else if(this.bearing < 360) {
            this.bearing += 360;
        }
    }

    move(speed) {
        if(input.isPressed['a']) {
            this.bearingChange(0.6);
        }
        if(input.isPressed['d']) {
            this.bearingChange(-0.6);
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
        if(this.transform.position.y < 0) {
            this.setSpeed  = this.throttle / 8;
        } else {
            this.setSpeed = this.throttle / 4;
        }
        
        if(this.setSpeed > this.velocity.z) {
            this.velocity.z += this.acceleration;
        } else if(this.setSpeed < this.velocity.z) {
            this.velocity.z -= this.acceleration;
        }

        // Depth

        if(this.setDepth > this.transform.position.y) {
            this.velocity.y += this.ascentRate;
        } else if(this.setDepth < this.velocity.z) {
            this.velocity.y -= this.ascentRate;
        }


        this.velocity.y = clamp(this.velocity.y, -0.05, 0.05);


        // this.speed = this.throttle * 1;
        this.transform.translateOnAxis(forward, this.velocity.z);
        this.transform.position.y += this.velocity.y;

        this.transform.rotation.y = THREE.MathUtils.degToRad(this.bearing);
    }
}