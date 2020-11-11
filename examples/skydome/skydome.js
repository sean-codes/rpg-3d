// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)
camera.position.z = 0.0000001

// settings
var settings = {
  skyColor: "#aa9ed7",
  refColor: "#0f0b18",
  canvasSize: 2048,
  starCount: 10000,
  size: 20,
  transition: 0.4,
}

const datGui = new dat.GUI()
datGui.add(settings, 'size', 0, 2048, 1).onChange(updateSky);
datGui.add(settings, 'transition', 0, 1, 0.05).onChange(updateSky);
datGui.add(settings, 'starCount', 0, 50000, 10).onChange(updateSky);
datGui.addColor(settings, 'skyColor').onChange(updateSky);
datGui.addColor(settings, 'refColor').onChange(updateSky);

// texture
const skyCanvas = document.createElement('canvas')
const skyCtx = skyCanvas.getContext('2d')
const skyTexture = new THREE.CanvasTexture(skyCanvas)

// add mesh
const geo = new THREE.SphereGeometry(50)
const mat = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide })
const mes = new THREE.Mesh(geo, mat)
scene.add(mes)

// on change
function updateSky() {
   skyCanvas.width = settings.canvasSize
   skyCanvas.height = settings.canvasSize
   skyCtx.fillStyle = settings.skyColor
   skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height)
   var grd = skyCtx.createLinearGradient(0, 0, 0, skyCanvas.height);
   grd.addColorStop(0, settings.refColor);
   grd.addColorStop(settings.transition, settings.refColor);
   grd.addColorStop(1, settings.skyColor);
   skyCtx.fillStyle = grd;
   skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height)
   
   for (var i = 0; i < settings.starCount; i++) {
      skyCtx.fillStyle = `rgba(255, 255, 255, ${0.25 + Math.random()*0.75})`;
      const x = Math.random()*skyCanvas.width
      const y = Math.random()*skyCanvas.height/2 + Math.random()*skyCanvas.height*0.25
      const size = Math.random()*2
      skyCtx.fillRect(x, y, size, size)
   }
   
   skyTexture.needsUpdate = true
}

updateSky()




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
