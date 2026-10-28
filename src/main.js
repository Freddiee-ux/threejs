import * as THREE from 'three';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x081321);
scene.fog = new THREE.Fog(0x081321, 10, 24);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
camera.position.set(6.4, 5.1, 8.2);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.querySelector('#app').prepend(renderer.domElement);

scene.add(new THREE.AmbientLight(0x9bb8d0, 1.15));
const keyLight = new THREE.DirectionalLight(0xffdfb0, 3.1);
keyLight.position.set(-3, 7, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.left = -7;
keyLight.shadow.camera.right = 7;
keyLight.shadow.camera.top = 7;
keyLight.shadow.camera.bottom = -7;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 22;
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x34c6e7, 16, 10);
fillLight.position.set(3.5, 2.4, -2.5);
scene.add(fillLight);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ color: 0x102434 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.03;
floor.receiveShadow = true;
scene.add(floor);

const platform = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.65, 0.22, 64), new THREE.MeshStandardMaterial({ color: 0x183449, metalness: 0.35, roughness: 0.48 }));
platform.position.y = 0.08;
platform.receiveShadow = true;
scene.add(platform);

const box = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.35, 1.35), new THREE.MeshLambertMaterial({ color: 0x48c8dc }));
box.position.set(-1.05, 0.93, 0.15);
box.rotation.set(0.08, 0.42, 0.04);
box.scale.set(1.08, 1, 1);
box.castShadow = true;
box.receiveShadow = true;
scene.add(box);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.78, 32, 20), new THREE.MeshPhongMaterial({ color: 0x9874e8, shininess: 90, specular: 0xaecaff }));
sphere.position.set(1.05, 0.97, 0.12);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.22, 18, 48), new THREE.MeshStandardMaterial({ color: 0xf1a652, metalness: 0.35, roughness: 0.32 }));
torus.position.set(0, 2.18, -0.72);
torus.rotation.set(0.82, 0.15, 0.28);
torus.castShadow = true;
scene.add(torus);

const cone = new THREE.Mesh(new THREE.ConeGeometry(0.37, 0.85, 32), new THREE.MeshNormalMaterial());
cone.position.set(2.15, 0.62, 1.55);
cone.castShadow = true;
scene.add(cone);

// Decorative floor marks tie the scene to the origin without extra textures.
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.012, 6, 120), new THREE.MeshBasicMaterial({ color: 0x36738a, transparent: true, opacity: 0.55 }));
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.205;
scene.add(ring);

const clock = new THREE.Clock();
let animationEnabled = true;
const toggle = document.querySelector('#motion-toggle');
function setAnimation(enabled) {
  animationEnabled = enabled;
  toggle.textContent = enabled ? 'Jeda animasi' : 'Lanjutkan animasi';
  const key = document.createElement('kbd');
  key.textContent = 'Space';
  toggle.append(' ', key);
  toggle.setAttribute('aria-pressed', String(!enabled));
}
toggle.addEventListener('click', () => setAnimation(!animationEnabled));
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !event.repeat) {
    event.preventDefault();
    setAnimation(!animationEnabled);
  }
});

const info = document.querySelector('#scene-info');
info.textContent = `${scene.children.filter((child) => child.isMesh).length} mesh · Three.js`;

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  if (animationEnabled) {
    box.rotation.y += 0.34 * delta;
    sphere.position.y = 0.97 + Math.sin(elapsed * 1.3) * 0.12;
    torus.rotation.z += 0.2 * delta;
    keyLight.position.x = Math.cos(elapsed * 0.32) * 4.2;
    keyLight.position.z = 3 + Math.sin(elapsed * 0.32) * 2;
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});
