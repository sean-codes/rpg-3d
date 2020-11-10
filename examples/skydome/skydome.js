// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

camera.position.z = 0.0001

const skyColor = "#FFF"
// const refColor = "#41b9ee"
const refColor = "#7F00FF"
const size = 50

// Sides
const skyCanvas = document.createElement('canvas')
const skyCtx = skyCanvas.getContext('2d')
skyCanvas.width = size
skyCanvas.height = size
skyCtx.fillStyle = skyColor
skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height)
var grd = skyCtx.createLinearGradient(0, 0, 0, skyCanvas.height);
grd.addColorStop(0, refColor);
grd.addColorStop(0.75, skyColor);
grd.addColorStop(0.9, skyColor);
skyCtx.fillStyle = grd;
skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height)


const skyImg = document.createElement('img')
skyImg.src = skyCanvas.toDataURL()
skyImg.crossOrigin = 'anonymous'

skyImg.addEventListener('load', () => {
   const geo = new THREE.SphereGeometry(20, 60, 40)
   const mat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(skyCanvas), side: THREE.BackSide })
   const mes = new THREE.Mesh(geo, mat)
   scene.add(mes)
})


// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
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
