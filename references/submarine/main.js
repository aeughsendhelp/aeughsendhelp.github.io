"use strict"

// this code is a fucking mess already and i'm only a few days in. this does not bode well
// since this is a kinda quick project for fun im not too worried about the code quality
import { GameScene } from './classes.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/OrbitControls.js';


// Load submarine
function loadSubmarine() {
    gltfLoader.load('../references/submarine/submarine.glb', function(gltf) {
        submarine = gltf.scene;
        scene.add(submarine);
        submarine.position.y = -20;
    });
}


var throttle = 0;
var setDepth = 0;
var depthChangeSpeed = 0.5;

var maxSpeed = 0.3;
var rotationSpeed = 0.002;
var ascensionSpeed = 0.03;

var isAiming = false;
function submarineMovement() {
    var speed = maxSpeed * (throttle/10)
    if(keyDown['a']) submarine.rotation.y += rotationSpeed;
    if(keyDown['d']) submarine.rotation.y -= rotationSpeed;
    if(keyDown['e']) setDepth += depthChangeSpeed;
    if(keyDown['q']) setDepth -= depthChangeSpeed;
    setDepth = clamp(setDepth, -100, 0);
    
    if(setDepth > submarine.position.y) {
        submarine.position.y += ascensionSpeed;
    } else if(setDepth < submarine.position.y) {
        submarine.position.y -= ascensionSpeed;
    }

    submarine.translateOnAxis(forward, speed);

    subInfo.innerHTML = `Depth: ${Math.round(submarine.position.y * 10) / 10} <br>
    Set Depth: ${Math.round(setDepth * 10) / 10} <br>
    Speed: ${speed} <br>
    Bearing: ${Math.round(submarine.rotation.y * (180/Math.PI) * 10) / 10}`;
}

function submarineThrottle(toIncrement) {
    throttle += toIncrement;
    throttle = clamp(throttle, -5, 10);
    console.log(throttle);
}

function fog() {
    if(camera.position.y >= 0) {
        scene.fog = airFog;
        scene.background = airColor;
    } else {
        scene.fog = waterFog;
        scene.background = waterColor;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    submarineMovement()
    fog();


    const offset = new THREE.Vector3(0, 15, 55);
    cameraMove( submarine, offset);



    renderer.render(scene, camera);
}


function aim() {
    if(isAiming) {
        isAiming = false
    } else {
        isAiming = true;
    }
    console.log(isAiming)
}
// Camera follows the submarine
function cameraMove() {
    controls.target.copy(submarine.position);
    controls.update();

    // camera.
    if(isAiming) {
        controls.autoRotate = true;
    }
    // toMove.position.lerp(targetPos, 0.1);
    // toMove.lookAt(toFollow.position);
    // camera.position.add()
}

var mincam = 10;
function camSetup() {
    controls.addEventListener("change", function(e)
    {
      if (camera.position.distanceTo(submarine.position) < mincam)
      {
        var cameradirection = new THREE.Vector3();
        camera.getWorldDirection(cameradirection);
        cameradirection.negate().normalize();
        var distancedirection = new THREE.Vector3();
        distancedirection.subVectors(targetmesh.getWorldPosition(new THREE.Vector3()), camera.getWorldPosition(new THREE.Vector3()));
        distancedirection.normalize();
        var positionangle = distancedirection.angleTo(cameradirection);
        if (Math.abs(Math.sin(positionangle)) < Number.EPSILON) {camera.translateZ(mincam - camera.position.distanceTo(targetmesh.position));}
        else {camera.translateZ(mincam * Math.sin(Math.PI - positionangle - Math.asin(camera.position.distanceTo(targetmesh.position) * Math.sin(positionangle) / mincam)) / Math.sin(positionangle));};
      };  
      renderer.render(scene, camera);
    });

}

function clamp(toClamp, min, max) {
    return Math.min(Math.max(toClamp, min), max);
};

setupInput();
setupScene();

let submarine;
loadSubmarine();
camSetup();
animate();