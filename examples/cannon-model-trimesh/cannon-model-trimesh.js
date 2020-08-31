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
const groundGeo = new THREE.PlaneGeometry(10, 10)
const groundMat = new THREE.MeshPhongMaterial({ color: '#FFF' })
const groundMes = new THREE.Mesh(groundGeo, groundMat)
groundMes.castShadow = true
groundMes.receiveShadow = true
groundMes.rotation.x -= Math.PI*0.5
scene.add(groundMes)
const quaternion = new CANNON.Quaternion()
quaternion.setFromEuler(groundMes.rotation.x, groundMes.rotation.y, groundMes.rotation.z, 'XYZ')
const groundBod = new CANNON.Body({
   mass: 0,
   quaternion: quaternion,
   shape: new CANNON.Plane(new CANNON.Vec3(5, 0.25, 5)),
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
loader.load('../../assets/models/monkey.fbx', (object) => { try {
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

   const quaternion = new CANNON.Quaternion()
   quaternion.setFromEuler(Math.PI*(Math.random()*2), 0, Math.PI*1.95, 'XYZ')
   const boxBod = new CANNON.Body({
      mass: 1,
      quaternion: quaternion,
      position: new CANNON.Vec3(0, 2, 0),
      shape: createTrimeshFromModel(object)
   })

   physicsObjects.push({ body: boxBod, mesh: mesh })
   world.add(boxBod)
   scene.add(object)
} catch(e) { console.error(e) }})

// keep in mind. trimmesh compatibility table.
// can only collide with circle and plane
function createTrimeshFromModel(object) {
   let mesh = getMesh(object)
   mesh.updateMatrixWorld()
   const geometry = new THREE.Geometry()
   geometry.fromBufferGeometry(mesh.geometry)
   geometry.scale(mesh.scale.x, mesh.scale.y, mesh.scale.x)
    
   // get vertices and faces for cannon
   const vertices = geometry.vertices.map(v => new CANNON.Vec3(v.x, v.y, v.z));
   const faces = geometry.faces.map(f => [f.a, f.b, f.c]);
   
   return new CANNON.ConvexPolyhedron(vertices, faces);
}

function getMesh(object) {
   let mesh = undefined
   object.traverse(part => mesh = part.type === 'Mesh' ? part : mesh)
   return mesh
}



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
