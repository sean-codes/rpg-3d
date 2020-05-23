// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const gui = new dat.GUI();

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
document.body.appendChild(renderer.domElement);
window.onresize = resize;

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 8);
// camera.lookAt(0, 0, 0);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();


// a plane with a texture
const planeSize = 20;

const loader = new THREE.TextureLoader();
const checkerTexture = loader.load('./src/assets/checker.png');
checkerTexture.wrapS = THREE.RepeatWrapping;
checkerTexture.wrapT = THREE.RepeatWrapping;
checkerTexture.magFilter = THREE.NearestFilter;
const repeats = planeSize;
checkerTexture.repeat.set(repeats, repeats);

const planeGeometry = new THREE.PlaneBufferGeometry(planeSize, planeSize);
const planeMaterial = new THREE.MeshPhongMaterial({ map: checkerTexture, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = Math.PI * -0.5;
planeMesh.receiveShadow = true
scene.add(planeMesh);

// shadow
// const shadowGeometry = new THREE.PlaneBufferGeometry(planeSize, planeSize);
// const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
// const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
// shadowMesh.rotation.x = Math.PI * -0.5;
// shadowMesh.position.y += 0.001;
// shadowMesh.scale.set(0.25, 0.25, 0.25);
// scene.add(shadowMesh);

// a circle
const sunGeometry = new THREE.SphereBufferGeometry();
const sunMaterial = new THREE.MeshPhongMaterial({ color: '#a2f', flatShading: true })
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.y += 1.5;
sunMesh.scale.set(1, 1, 1)
sunMesh.castShadow = true;
sunMesh.receiveShadow = true;
scene.add(sunMesh);

// a circle shadow
const shadowTexture = loader.load('./src/assets/roundshadow.png');
const shadowGeometry = new THREE.PlaneBufferGeometry();
const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true });
const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
shadowMesh.rotation.x = Math.PI * -0.5;
shadowMesh.position.y += 0.001;
shadowMesh.scale.set(5, 5, 5);
scene.add(shadowMesh);
//  light
const light = new THREE.PointLight("#FFF", 1);
// light.castShadow = true
light.position.set(0, 8, 0);
// light.shadow.mapSize.width = 2024;  // default
// light.shadow.mapSize.height = 2048; // default
// light.shadow.camera.near = 0.5;       // default
// light.shadow.camera.far = 20;      // default
// light.shadow.radius = 10;
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light, 1, '#F22');
scene.add(lightHelper);
//
// const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(lightCameraHelper);


// ambient light
const ambientLight = new THREE.HemisphereLight("#FFF", "#00F", 0.5);
scene.add(ambientLight)


// const targetFolder = gui.addFolder('target')
// targetFolder.add(light.target.position, 'x', -10, 10).onChange(updateLight);
// targetFolder.add(light.target.position, 'y', -10, 10).onChange(updateLight);
// targetFolder.add(light.target.position, 'z', -10, 10).onChange(updateLight);
// targetFolder.add(light, 'intensity', 0, 1);
// targetFolder.open();

const lightFolder = gui.addFolder('light')
lightFolder.add(light.position, 'x', -10, 10);
lightFolder.add(light.position, 'y', -10, 10);
lightFolder.add(light.position, 'z', -10, 10);
lightFolder.add(light, 'distance', 1, 50);
lightFolder.add(light, 'intensity', 0, 1);
lightFolder.open();



// light
// const light = new THREE.DirectionalLight();
// light.position.z += 2
// scene.add(light);


function resize() {
  console.log('resizing');
  const pixelRatio = window.devicePixelRatio
  const width = window.innerWidth * pixelRatio
  const height = window.innerHeight * pixelRatio
  renderer.domElement.width = width;
  renderer.domElement.height = height;
  renderer.setSize(width, height, false);
  camera.aspect = width/height;
  camera.updateProjectionMatrix();
  // lightHelper.update();
}

function render(time) {
  // console.log(time)
  const timeInSeconds = time / 1000
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  // sunMesh.rotation.x -= 0.01;
  // sunMesh.rotation.y -= 0.01;

  const zeroToOne = Math.abs(Math.sin(timeInSeconds * 2));
  sunMesh.position.y = 2 + THREE.Math.lerp(-1, 1, zeroToOne)

  shadowMesh.material.opacity = THREE.Math.lerp(1, 0.25, zeroToOne)
}


resize();
requestAnimationFrame(render)
