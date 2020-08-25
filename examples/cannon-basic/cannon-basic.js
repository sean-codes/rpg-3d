// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

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

// ground
const groundGeo = new THREE.BoxGeometry(10, 0.5, 10)
const groundMat = new THREE.MeshPhongMaterial({ color: '#FFF' })
const groundMes = new THREE.Mesh(groundGeo, groundMat)
groundMes.castShadow = true
groundMes.receiveShadow = true
scene.add(groundMes)

const boxGeo = new THREE.BoxGeometry()
const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
const boxMes = new THREE.Mesh(boxGeo, boxMat)
boxMes.rotation.z -= Math.PI*0.25
boxMes.rotation.x -= Math.PI*0.25
boxMes.castShadow = true
boxMes.receiveShadow = true
boxMes.position.y = 2
scene.add(boxMes)

// physics
const world = new CANNON.World()
world.gravity.set(0, -40, 0)

const physicsObjects = []
const groundBod = new CANNON.Body({
   mass: 0,
   shape: new CANNON.Box(new CANNON.Vec3(5, 0.25, 5)),
   position: new CANNON.Vec3(groundMes.position.x, groundMes.position.y, groundMes.position.z),
})
physicsObjects.push({ body: groundBod, mesh: groundMes })
world.add(groundBod)

const quaternion = new CANNON.Quaternion()
quaternion.setFromEuler(boxMes.rotation.x, boxMes.rotation.y, boxMes.rotation.z, 'XYZ')
const boxBod = new CANNON.Body({
   mass: 1,
   quaternion: quaternion,
   shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
   position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
})
physicsObjects.push({ body: boxBod, mesh: boxMes })
world.add(boxBod)





// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   world.step(1/60)

   for (const { mesh, body } of physicsObjects) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
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
