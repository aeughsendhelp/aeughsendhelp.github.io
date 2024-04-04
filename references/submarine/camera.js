import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';

export class CustomCamera {
    constructor() {
        // Initialize necessary variables
        this.camera = null;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.target = new THREE.Vector3(0, 0, 0);
        this.distance = -10;
        this.xSpeed = 0.25;
        this.ySpeed = 0.12;
        this.yMinLimit = -20;
        this.yMaxLimit = 80;
        this.x = 0;
        this.y = 0;

        // Create a camera
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, this.distance);

        // Event listeners
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('wheel', this.onMouseWheel.bind(this));

        // Initial setup
        this.update();
    }

    onMouseMove(event) {
        this.x += event.movementX * this.xSpeed;
        this.y -= event.movementY * this.ySpeed;
        this.y = Math.max(this.yMinLimit, Math.min(this.yMaxLimit, this.y));
        this.update();
    }

    onMouseWheel(event) {
        this.distance += event.deltaY * 0.1;
        this.distance = Math.min(2, this.distance);
        this.update();
    }

    update() {
        const rotation = new THREE.Euler(THREE.MathUtils.degToRad(this.y), THREE.MathUtils.degToRad(this.x), 0);
        const position = new THREE.Vector3(0, 0, -this.distance).applyEuler(rotation).add(this.target);
        
        this.camera.rotation.set(rotation.x, rotation.y, rotation.z);
        this.camera.position.set(position.x, position.y, position.z);
        
        this.renderer.render(this.scene, this.camera);
    }
}