// Could not find a model viewer that supported opening multiple models
// Ok this code is an absolute mess.


// init
const scene = new THREE.Scene()
scene.background = new THREE.Color('rgb(34, 34, 34)')
const renderer = new THREE.WebGLRenderer({ capabilities: { isWebGL2: true } })
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
var loading = 2
let textures = {}
new THREE.TextureLoader().load('../../assets/blender_practice/cube_person_texture_2.png', (texture) => {
   console.log('loaded texture', texture)
   textures.lines = texture
   texture.flipY = false
   texture.magFilter = THREE.NearestFilter
   doneLoading()
})

let object_glb = undefined
gltfLoader.load('../../assets/blender_practice/cube_person_textured.glb', (loadedObject) => {
   object_glb = loadedObject.scene.children[0]
   console.log('Loading GLB file', object_glb)
   object_glb.position.x += 2
   scene.add(object_glb)
   doneLoading()
   
})

function doneLoading() {
   loading -= 1
   if (!loading) {
      console.log('hi')
      object_glb.material.map = textures.lines
      object_glb.material.needsUpdate = true

   }
}
let object_fbx = undefined
// fbxLoader.load('../../assets/blender_practice/cube_person_textured.fbx', (loadedObject) => {
//    console.log('Loading FBX file', loadedObject)
//    object_fbx = loadedObject
//    object_fbx.scale.x = 0.01
//    object_fbx.scale.y = 0.01
//    object_fbx.scale.z = 0.01
//    object_fbx.position.x -= 2
//    scene.add(object_fbx)
// })


// -----------------------------------------------------------------------------
// render / resize code
// -----------------------------------------------------------------------------
function render() {
   if (object_glb) object_glb.rotation.y += 0.01
   if (object_fbx) object_fbx.rotation.y += 0.01
   
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
