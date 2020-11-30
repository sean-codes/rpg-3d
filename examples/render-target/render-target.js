// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// const aspect = window.innerWidth / window.innerHeight
// console.log(aspect)
// const camera = new THREE.OrthographicCamera(-5*aspect, 5*aspect, -5, 5, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)


// light
const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight('#FFF', 1)
pointLight.position.x += 2
pointLight.position.y += 2
pointLight.position.z += 2
scene.add(pointLight)

// shapes
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial({ color: '#F22' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

camera.position.z = 5



// render camera to that
const renderTarget = new THREE.WebGLRenderTarget(512, 512)
console.log(renderTarget)
// const rtCamera = new THREE.OrthographicCamera(500, 500, 1, 1000)
const rtCamera = new THREE.OrthographicCamera(1, -1, 1, -1, 0.1, 1000)
rtCamera.position.z = -5
rtCamera.lookAt(0, 0, 0)
// const rtScene = ne
// plane to render target
const planeGeo = new THREE.PlaneGeometry(5, 5, 1)
const planeMat = new THREE.MeshBasicMaterial({ 
   map: renderTarget.texture, 
   // color: '#000',
   combine: THREE.Multiply
})
const planeMes = new THREE.Mesh(planeGeo, planeMat)
scene.add(planeMes)
planeMes.position.x += 10


// render
function render() {
   requestAnimationFrame(render)
   
   // try render target out
   scene.background = new THREE.Color('#FFF')
   renderer.setRenderTarget(renderTarget)
   renderer.render(scene, rtCamera)
   
   scene.background = new THREE.Color('#000')
   renderer.setRenderTarget(null)
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
