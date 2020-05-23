// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const gui = new dat.GUI();

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 8);
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
planeMesh.receiveShadow = true;
planeMesh.rotation.x = Math.PI * -0.5;
scene.add(planeMesh);

// a circle
const sunGeometry = new THREE.SphereBufferGeometry();
const sunMaterial = new THREE.MeshPhongMaterial({ color: '#a2f', flatShading: true });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.receiveShadow = true
sunMesh.castShadow = true
sunMesh.position.y += 1.5;
sunMesh.scale.set(1, 1, 1);
scene.add(sunMesh);

// a rectangle
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhongMaterial({ color: '#465', flatShadwing: true });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.receiveShadow = true;
cubeMesh.castShadow = true;
cubeMesh.position.y += 1;
cubeMesh.position.x += 3;
cubeMesh.scale.set(2, 2, 2);
scene.add(cubeMesh);


//  light
const light = new THREE.DirectionalLight("#FFF", 1);
light.castShadow = true;
light.position.set(-6, 8, -4);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);


const lightHelper = new THREE.DirectionalLightHelper(light);
scene.add(lightHelper);

const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(lightCameraHelper);

function onLightChange() {
  // light.target.updateMatrixWorld();
  lightHelper.update();
  // lightCameraHelper.update();
}
// ambient light
const ambientLight = new THREE.AmbientLight("#FFF", 0.5);
scene.add(ambientLight)


const lightFolder = gui.addFolder('light')
lightFolder.add(light.position, 'x', -10, 10).onChange(onLightChange);
lightFolder.add(light.position, 'y', -10, 10).onChange(onLightChange)
lightFolder.add(light.position, 'z', -10, 10).onChange(onLightChange);
// lightFolder.add(light, 'distance', 1, 50);
// lightFolder.add(light, 'intensity', 0, 1);
lightFolder.open();


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

  // shadowMesh.material.opacity = THREE.Math.lerp(1, 0.25, zeroToOne)
}


// Attach and start the engine!
document.body.appendChild(renderer.domElement);
window.onresize = resize;
resize();
requestAnimationFrame(render)
