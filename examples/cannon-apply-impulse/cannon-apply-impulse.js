import * as CANNON from '../../node_modules/cannon-es/dist/cannon-es.js'
import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'

// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)
// const controls = new OrbitControls(camera, renderer.domElement)

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
// boxMes.rotation.z -= Math.PI*0.25
// boxMes.rotation.x -= Math.PI*0.25
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
world.addBody(groundBod)

const quaternion = new CANNON.Quaternion()
quaternion.setFromEuler(boxMes.rotation.x, boxMes.rotation.y, boxMes.rotation.z, 'XYZ')
const boxBod = new CANNON.Body({
   mass: 1,
   fixedRotation: true,
   quaternion: quaternion,
   shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
   position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
})
physicsObjects.push({ body: boxBod, mesh: boxMes })
world.addBody(boxBod)

const keyboard = {
   up: { code: [87, 38], down: false },
   down: { code: [83, 40], down: false },
   left: { code: [65, 37], down: false },
   right: { code: [68, 39], down: false },
}
window.addEventListener('keydown', e => {
   e.preventDefault()
   for (const keyName in keyboard) {
      const key = keyboard[keyName]
      if (key.code.includes(e.keyCode)) key.down = true
   }
})

window.addEventListener('keyup', e => {
   e.preventDefault()
   for (const keyName in keyboard) {
      const key = keyboard[keyName]
      if (key.code.includes(e.keyCode)) key.down = false
   }
})

// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)

   world.step(1 / 60)

   for (const { mesh, body } of physicsObjects) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
   }

   if (keyboard.up.down) {
      boxBod.applyImpulse(new CANNON.Vec3(0, 0, -40), new CANNON.Vec3(0, 0, 0))
   }
   if (keyboard.down.down) {
      boxBod.applyImpulse(new CANNON.Vec3(0, 0, 40), new CANNON.Vec3(0, 0, 0))
   }
   if (keyboard.left.down) {
      boxBod.applyImpulse(new CANNON.Vec3(-40, 0, 0), new CANNON.Vec3(0, 0, 0))
   }
   if (keyboard.right.down) {
      boxBod.applyImpulse(new CANNON.Vec3(40, 0, 0), new CANNON.Vec3(0, 0, 0))
   }
}
render()


// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth / window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()
