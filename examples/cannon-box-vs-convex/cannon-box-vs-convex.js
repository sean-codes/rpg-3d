// Trying to figure out if using convexPolyhedron instead of a box will heavily hurt performance




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
camera.position.z = 10
camera.position.y = 2
// camera.position.x = -2
camera.lookAt(0, 0, 0)

let mode = modeBox
let count = 100
let noMass = false
let extraBoxes = 0
let initTimeout = false

const datGui = new dat.GUI()
datGui.add({ ConvexMode: () => { mode = modeConvex; init() }}, 'ConvexMode')
datGui.add({ BoxMode: () => { mode = modeBox; init() }}, 'BoxMode')
datGui.add({ count: count }, 'count', 0, 1000, 1).onChange((value) => {
   count = value
   clearTimeout(initTimeout)
   initTimeout = setTimeout(() => init(), 1000)
})
datGui.add({ NoMass: noMass }, 'NoMass').onChange((value) => {
   noMass = value
   clearTimeout(initTimeout)
   initTimeout = setTimeout(() => init(), 1000)
})
datGui.add({ ExtraBoxes: extraBoxes }, 'ExtraBoxes', 0, 1000, 1).onChange((value) => {
   extraBoxes = value
   clearTimeout(initTimeout)
   initTimeout = setTimeout(() => init(), 1000)
})


// physics
const world = new CANNON.World()
world.gravity.set(0, -40, 0)
const physicsObjects = []


init()
function init() {
   clearWorld()
   mode()
   addExtraBoxes()
}

function clearWorld() {
   const bodies = world.bodies
   let body = bodies[0]
   while (body) {
      world.removeBody(body)
      body = bodies[0]
   }
   
   addGround() 
}

function addGround() {
   const groundBod = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(100, 0.25, 100)),
      position: new CANNON.Vec3(0, 0, 0),
   })
   world.add(groundBod)
}

function addExtraBoxes() {
   for (let i = 0; i < extraBoxes; i++) {
      const quaternion = new CANNON.Quaternion()
      quaternion.setFromEuler(Math.PI*(Math.random()*2), 0, Math.PI*1.95, 'XYZ')
      const boxBod = new CANNON.Body({
         mass: 1,
         quaternion: quaternion,
         shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
         position: new CANNON.Vec3(Math.random()*50-25, Math.random()*50, Math.random()*50-25),
      })
      world.add(boxBod)
   }
}

function modeBox() {
   clearWorld()
   
   for (let i = 0; i < count; i++) {
      const quaternion = new CANNON.Quaternion()
      quaternion.setFromEuler(Math.PI*(Math.random()*2), 0, Math.PI*1.95, 'XYZ')
      const boxBod = new CANNON.Body({
         mass: noMass ? 0 : 1,
         quaternion: quaternion,
         shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
         position: new CANNON.Vec3(Math.random()*50-25, Math.random()*50, Math.random()*50-25),
      })
      world.add(boxBod)
   }
}


// load a model
// try
// ../../assets/models/monkey
// ../../assets/models/cone
// ../../assets/models/cube
function modeConvex() {  
   clearWorld()
   
   loader.load('../../assets/models/cube.fbx', (object) => { try {
      let mesh = undefined
      object.traverse(part => {
         if (part.type === 'Mesh') {
            mesh = part
            
            part.scale.x = 0.5
            part.scale.y = 0.5
            part.scale.z = 0.5
         }
      })
      
      for (let i = 0; i < count; i++) {
         const quaternion = new CANNON.Quaternion()
         quaternion.setFromEuler(Math.PI*(Math.random()*2), 0, Math.PI*1.95, 'XYZ')
         const boxBod = new CANNON.Body({
            mass: noMass ? 0 : 1,
            quaternion: quaternion,
            position: new CANNON.Vec3(Math.random()*50-25, Math.random()*50, Math.random()*50-25),
            shape: createConvexPolyhedronFromModel(object)
         })
         
         world.add(boxBod)
      }
   } catch(e) { console.error(e) }})
}




function createConvexPolyhedronFromModel(object) {
   let mesh = getMesh(object)
   mesh.updateMatrixWorld()
   const geometry = new THREE.Geometry()
   geometry.fromBufferGeometry(mesh.geometry)
   geometry.scale(mesh.scale.x, mesh.scale.y, mesh.scale.x)

   // We have to move the points around so they aren't perfectly aligned?
   var eps = 1e-2; // between 2-4 seems to work
   for (var i = 0; i < geometry.vertices.length; i++) {
      geometry.vertices[i].x += (Math.random() - 0.5) * eps;
      geometry.vertices[i].y += (Math.random() - 0.5) * eps;
      geometry.vertices[i].z += (Math.random() - 0.5) * eps;
   }

   // create convex geometry
   var convexGeo = new THREE.ConvexGeometry(geometry.vertices);

   // get vertices and faces for cannon
   const vertices = convexGeo.vertices.map(v => new CANNON.Vec3(v.x, v.y, v.z));
   const faces = convexGeo.faces.map(f => [f.a, f.b, f.c]);

   return new CANNON.ConvexPolyhedron(vertices, faces);
}

function getMesh(object) {
   let mesh = undefined
   object.traverse(part => mesh = part.type === 'Mesh' ? part : mesh)
   return mesh
}


var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );

// render
let frames = 0
let fps = 0
let timer = Date.now()

function render() {
   
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   world.step(1/60)
   cannonDebugRenderer.update()
   
   frames += 1
   if (Date.now() - timer > 1000) {
      fps = frames
      frames = 0
      timer = Date.now()
      eleFps.innerText = fps
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
