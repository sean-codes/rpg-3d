// init
const scene = new THREE.Scene()
scene.background = new THREE.Color('#D9D9F3')
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const controls = new THREE.OrbitControls(camera, renderer.domElement)


// meshes
const cursor = new THREE.Object3D()
const geo = new THREE.BoxGeometry()
const mat = new THREE.MeshPhongMaterial({ color: '#FFF' })

const perRow = 20
const space = 15
const offset = perRow*space / 2
let iMesh = undefined

const loader = new THREE.FBXLoader()
loader.load('../../assets/models/monsters/FBX/Dragon_Edited.fbx', (object) => {
   console.log('Loaded object', object)
   
   // geometry + material out of the model
   const geometry = object.children[0].geometry
   const material = object.children[0].material
   console.log('geometry', geometry)
   console.log('material', material)
   
   // fixing scale based on the models scale
   const modelScale = 0.1 // made this up
   const scaleFix = object.children[0].scale.x / 10 * modelScale
   geometry.scale(scaleFix, scaleFix, scaleFix)
   geometry.rotateX(-Math.PI/2)
   
   // regular mesh
   // const mesh = new THREE.Mesh(geometry, material)
   // scene.add(mesh)
   
   // instanced mesh
   iMesh = new THREE.InstancedMesh(geometry, material, perRow*perRow*perRow)
   iMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
   
   scene.add(iMesh)
}, null, (e) => { throw e })


// lighting
const pointLight = new THREE.PointLight('#FFF', 1, offset*10)
pointLight.position.set(-offset*2, offset*2, offset*2)
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)


const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
ambientLight.position.set(10, 10, 10)
scene.add(ambientLight)


// move camera back
camera.position.z = offset*2
camera.position.y = offset*2
camera.position.x = offset*2
camera.lookAt(0, 0, 0)

// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   if (iMesh) {    
      let i = 0
      // cursor.rotation.x += 0.01
      cursor.rotation.y += 0.01
      for (var x = 0; x < perRow; x++) {
         for (var y = 0; y < perRow; y++) {
            for (var z = 0; z < perRow; z++) {
               cursor.position.set(x*space-offset, y*space-offset, z*space-offset)
               cursor.updateMatrix()
               iMesh.setMatrixAt(i, cursor.matrix)
               i++
            }
         }
      }
      
      iMesh.instanceMatrix.needsUpdate = true
   }
   
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
