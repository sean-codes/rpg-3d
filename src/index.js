// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// lets render a cube!
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xaa00aa });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

render();
