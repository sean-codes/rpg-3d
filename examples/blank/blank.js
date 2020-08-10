// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
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
