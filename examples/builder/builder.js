BuilderUi({
   models: [
      { src: '../../assets/models/environment/Bush_1.fbx', name: 'Bush_1', scale: 0.01 },
      { src: '../../assets/models/environment/BushBerries_2.fbx', name: 'BushBerries_2', scale: 0.01 },
      { src: '../../assets/models/environment/Fence.fbx', name: 'Fence', scale: 0.01 },
      { src: '../../assets/models/environment/Grass_Short.fbx', name: 'Grass Short', scale: 0.01 },
      { src: '../../assets/models/environment/PineTree_Autumn_4.fbx', name: 'A Pine tree', scale: 0.01 },
      { src: '../../assets/models/environment/Rock_6.fbx', name: 'A rock', scale: 0.01 },
   ],
   onSelect: (object) => {
      setObject(object)
   }
})
const POINTER_MODES = { add: 1, select: 2 }

const scene = new THREE.Scene()
scene.background = new THREE.Color('#555')
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)
const pointerMode = POINTER_MODES.select

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.z += 5
camera.position.y += 5
camera.position.x += 5
camera.lookAt(0, 0, 0)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

const ambientLight = new THREE.AmbientLight('#FFF', 0.75)
scene.add(ambientLight)

const light = new THREE.PointLight('#FFF', 1, 5)
light.position.z = 1.5
light.position.x = 1
light.position.y = 2
scene.add(light)
const lightHelper = new THREE.PointLightHelper(light, 1)
scene.add(lightHelper)

const dirLight = new THREE.DirectionalLight('#FFF', 0.75)
dirLight.position.y += 60
dirLight.position.z += 15
dirLight.position.x += 15
dirLight.castShadow = true
dirLight.shadow.camera.right = 75
dirLight.shadow.camera.left = -75
dirLight.shadow.camera.top = 75
dirLight.shadow.camera.bottom = -75
dirLight.shadow.mapSize.width = 3840
dirLight.shadow.mapSize.height = 3840
scene.add(dirLight)
// helpers
// const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
// scene.add(dirLightCameraHelper)
// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
// scene.add(dirLightHelper)

const pointer = new THREE.Object3D()
scene.add(pointer)

// grid helper
// const gridHelper = new THREE.InfiniteGridHelper(1, 10)
// gridHelper.material.uniforms.uDistance.value = 100
// gridHelper.name = 'awd'
const gridHelper = new THREE.GridHelper(
   100, 
   100, 
   new THREE.Color(0, 0, 0),
   new THREE.Color(0, 0, 0),
)
scene.add( gridHelper );

// main plane
const planeGeo = new THREE.PlaneGeometry(100, 100)
const planeMat = new THREE.MeshPhongMaterial({ color: '#4F8146',  })
const planeMes = new THREE.Mesh(planeGeo, planeMat)
planeMat.reflectivity = 0
planeMat.shininess = 0
planeMat.flatShading = true
planeMes.rotation.x = Math.PI*-0.5
planeMes.position.y -= 0.01

planeMes.receiveShadow = true
planeMes.castShadow = true
scene.add(planeMes)

// ray caster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-1, -1)
let blockAdd = false
function onMouseMove(e) {
   const { clientX, clientY } = e
   mouse.x = (clientX / window.innerWidth) * 2 - 1
   mouse.y = -(clientY / window.innerHeight) * 2 + 1
   blockAdd = true
}
window.addEventListener('mousemove', onMouseMove, false)
window.addEventListener('mousedown', () => { blockAdd = false })
renderer.domElement.addEventListener('click', addObject)

function addObject(e) {
   if (e.shiftKey || e.metaKey || blockAdd || !pointer.children.length) return

   const object = THREE.SkeletonUtils.clone(pointer.children[0])
   object.position.copy(pointer.position)
   scene.add(object)
   pointerMode
}

function setObject(object) {
   pointer.remove(pointer.children[0])
   pointer.add(object)
}

function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)

   light.position.copy(camera.position)
   light.position.y += 2

   raycaster.setFromCamera(mouse, camera)
   const intersects = raycaster.intersectObjects(scene.children)

   for (let intersect of intersects) {
      if (intersect.object.uuid === planeMes.uuid) {
         pointer.position.copy(intersect.point)
      }
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
