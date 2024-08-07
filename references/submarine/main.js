"use strict"
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';

import { Submarine } from './objects.js';
import { initScene, initRenderer, fog, setupScene } from './scene.js';
import { CustomCamera } from './camera.js';
import { clamp } from './utils.js';


const scene = initScene();
const renderer = initRenderer();
const canvas = document.querySelector('canvas');
const info = document.getElementById("info");
const submarine = new Submarine(scene);
const camera = new CustomCamera();

// const water = 
setupScene(scene, renderer);


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.camera.aspect = window.innerWidth / window.innerHeight;
    camera.camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
});



function animate() {
    requestAnimationFrame(animate);
    if(!submarine.transform) return;

    camera.target = submarine.transform.position;
    fog(scene, camera.camera)

    submarine.move();
    camera.submarine = submarine;
    
    camera.update();
    // updateSun()
    drawInfo();
    renderer.render(scene, camera.camera);
}

function drawInfo() {
    info.innerHTML = `Throttle: ${submarine.throttle}<br>
    Set Depth: ${submarine.setDepth.toFixed(1)} m<br>
    <br>
    Speed: ${(submarine.velocity.z * 60).toFixed(0)} kmph<br>
    Depth: ${submarine.transform.position.y.toFixed(0)} m`
}

animate();