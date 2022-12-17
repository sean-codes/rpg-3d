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
const groundMat = new THREE.MeshPhongMaterial({ color: '#222' })
const groundMes = new THREE.Mesh(groundGeo, groundMat)
groundMes.castShadow = true
groundMes.receiveShadow = true
scene.add(groundMes)

// box
const boxGeo = new THREE.BoxGeometry(1, 1, 3)
const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
const boxMes = new THREE.Mesh(boxGeo, boxMat)
boxMes.castShadow = true
boxMes.receiveShadow = true
boxMes.position.y = 1
boxMes.position.x = 3.5
scene.add(boxMes)

// player
const playerGeo = new THREE.BoxGeometry( 1, 1, 1 );
const playerMat = new THREE.MeshBasicMaterial( { color: 0x6495ED } );
const playerMes = new THREE.Mesh( playerGeo, playerMat );
playerMes.position.y += 0.75
scene.add(playerMes);

// other palyer
const oPlayerGeo = new THREE.BoxGeometry( 1, 1, 1 );
const oPlayerMat = new THREE.MeshBasicMaterial( { color: 0x6495ED } );
const oPlayerMes = new THREE.Mesh( oPlayerGeo, oPlayerMat );
oPlayerMes.position.y += 0.75
oPlayerMes.position.x += 2
oPlayerMes.position.z += 2.5
scene.add(oPlayerMes);


const rayHitGeo = new THREE.BoxGeometry( 1, 1, 1 )
const rayHitwire = new THREE.WireframeGeometry( rayHitGeo );
const rayHitMes = new THREE.LineSegments( rayHitwire );

// y lines
const rayHitXLine = makeRayHitLine(new THREE.Vector3(0.5, 0, 0), new THREE.Vector3(-0.5, 0, 0))
const rayHitYLine = makeRayHitLine(new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0, -0.5, 0))
const rayHitZLine = makeRayHitLine(new THREE.Vector3(0, 0, 0.5), new THREE.Vector3(0, 0, -0.5))
rayHitMes.add(rayHitXLine)
rayHitMes.add(rayHitYLine)
rayHitMes.add(rayHitZLine)
function makeRayHitLine(v1, v2) {
   const lineMat = new THREE.LineBasicMaterial( { color: 0x00FF00, linewidth: 3 } )
   const points = [v1, v2]
   const lineGeo = new THREE.BufferGeometry().setFromPoints( points )
   const lineMes = new THREE.Line(lineGeo, lineMat)
   return lineMes
}
scene.add(rayHitMes)

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
   mass: 0,
   quaternion: quaternion,
   shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1.5)),
   position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
   // collisionResponse: false,
   type: CANNON.Body.STATIC ,
   
})
physicsObjects.push({ body: boxBod, mesh: boxMes })
world.add(boxBod)

const oPlayerBod = new CANNON.Body({
   mass: 1,
   shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
   position: new CANNON.Vec3(oPlayerMes.position.x, oPlayerMes.position.y, oPlayerMes.position.z),
   // collisionFilterMask: 1
   // collisionFilterGroup: 1
})
physicsObjects.push({ body: oPlayerBod, mesh: oPlayerMes })
world.add(oPlayerBod)




// Ray and Line to show

const ray = new CANNON.Ray(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, 0, 0))
 
const lineMat = new THREE.LineBasicMaterial( { color: 0x0000ff } )
const points = [
   new THREE.Vector3(0, 0, 0),
   new THREE.Vector3(5, 0, 0),
]
const lineGeo = new THREE.BufferGeometry().setFromPoints( points )
const lineMes = new THREE.Line(lineGeo, lineMat)
lineMes.position.copy(playerMes.position)
scene.add(lineMes)

const canvas = renderer.domElement
canvas.addEventListener('keydown', moveBox)

function moveBox(e) {
   // const 
   var move = { a: [-1, 0], d: [1,  0], w: [0, -1], s: [0,  1] }[e.key]
   if (move) {
      playerMes.position.x += move[0]*0.1
      playerMes.position.z += move[1]*0.1
   }
   
   var spin = { q: 1, e: -1}[e.key]
   if (spin) {
      playerMes.rotateY(spin*0.1)
      // boxBod.
      // boxMes.rotateY(spin*0.1)
      // boxBod.quaternion.setFromEuler(
      //    boxMes.rotation.x, 
      //    boxMes.rotation.y, 
      //    boxMes.rotation.z, 
      //    'XYZ')
   }

   // testRay()
}

function testRay() {
   // update display
   lineMes.position.copy(playerMes.position)
   
   
   const rayFrom = new CANNON.Vec3(playerMes.position.x, playerMes.position.y, playerMes.position.z)
   let rayTo = rayFrom.clone().vadd(new CANNON.Vec3(5, 0, 0))
   ray.from.copy(rayFrom)
   ray.to.copy(rayTo)
   
   // reset
   rayHitMes.position.copy(rayTo)

   // initial player to a wall check
   var intersection = new CANNON.RaycastResult()//new CANNON.Vec3(0, 0, 0)
   ray.intersectBody(boxBod, intersection)

   // v1. move camera to the hit point
   if (intersection.hasHit) {
      rayHitMes.position.copy(intersection.hitPointWorld)      
   }

   // v2. bump camera outside of the hii point a little
   // moving this outside the hashit. Cause the ray might not be far enough
   var directions = {
      // x: [new CANNON.Vec3(-0.5, 0, 0), new CANNON.Vec3(0.5, 0, 0)],
      // y: [new CANNON.Vec3(0, -0.5, 0), new CANNON.Vec3(0, 0.5, 0)],
      z: [new CANNON.Vec3(0, 0, -0.5), new CANNON.Vec3(0, 0, 0.5)],
   }
   
   const rayHitPosition = new CANNON.Vec3(0, 0, 0).copy(rayHitMes.position) // onvert THREE Vec to CANNON Vec

   for (var axis in directions) {
      var [dx, dy] = directions[axis]
      
      // set ray to one of the directions
      ray.from.copy(rayHitPosition.clone().vadd(dx))
      ray.to.copy(rayHitPosition.clone().vadd(dy))
      
      // test again?
      intersection.reset()
      ray.intersectBody(boxBod, intersection)
      if (intersection.hasHit) {
         console.log('i dont believe you >:(', intersection.distance)
         // distance is depending on side
         const moveDir = intersection.distance < 0.5 ? 1 : -1
         // distance from 5?  0 = 5, 1 = 4, 4 = 1, 6 = 1
         // 1 + (5)
         const fromZeroPFire =  (Math.round(Math.abs((1 - intersection.distance - 0.5)) * 1000)/1000) / 0.5
         rayHitMes.position[axis] += moveDir * 1 * (fromZeroPFire/2)
         // if (intersection.distance < 0.5) console.log('left')
         // if (intersection.distance > 0.5) console.log('right')
      }
   }
}


// render
var cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world)
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   testRay() // move ray hit spot
   world.step(1/60) // update physics

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
