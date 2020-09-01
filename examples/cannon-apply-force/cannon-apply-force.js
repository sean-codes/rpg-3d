import * as CANNON from '../../node_modules/cannon-es/dist/cannon-es.js'
import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { CannonDebugRenderer } from '../../node_modules/cannon-es-debugger-jsm/index.js'

// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)

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




// physics
const world = new CANNON.World()
const cannonDebugger = new CannonDebugRenderer(scene, world)
world.gravity.set(0, -60, 0)
const physicsObjects = []

const phyMaterialGround = new CANNON.Material({ friction: 0.1, restitution: 0 })
window.phyMaterialGround = phyMaterialGround
//ground
const groundGeo = new THREE.BoxGeometry(20, 0.5, 10)
const groundMat = new THREE.MeshPhongMaterial({ color: '#FFF' })
const groundMes = new THREE.Mesh(groundGeo, groundMat)
groundMes.castShadow = true
groundMes.receiveShadow = true
scene.add(groundMes)

const groundBod = new CANNON.Body({
   mass: 0,
   material: phyMaterialGround,
   shape: new CANNON.Box(new CANNON.Vec3(10, 0.25, 5)),
   position: new CANNON.Vec3(groundMes.position.x, groundMes.position.y, groundMes.position.z),
})
physicsObjects.push({ body: groundBod, mesh: groundMes })
world.addBody(groundBod)

//box
const boxGeo = new THREE.SphereGeometry(1)
const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
boxMat.flatShading = true
boxMat.reflectivity = 0
boxMat.shininess = 0
const boxMes = new THREE.Mesh(boxGeo, boxMat)
boxMes.castShadow = true
boxMes.receiveShadow = true
boxMes.position.y = 2
scene.add(boxMes)

const quaternion = new CANNON.Quaternion()
quaternion.setFromEuler(boxMes.rotation.x, boxMes.rotation.y, boxMes.rotation.z, 'XYZ')
const boxBod = new CANNON.Body({
   mass: 1,
   material: phyMaterialGround,
   fixedRotation: true,
   quaternion: quaternion,
   shape: new CANNON.Sphere(1),
   position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
})
physicsObjects.push({ body: boxBod, mesh: boxMes })
world.addBody(boxBod)

//ramp
{
   const ramp1Geo = new THREE.BoxGeometry(4, 0.25, 4)
   const ramp1Mat = new THREE.MeshPhongMaterial({ color: '#465' })
   const ramp1Mes = new THREE.Mesh(ramp1Geo, ramp1Mat)
   ramp1Mes.castShadow = true
   ramp1Mes.receiveShadow = true
   // ramp1Mes.rotation.z -= Math.PI*0.25
   ramp1Mes.rotation.z += Math.PI*0.15
   ramp1Mes.position.x = 9
   ramp1Mes.position.y = 1
   
   scene.add(ramp1Mes)

   const quaternion = new CANNON.Quaternion()
   quaternion.setFromEuler(ramp1Mes.rotation.x, ramp1Mes.rotation.y, ramp1Mes.rotation.z, 'XYZ')
   const ramp1Bod = new CANNON.Body({
      mass: 0,
      material: phyMaterialGround,
      fixedRotation: true,
      quaternion: quaternion,
      shape: new CANNON.Box(new CANNON.Vec3(2, 0.125, 2)),
      position: new CANNON.Vec3(ramp1Mes.position.x, ramp1Mes.position.y, ramp1Mes.position.z),
   })
   physicsObjects.push({ body: ramp1Bod, mesh: ramp1Mes })
   world.addBody(ramp1Bod)
}

{
   const ramp2Geo = new THREE.BoxGeometry(4, 0.25, 4)
   const ramp2Mat = new THREE.MeshPhongMaterial({ color: '#465' })
   const ramp2Mes = new THREE.Mesh(ramp2Geo, ramp2Mat)
   ramp2Mes.castShadow = true
   ramp2Mes.receiveShadow = true
   // ramp2Mes.rotation.z -= Math.PI*0.25
   ramp2Mes.rotation.z -= Math.PI*0.45
   ramp2Mes.position.x = -4
   ramp2Mes.position.y = 1
   
   scene.add(ramp2Mes)

   const quaternion = new CANNON.Quaternion()
   quaternion.setFromEuler(ramp2Mes.rotation.x, ramp2Mes.rotation.y, ramp2Mes.rotation.z, 'XYZ')
   const ramp2Bod = new CANNON.Body({
      mass: 0,
      material: phyMaterialGround,
      fixedRotation: true,
      quaternion: quaternion,
      shape: new CANNON.Box(new CANNON.Vec3(2, 0.125, 2)),
      position: new CANNON.Vec3(ramp2Mes.position.x, ramp2Mes.position.y, ramp2Mes.position.z),
   })
   physicsObjects.push({ body: ramp2Bod, mesh: ramp2Mes })
   world.addBody(ramp2Bod)
}

const keyboard = {
   up: { code: [87, 38], down: false },
   down: { code: [83, 40], down: false },
   left: { code: [65, 37], down: false },
   right: { code: [68, 39], down: false },
   jump: { code: [32], down: false },
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
   cannonDebugger.update(physicsObjects.map(o => o.body))
   
   for (const { mesh, body } of physicsObjects) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
   }

   if (keyboard.up.down) {
      boxBod.applyLocalForce(new CANNON.Vec3(0, 0, -150), new CANNON.Vec3(0, 0, 0))
   }
   if (keyboard.down.down) {
      boxBod.applyLocalForce(new CANNON.Vec3(0, 0, 150), new CANNON.Vec3(0, 0, 0))
   }
   if (keyboard.left.down) {
      boxBod.applyLocalForce(new CANNON.Vec3(-150, 0, 0), new CANNON.Vec3(0, 0, 0))
   }
   if (keyboard.right.down) {
      boxBod.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
   }
   if (keyboard.jump.down) {
      if (Math.abs(boxBod.velocity.y) < 0.01) {
         boxBod.applyLocalForce(new CANNON.Vec3(0, 1250, 0), new CANNON.Vec3(0, 0, 0))
      }
   }
   
   // clamp speed
   const maxSpeed = 5
   let currentSpeed = boxBod.velocity.clone()
   const speedDirection = currentSpeed.clone().unit()
   const speedLength = currentSpeed.distanceTo(new CANNON.Vec3())
   if (speedLength > maxSpeed) currentSpeed = speedDirection.scale(maxSpeed)
   
   // console.log(speedLength)
   boxBod.velocity.set(currentSpeed.x, boxBod.velocity.y, currentSpeed.z)
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
