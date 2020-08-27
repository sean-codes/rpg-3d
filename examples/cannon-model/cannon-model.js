// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)
const loader = new THREE.FBXLoader()

// camera
camera.position.z = 5
camera.position.y = 5
// camera.position.x = -2
camera.lookAt(0, 0, 0)

// lighting
const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight('#FFF', 0.75)
dirLight.position.y += 60
dirLight.position.z += 15
dirLight.position.x += 15
dirLight.castShadow = true
dirLight.shadow.camera.right = 10
dirLight.shadow.camera.left = -10
dirLight.shadow.camera.top = 10
dirLight.shadow.camera.bottom = -10
dirLight.shadow.mapSize.width = 1024
dirLight.shadow.mapSize.height = 1024
scene.add(dirLight)
// const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
// scene.add(dirLightCameraHelper)
// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
// scene.add(dirLightHelper)

// physics
const world = new CANNON.World()
world.gravity.set(0, -40, 0)
const physicsObjects = []

// ground
const groundGeo = new THREE.BoxGeometry(10, 0.5, 10)
const groundMat = new THREE.MeshPhongMaterial({ color: '#FFF' })
const groundMes = new THREE.Mesh(groundGeo, groundMat)
groundMes.castShadow = true
groundMes.receiveShadow = true
scene.add(groundMes)

const groundBod = new CANNON.Body({
   mass: 0,
   shape: new CANNON.Box(new CANNON.Vec3(5, 0.25, 5)),
   position: new CANNON.Vec3(groundMes.position.x, groundMes.position.y, groundMes.position.z),
})
physicsObjects.push({ body: groundBod, mesh: groundMes })
world.add(groundBod)


// const boxGeo = new THREE.BoxGeometry()
// const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
// const boxMes = new THREE.Mesh(boxGeo, boxMat)
// boxMes.rotation.z -= Math.PI*0.25
// boxMes.rotation.x -= Math.PI*0.25
// boxMes.castShadow = true
// boxMes.receiveShadow = true
// boxMes.position.y = 2
// scene.add(boxMes)
// 
// const quaternion = new CANNON.Quaternion()
// quaternion.setFromEuler(boxMes.rotation.x, boxMes.rotation.y, boxMes.rotation.z, 'XYZ')
// const boxBod = new CANNON.Body({
//    mass: 1,
//    quaternion: quaternion,
//    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
//    position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
// })
// physicsObjects.push({ body: boxBod, mesh: boxMes })
// world.add(boxBod)


// load a model
// try
// ../../assets/models/monkey
// ../../assets/models/cone
// ../../assets/models/cube
loader.load('../../assets/models/cone.fbx', (object) => { try {
   console.log('loaded', object)
   let mesh = undefined
   // object.position.y += 2
   object.traverse(part => {
      if (part.type === 'Mesh') {
         mesh = part
         part.receiveShadow = true
         part.castShadow = true
         part.scale.x = 0.5
         part.scale.y = 0.5
         part.scale.z = 0.5
      }
   })
   
   console.log('meow', mesh.geometry)
   const geometry = new THREE.Geometry()
   geometry.fromBufferGeometry(mesh.geometry)
   geometry.mergeVertices()
   console.log('hello', geometry)
   const convexGeo = new THREE.ConvexGeometry(geometry.vertices)
   console.log(';uhhh', convexGeo)
   const verts = convexGeo.vertices.map(v => {
      return new CANNON.Vec3(v.x*150, v.y*150, v.z*150)
   })
   
   const faces = convexGeo.faces.map(f => {
      return [f.a, f.b, f.c]
   })
   console.log('hello', verts, faces)
   const quaternion = new CANNON.Quaternion()
   quaternion.setFromEuler(Math.PI*(Math.random()*2), 0, Math.PI*1.95, 'XYZ')
   const boxBod = new CANNON.Body({
      mass: 1,
      quaternion: quaternion,
      position: new CANNON.Vec3(0, 2, 0),
      shape: THREE.threeToCannon(mesh, { type: THREE.threeToCannon.Type.HULL })
   })
   // const shape = 
   // console.log(shape)
   // boxBod.addShape(shape)
   // boxBod.addShape(new CANNON.ConvexPolyhedron(verts, faces))
   physicsObjects.push({ body: boxBod, mesh: mesh })
   world.add(boxBod)
   
   scene.add(object)
} catch(e) { console.error(e) }})

var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );

// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   world.step(1/60)

   for (const { mesh, body } of physicsObjects) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
   }
   
   cannonDebugRenderer.update()
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
