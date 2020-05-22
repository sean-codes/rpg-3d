# Rendering a basic cube
For this project I'm going to use three.js for setting up and rendering the 3D scene.

To make a box we need to setup three and attach its canvas to the dom

```js
// general three js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// create a render loop
function render() {
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
}
```

Then create a mesh

```js
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xaa00aa });
const cube = new THREE.Mesh(geometry, material);
```

Add that mesh to the scene

```js
scene.add(cube);
```

Back up the camera to see the cube
```js
camera.position.z = 5;
```
