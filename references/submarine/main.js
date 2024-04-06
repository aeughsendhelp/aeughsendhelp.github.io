"use strict"
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';

import { Submarine } from './objects.js';
import { initScene, initRenderer, fog, setupScene } from './scene.js';
import { CustomCamera } from './camera.js';


const scene = initScene();
const camera = new CustomCamera();
const renderer = initRenderer();
const canvas = document.querySelector('canvas');

const submarine = new Submarine(scene);


setupScene(scene);

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
});

function animate() {
    requestAnimationFrame(animate);

    camera.target = submarine.transform.position;
    fog(scene, camera.camera)

    submarine.move(1);

    camera.update();
    renderer.render(scene, camera.camera);
}

animate();