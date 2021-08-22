// Could not find a model viewer that supported opening multiple models
// Ok this code is an absolute mess.


// init
const scene = new THREE.Scene()
scene.background = new THREE.Color('rgb(34, 34, 34)')
const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
const controls = new THREE.OrbitControls(camera, renderer.domElement)
const fbxLoader = new THREE.FBXLoader()
const gltfLoader = new THREE.GLTFLoader()
const GUI = new dat.GUI({ closed: false });
camera.position.z = 5


// lighting
const pointLight = new THREE.PointLight('#FFF', 1, 10000)
pointLight.position.x = 40
pointLight.position.z = 40
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight('#FFF', 1.0)
scene.add(ambientLight)

// config
GUI.add(ambientLight, 'intensity', 0, 10, 0.1).name('Ambient Light')
GUI.add(pointLight, 'intensity', 0, 5, 0.1).name('Point Light 1')

let loading = 2 // for checking when laoding is finished

let texture = undefined
new THREE.TextureLoader().load('../../assets/blender_practice/pixel_sign.png', (loadedTexture) => {
   console.log('loaded texture', texture)
   texture = loadedTexture
   texture.flipY = false
   texture.magFilter = THREE.NearestFilter
   texture.minFilter = THREE.NearestFilter
   doneLoading()
})

let object_glb = undefined
gltfLoader.load('../../assets/blender_practice/pixel_sign.glb', (loadedObject) => {
   object_glb = loadedObject.scene.children[0]
   console.log('Loaded GLB', object_glb)
   
   scene.add(object_glb)
   doneLoading()
})

function doneLoading() {
   loading -= 1
   if (!loading) {
      object_glb.material.map = texture
      object_glb.material.needsUpdate = true
   }
}


// -----------------------------------------------------------------------------
// render / resize code
// -----------------------------------------------------------------------------
function render() {
   // if (object_glb) object_glb.rotation.y += 0.01
   
   requestAnimationFrame(render)
   renderer.render(scene, camera)
}
render()

function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()
