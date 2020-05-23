// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;


// lets render a cube!
const geometry = new THREE.BoxGeometry();
const material1 = new THREE.MeshPhongMaterial({ color: "#465" });
const material2 = new THREE.MeshPhongMaterial({ color: "#F22" });
const material3 = new THREE.MeshPhongMaterial({ color: "#666" });
const cube1 = new THREE.Mesh(geometry, material1);
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.set(2, 0, 0);
const cube3 = new THREE.Mesh(geometry, material3);
cube3.position.set(-2, 0, 0);
scene.add(cube1);
scene.add(cube2);
scene.add(cube3);

// Add a light
const light = new THREE.DirectionalLight("#FFF", 1);
light.position.set(2, 2, 4);
scene.add(light);


function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);


  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;

  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;

  cube3.rotation.x += 0.01;
  cube3.rotation.y += 0.01;
}

render();
