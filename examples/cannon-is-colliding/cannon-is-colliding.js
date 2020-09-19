// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)
const pointCache = new PointCache(scene)
// camera
camera.position.z = 5
camera.position.y = 5
camera.position.x = -1
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
groundMes.visible = false
// groundMes.castShadow = true
// groundMes.receiveShadow = true
scene.add(groundMes)

const boxGeo = new THREE.BoxGeometry()
const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
const boxMatColliding = new THREE.MeshPhongMaterial({ color: '#F22' })
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
world.add(groundBod)

let boxDir = -1
const quaternion = new CANNON.Quaternion()
quaternion.setFromEuler(boxMes.rotation.x, boxMes.rotation.y, boxMes.rotation.z, 'XYZ')
// To make a body able to go through objects and still get collisions
// It needs mass 0, and type 1 (DYNAMIC)
// If you do not pass in type: 1 it will default to STATIC (static bodies do not collide)
const boxBod = new CANNON.Body({
   mass: 0,
   type: 1,
   quaternion: quaternion,
   shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
   position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
})

const circleShape = new CANNON.Sphere(0.5)
boxBod.addShape(circleShape, new CANNON.Vec3(0, -1, 0))
// boxBod.type = 1

boxBod.addEventListener('collide', (e) => {
   // boxDir *= -1
   // console.log('collided', boxDir, boxBod.contacts)
})

physicsObjects.push({ body: boxBod, mesh: boxMes })
world.add(boxBod)



// render
var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
function render() {
   requestAnimationFrame(render)
   
   
   world.step(1/60)

   for (const { mesh, body } of physicsObjects) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
      body.contacts = []
      body.isColliding = false
   }
   
   boxBod.position.y += 0.025 * boxDir
   
   if (boxBod.position.y < 0.1 || boxBod.position.y > 2.5) {
      boxDir *= -1
   }
   
   // console.log(world.contacts)
   // const t = performance.now()
   for (const contact of world.contacts) {
      contact.bi.isColliding = true
      contact.bj.isColliding = true

      contact.bi.contacts.push({
         position: new CANNON.Vec3(
            contact.bi.position.x + contact.ri.x,
            contact.bi.position.y + contact.ri.y,
            contact.bi.position.z + contact.ri.z,
         ),
         shape: contact.si,
      })
      
      contact.bj.contacts.push({
         position: new CANNON.Vec3(
            contact.bj.position.x + contact.rj.x,
            contact.bj.position.y + contact.rj.y,
            contact.bj.position.z + contact.rj.z,
         ),
         shape: contact.sj,
      })
   }
   // console.log('t', performance.now() - t)
   boxMes.material = boxBod.isColliding ? boxMatColliding : boxMat
   for (const contact of boxBod.contacts) {
      if (contact.shape.id === circleShape.id) {
         // console.log('It is the circle shape')
      }
      pointCache.add(contact.position, '#F1F')
   }
   
   for (const contact of groundBod.contacts) {
      pointCache.add(contact.position, '#F9F')
   }
   
   
   renderer.render(scene, camera)
   cannonDebugRenderer.update()
   pointCache.reset()
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


function PointCache(scene) {
   this.meshes = []
   
   this.pointer = 0
   
   const pointGeo = new THREE.SphereGeometry(0.1)
   
   this.add = function(position, color) {
      if (!this.meshes[this.pointer]) {
         this.meshes[this.pointer] = new THREE.Mesh(pointGeo, this.getMaterial(color))
      }
      this.meshes[this.pointer].position.copy(position)
      this.meshes[this.pointer].material = this.getMaterial(color)
      scene.add(this.meshes[this.pointer])
      this.pointer += 1
   }
   
   this.reset = function() {
      this.pointer = 0
      for (mesh of this.meshes) {
         scene.remove(mesh)
      }
   }
   
   this.materials = {}
   this.getMaterial = function(color) {
      if (!this.materials[color]) 
         this.materials[color] = new THREE.MeshBasicMaterial({ color })
      return this.materials[color] 
   }
}
