const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const loader = new GLTFLoader();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// const directionalLight = new THREE.DirectionalLight(0xffffff);
// directionalLight.position.set(10, 10, 10);
// scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
hemisphereLight.position.set(10, 10, 10);
scene.add(hemisphereLight);


// Create a cube
const submarineMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

loader.load('../references/models/submarine.glb', function(gltf) {
    const submarine = gltf.scene;
    submarine.add(model);
});



function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    submarine.rotation.x += 0.01;
    submarine.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();