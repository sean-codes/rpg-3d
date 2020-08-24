// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

// const geometry = new THREE.BoxGeometry()
const geometry = new THREE.Geometry()
geometry.vertices.push(
   new THREE.Vector3(-1, -1, 0), 
   new THREE.Vector3(1, -1, 0),
   new THREE.Vector3(-1, 1, 0),
   new THREE.Vector3(1, 1, 0),
)

geometry.faces.push(
   new THREE.Face3(0, 3, 2),
   new THREE.Face3(0, 1, 3)
)

const material = new THREE.MeshBasicMaterial({ color: '#FFF' })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
camera.position.z = 5


// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   mesh.rotation.x += 0.01
   mesh.rotation.y += 0.01
}
render()


// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()
