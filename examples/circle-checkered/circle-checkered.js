// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer( { antialias: true } )
// renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

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

const scale = 10
const slicesLon = 40
const slicesLat = slicesLon/4
const offsetLon = Math.PI*2 / slicesLon
const offsetLat = Math.PI / slicesLat

const rects = []
const container = new THREE.Object3D()
scene.add(container)

for (let lon = 0; lon < slicesLon; lon++) {
   const lonMesh = new THREE.Object3D()
   const lonMeshInner = new THREE.Object3D()
   lonMesh.rotateY(lon*offsetLon)
   lonMeshInner.rotateZ(lon % 2 ? -offsetLat/2 : 0)
   lonMesh.add(lonMeshInner)
   container.add(lonMesh)
   
   for (let lat = 0; lat < slicesLat; lat++) {
      if (lon % 2 && lat === slicesLat-1) continue
      const iDontKnowWhatThisIsCalled = lat*offsetLat + (offsetLat/2)
      const x = Math.cos(iDontKnowWhatThisIsCalled)
      const y = Math.sin(iDontKnowWhatThisIsCalled)
      
      var cubeMaterialArray = [
         new THREE.MeshBasicMaterial( { color: 0x8833ff }),
         new THREE.MeshBasicMaterial( { color: 0x8833ff }),
         new THREE.MeshBasicMaterial( { color: 0x8833ff }),
         new THREE.MeshBasicMaterial( { color: 0x8833ff }),
         new THREE.MeshBasicMaterial( { color: '#000' }),
         new THREE.MeshBasicMaterial( { color: '#000' }),
      ];

      const geometry = new THREE.BoxGeometry(1, 1, 0.1)
      const mesh = new THREE.Mesh(geometry, cubeMaterialArray)
      
      mesh.position.x = y * (slicesLat*0.3)
      mesh.position.y = x * (slicesLat*0.3)
      
      lonMeshInner.add(mesh)
      rects.push(mesh)
      
      // move outside
      mesh.updateMatrix()
      mesh.updateWorldMatrix(true, true)
      mesh.updateMatrixWorld(true)
      const pos = mesh.getWorldPosition(new THREE.Vector3)
      container.add(mesh)
      mesh.position.copy(pos)
      mesh.lookAt(new THREE.Vector3)
   }
}


//-----------------------------------------
// mirror
//-----------------------------------------
const mirrorGeo = new THREE.BoxGeometry(20, 20, 1)
const mirrorMat = new THREE.MeshBasicMaterial({ color: '#FFF' })
// const mirrorMes = new THREE.Mesh(mirrorGeo, mirrorMat)
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
const mirrorMes = new THREE.Reflector(mirrorGeo, {
   clipBias: 0.003,
   textureWidth: WIDTH,
   textureHeight: HEIGHT,
   color: 0x777777
})
mirrorMes.position.z -= 10
scene.add(mirrorMes)


//-----------------------------------------
// bloom
//-----------------------------------------
var params = {
	exposure: 1,
	bloomStrength: 0.75,
	bloomThreshold: 0,
	bloomRadius: 0
};

var renderScene = new THREE.RenderPass( scene, camera );
var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

composer = new THREE.EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );


camera.position.z = 10//scale * 3
camera.position.x = 5
camera.position.y = 5
camera.lookAt(0, 0, 0)
// render
var dir = 1
let count = 0
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   count += 1
   if (count > 500) { dir = 0 }

   for (const rect of rects) {
      const dirToCenter = rect.position.clone().normalize()
      rect.position.add(dirToCenter.multiplyScalar(0.01).multiplyScalar(dir))
   }
   
   composer.render();
}
render()



// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   composer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()




// scrap
// for (let lon = 0; lon < slicesLon; lon++) {
//    const lonMesh = new THREE.Object3D()
//    const lonMeshInner = new THREE.Object3D()
//    lonMesh.rotateY(lon*offsetLon)
//    lonMeshInner.rotateZ(lon % 2 ? -offsetLat/2 : 0)
//    lonMesh.add(lonMeshInner)
//    scene.add(lonMesh)
// 
//    for (let lat = 0; lat < slicesLat; lat++) {
//       const iDontKnowWhatThisIsCalled = lat*offsetLat + (offsetLat/4)
//       const x = Math.cos(iDontKnowWhatThisIsCalled)
//       const y = Math.sin(iDontKnowWhatThisIsCalled)
// 
//       const geometry = new THREE.BoxGeometry(1, 1, 0.05*scale)
//       const material = new THREE.MeshPhongMaterial({ color: '#FFF' })
//       const mesh = new THREE.Mesh(geometry, material)
//       lonMeshInner.add(mesh)
//       mesh.position.x = y * scale
//       mesh.position.y = x * scale
//       mesh.lookAt(new THREE.Vector3())
// 
//       const ratioY = Math.abs(y)
//       const circleRadiusAtY = ratioY * (scale/2)
//       const circleParimeterAtY = Math.PI*2*circleRadiusAtY
//       const rectWidth = circleParimeterAtY/slicesLat
//       mesh.scale.x = rectWidth
// 
//       const ratioX = Math.abs(x)
//       const circleRadiusAtX = ratioX * (scale)
//       const circleParimeterAtX = Math.PI*2*circleRadiusAtX
//       const rectHeight = circleParimeterAtX/slicesLat
//       mesh.scale.y = scale/slicesLat*1.65
//    }
// }
