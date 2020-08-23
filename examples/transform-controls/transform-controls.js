// init
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
camera.position.y = 5
document.body.appendChild(renderer.domElement)

const oControls = new THREE.OrbitControlss(camera, renderer.domElement)
const tControls = new THREE.TransformControls(camera, renderer.domElement)
scene.add(tControls)

tControls.addEventListener('dragging-changed', ({ value }) => {
   oControls.enabled = !value
})

const aLight = new THREE.AmbientLight('#FFF', 0.5)
scene.add(aLight)

const pLight = new THREE.PointLight('$FFF', 1, 5)
pLight.position.y += 2
pLight.position.z += 2
scene.add(pLight)

const gridHelper = new THREE.GridHelper(20, 20)
scene.add(gridHelper)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial({ color: '#FFF' })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

tControls.attach(mesh)


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

window.addEventListener('keydown', ({ keyCode }) => {
   const call = {
      '49': () => {
         tControls.setMode('translate')
      },
      
      '50': () => {
         tControls.setMode('rotate')
      },
      
      '51': () => {
         tControls.setMode('scale')
      },
      
      '187': () => {
         tControls.setSize(tControls.size + 0.1);
      },
      
      '189': () => {
         tControls.setSize(Math.max(tControls.size - 0.1, 0.1));
      },
      
      '16': () => {
         tControls.setTranslationSnap(1);
         tControls.setRotationSnap(THREE.MathUtils.degToRad( 15 ));
         tControls.setScaleSnap(0.25);
      },
   }[keyCode]
   
   call && call()
})

window.addEventListener('keyup', ({ keyCode }) => {
   if (keyCode === 16) {
      tControls.setTranslationSnap(null);
      tControls.setRotationSnap(null);
      tControls.setScaleSnap(null);
   }
})
