const builderUi = new BuilderUi({
   models: [
      { src: '../../assets/models/environment/Bush_1.fbx', name: 'Bush', scale: 0.01 },
      { src: '../../assets/models/environment/BushBerries_2.fbx', name: 'Bush Berries', scale: 0.01 },
      { src: '../../assets/models/environment/Fence.fbx', name: 'Fence', scale: 0.01 },
      { src: '../../assets/models/environment/Grass_Short.fbx', name: 'Grass Short', scale: 0.01 },
      { src: '../../assets/models/environment/PineTree_Autumn_4.fbx', name: 'Pine tree', scale: 0.01 },
      { src: '../../assets/models/environment/Rock_6.fbx', name: 'Rock', scale: 0.01 },
      { src: '../../assets/models/environment/grass_ledge_1.fbx', name: 'Grass Ledge', scale: 0.01 },
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
renderer.domElement.tabIndex = 1
renderer.gammaOutput = true
document.body.appendChild(renderer.domElement)
const pointerMode = POINTER_MODES.select
const selectedObject = undefined
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
// camera.position.z += 5
// camera.position.y += 5
// camera.position.x += 5
// camera.lookAt(0, 0, 0)
// const oControls = new THREE.OrbitControls(camera, renderer.domElement)
const fControls = new THREE.FlyControls(camera, renderer.domElement)
scene.add(fControls.object)
const tControls = new THREE.TransformControls(camera, renderer.domElement)
scene.add(tControls)

const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
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

const gridHelper = new THREE.GridHelper(
   100, 
   100, 
   '#567d46',
   '#567d46',
)
scene.add( gridHelper );

// main plane
const planeGeo = new THREE.PlaneGeometry(100, 100)
const planeMat = new THREE.MeshPhongMaterial({ color: '#4F8146' })//97BC8F
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
let select = false
let tControlSelect = false
const addedObjects = []
function onMouseMove(e) {
   const { clientX, clientY } = e
   mouse.x = (clientX / window.innerWidth) * 2 - 1
   mouse.y = -(clientY / window.innerHeight) * 2 + 1
   blockAdd = true
}
window.addEventListener('mousemove', onMouseMove, false)
window.addEventListener('mousedown', () => { 
   blockAdd = false; 
   if (!tControlSelect) select = true 
})
renderer.domElement.addEventListener('click', addObject)

tControls.addEventListener('mouseDown', () => {
   tControlSelect = true
})
tControls.addEventListener('dragging-changed', ({ value }) => {
   fControls.enabled = !value
})
tControls.addEventListener('objectChange', ({ value }) => {
   builderUi.onChangeObject(tControls.object)
   // console.log('changing', tControls.object)
})

function addObject(e) {
   if (e.shiftKey || e.metaKey || blockAdd || !pointer.children.length) return

   const object = THREE.SkeletonUtils.clone(pointer.children[0])
   object.position.copy(pointer.position)
   scene.add(object)
   addedObjects.push(object)
   // pointerMode
   pointer.remove(pointer.children[0])
   tControls.attach(object)
   builderUi.onChangeObject(object)
}

function setObject(object) {
   pointer.remove(pointer.children[0])
   pointer.add(object)
   renderer.domElement.focus()
}

window.addEventListener('keydown', ({ keyCode, metaKey }) => {
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
      
      '90': () => {
         if (metaKey) {
            console.log('ctrl-z')
            
         }
      },
      
      '8': () => {
         const selected = tControls.object
         addedObjects.filter(o => o.uuid !== selected.uuid)
         scene.remove(selected)
         tControls.detach()
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


function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)

   light.position.copy(camera.position)
   light.position.y += 2

   raycaster.setFromCamera(mouse, camera)
   // pointer to grid
   const intersects = raycaster.intersectObjects(scene.children)
   for (let intersect of intersects) {
      if (intersect.object.uuid === gridHelper.uuid) continue
      if (intersect.object.uuid === planeMes.uuid) {
         pointer.position.copy(intersect.point)
         continue
      }
   }
   
   // objects
   if (select) {
      tControls.detach()
   }
   const intersectsObjects = raycaster.intersectObjects(addedObjects, true)
   for (let intersect of intersectsObjects) {
      if (select) {
         const object = rootParent(intersect.object)

         select = false
         tControls.attach(object)
         builderUi.onChangeObject(object)
      }
   }
   
   select = false
   tControlSelect = false
}

function rootParent(object) {
   if (object.parent && object.parent.type !== 'Scene') return rootParent(object.parent)
   return object
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
