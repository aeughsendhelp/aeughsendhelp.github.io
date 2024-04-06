import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { clamp } from './utils.js';

export class CustomCamera {
    constructor() {
        this.camera = null;
        this.target = new THREE.Vector3(0, 0, 0);
        this.distance = 60;
        this.sensitivity = 0.1;
        this.fov = 80

        this.deltaX = 0;
        this.deltaY = 0;

        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, this.distance);
        console.log();

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('wheel', this.onMouseWheel.bind(this));

        this.update();
    }

    onMouseMove(event) {
        this.deltaX = -event.movementX * this.sensitivity;
        this.deltaY = -event.movementY * this.sensitivity;
        this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(this.deltaX));
        this.camera.rotateX(THREE.Math.degToRad(this.deltaY));

        this.update();
    }

    onMouseWheel(event) {
        this.fov += (event.deltaY/68);
        this.fov = clamp(this.fov, 50, 100);
        this.camera.fov = this.fov;
        this.camera.updateProjectionMatrix();

        // this.update();
    }

    update() {
        this.camera.position.copy(this.target);
        this.camera.translateZ(this.distance);
        // console.log(this.camera.fov);
    }
}