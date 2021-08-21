// Could not find a model viewer that supported opening multiple models
// Ok this code is an absolute mess.


// init
const scene = new THREE.Scene()
scene.background = new THREE.Color('rgb(34, 34, 34)')
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
const controls = new THREE.OrbitControls(camera, renderer.domElement)
const fbxLoader = new THREE.FBXLoader()
const GUI = new dat.GUI({ closed: false });



// lighting
const pointLight = new THREE.PointLight('#FFF', 1, 10000)
pointLight.position.x = 10
pointLight.position.z = 10
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
scene.add(ambientLight)

// config
GUI.add(ambientLight, 'intensity', 0, 5, 0.1).name('Ambient Light')
GUI.add(pointLight, 'intensity', 0, 5, 0.1).name('Point Light 1')


const object = fbxLoader.load('../../assets/blender_practice/cube_person_textured.fbx', (object) => {
   console.log('Loading FBX file', object)
   object.traverse((part) => {
      // flat shading
      if (part.material) {
         const makeMaterialFlat = (material) => {
            material.flatShading = true
            material.reflectivity = 0
            material.shininess = 0
         }

         if (part.material.length) part.material.forEach(makeMaterialFlat)
         else makeMaterialFlat(part.material)
      }
   })
   object.scale.x = 0.01
   object.scale.y = 0.01
   object.scale.z = 0.01
   scene.add(object)
   camera.position.z = 5
})


// -----------------------------------------------------------------------------
// render / resize code
// -----------------------------------------------------------------------------
function render() {
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
