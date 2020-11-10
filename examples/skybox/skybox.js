// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

camera.position.z = 5

const skyColor = "#000"
const refColor = "#41b9ee"
const size = 50

// Sides
const skySidesCanvas = document.createElement('canvas')
const skySidesCtx = skySidesCanvas.getContext('2d')
skySidesCanvas.width = size
skySidesCanvas.height = size
skySidesCtx.fillStyle = skyColor
skySidesCtx.fillRect(0, 0, skySidesCanvas.width, skySidesCanvas.height)
var grd = skySidesCtx.createLinearGradient(0, skySidesCanvas.height, 0, 0);
grd.addColorStop(0, refColor);
grd.addColorStop(0.95, skyColor);
grd.addColorStop(1, skyColor);
skySidesCtx.fillStyle = grd;
skySidesCtx.fillRect(0, 0, skySidesCanvas.width, skySidesCanvas.height)


const skyImgSides = document.createElement('img')
skyImgSides.src = skySidesCanvas.toDataURL()
skyImgSides.crossOrigin = 'anonymous'

// Top
const skyTopCanvas = document.createElement('canvas')
const skyTopCtx = skyTopCanvas.getContext('2d')
skyTopCanvas.width = size
skyTopCanvas.height = size
skyTopCtx.fillStyle = skyColor
skyTopCtx.fillRect(0, 0, skyTopCanvas.width, skyTopCanvas.height)

const skyTopImage = document.createElement('img')
skyTopImage.src = skyTopCanvas.toDataURL()
skyTopImage.crossOrigin = 'anonymous'

// Bottom
const skyBottomCanvas = document.createElement('canvas')
const skyBottomCtx = skyBottomCanvas.getContext('2d')
skyBottomCanvas.width = size
skyBottomCanvas.height = size
skyBottomCtx.fillStyle = refColor
skyBottomCtx.fillRect(0, 0, skyBottomCanvas.width, skyBottomCanvas.height)

const skyBottomImage = document.createElement('img')
skyBottomImage.src = skyBottomCanvas.toDataURL()
skyBottomImage.crossOrigin = 'anonymous'

const skyCube = new THREE.CubeTexture(undefined, THREE.CubeRefractionMapping, undefined, undefined, THREE.NearestFilter)

let loading = 3
function doneLoadingCubeImages() {
   loading -- 
   if (!loading) {   
      skyCube.needsUpdate = true
   }
}

skyImgSides.addEventListener('load', () => {
   skyCube.images[0] = skyImgSides
   skyCube.images[1] = skyImgSides
   skyCube.images[4] = skyImgSides
   skyCube.images[5] = skyImgSides
   doneLoadingCubeImages()
})

skyTopImage.addEventListener('load', () => {
   skyCube.images[2] = skyTopImage
   doneLoadingCubeImages()
})

skyBottomImage.addEventListener('load', () => {
   skyCube.images[3] = skyBottomImage
   doneLoadingCubeImages()
})

scene.background = skyCube


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
