import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';
import { Water } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/objects/Water.js';
import { Sky } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/objects/Sky.js';
import { clamp } from './utils.js';

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();
let water, sky, sun;

let airFog;
let airColor = new THREE.Color(0x90cae5);
let airFogDistance = 800;

let waterFog;
let waterColor = new THREE.Color(0x071516);
let waterFogDistance = 100;

export function initScene() {
    const scene = new THREE.Scene();

    airFog = new THREE.Fog(airColor, 1, airFogDistance);
    waterFog = new THREE.Fog(waterColor, 1, waterFogDistance);

    scene.fog = airFog;
    scene.background = waterColor;
    
    return scene;
}

export function initRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.antialias = false;
    renderer.setPixelRatio( window.devicePixelRatio / 3 );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    return renderer;
}

// ------------------------------------------

export function fog(scn, cam) {
    if(cam.position.y > 0.001) {
        scn.fog = airFog;
        scn.background = airColor;
    } else {
        scn.fog = waterFog;
        scn.background = waterColor;
    }
}


export function setupScene(scn) {
    // renderer.toneMappingExposure = effectController.exposure;


    // const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x2b4c59, 5);
    // hemisphereLight.position.set(0, 10, 0);
    // scn.add(hemisphereLight);

    // const sun2 = new THREE.DirectionalLight(0xf2e7cb, 5);
    // sun2.position.set(0, 20, 0);
    // sun2.target.position.set(10, 10, 10);
    // scn.add(sun2);
    // sun2.target.updateMatrixWorld();

    // const helper = new THREE.DirectionalLightHelper(sun);
    // scn.add(helper);

    // ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -300;
    scn.add(ground);

    // ocean
    const oceanGeometry = new THREE.PlaneGeometry(1000, 1000);
    textureLoader.load('../references/submarine/waternormals.jpg',
        function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            water = new Water(
                oceanGeometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: texture,
                    sunDirection: new THREE.Vector3(0, 0, 0 ),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 3.7,
                    fog: scn.fog !== undefined
                }
            );

            // const ocean = new THREE.Mesh(oceanGeometry, water);
            water.rotation.x = Math.PI / -2;
            // ocean.position.y = 0;
            scn.add(water);

            
        // Add Sky
        sky = new Sky();
        sky.scale.setScalar( 450000 );
        scn.add( sky );

        sun = new THREE.Vector3();

        /// GUI
        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 90,
            azimuth: 180,
            // exposure: renderer.toneMappingExposure
        };

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );
        uniforms[ 'sunPosition' ].value.copy( sun );

        function updateSun() {
            const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
            const theta = THREE.MathUtils.degToRad( effectController.azimuth );

            sun.setFromSphericalCoords( 1, phi, theta );

            sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
            water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();


            scn.add( sky );
        }

        updateSun();
        }
    );
}