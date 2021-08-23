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

let loading = 4 // for checking when laoding is finished

let textures = [
   { url: '../../assets/blender_practice/cube_person_pixel_01.png' },
   { url: '../../assets/blender_practice/cube_person_pixel_02.png' },
   { url: '../../assets/blender_practice/cube_person_pixel_03.png' },
]

for (let texture of textures) {
   new THREE.TextureLoader().load(texture.url, (loadedTexture) => {
      console.log('loaded texture', loadedTexture)
      loadedTexture.flipY = false
      loadedTexture.magFilter = THREE.NearestFilter
      loadedTexture.minFilter = THREE.NearestFilter
      texture.loaded = loadedTexture
      doneLoading()
   })
}

let object_glb = undefined
gltfLoader.load('../../assets/blender_practice/cube_person_pixel.glb', (loadedObject) => {
   object_glb = loadedObject.scene.children[0]
   console.log('Loaded GLB', object_glb)
   
   scene.add(object_glb)
   doneLoading()
})

let textureId = 0
function doneLoading() {
   loading -= 1
   if (!loading) {
      object_glb.material.map = textures[textureId].loaded
      object_glb.material.needsUpdate = true
      
      window.addEventListener('keyup', e => {
         if (e.code === 'Space') {
            textureId += 1
            if (textureId === textures.length) textureId = 0
            object_glb.material.map = textures[textureId].loaded // unnessesary duplicate :)
            object_glb.material.needsUpdate = true
         }
      })
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
