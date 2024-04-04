"use strict"

import { Submarine } from './objects.js';
import { initScene, initRenderer, fog, setupScene } from './scene.js';
import { CustomCamera } from './camera.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';

// Initialization
const scene = initScene();
const camera = new CustomCamera();
const renderer = initRenderer();

const submarine = new Submarine(scene);

setupScene(scene);

function animate() {
    requestAnimationFrame(animate);
    // fog(camera, scene);
    renderer.render(scene, camera.camera);
    camera.update();

    // camera.target = submarine.transform.position;
}

animate();