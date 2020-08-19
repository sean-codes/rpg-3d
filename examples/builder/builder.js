// const scene = new THREE.Scene()
// camera.position.z = 1.5
// camera.position.x = 1.5
// camera.position.y = 1.5


BuilderUi()

const scene = new THREE.Scene()
scene.background = new THREE.Color('#555')
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.z += 5
camera.position.y += 5
camera.position.x += 5
camera.lookAt(0, 0, 0)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

const light = new THREE.PointLight('#FFF', 3, 15)
light.position.z = 1.5
light.position.x = 1
light.position.y = 2
scene.add(light)
// const lightHelper = new THREE.PointLightHelper(light, 1)
// scene.add(lightHelper)

const geo = new THREE.BoxGeometry()
const mat = new THREE.MeshPhongMaterial({ color: '#FFF' })
// mat.flatShading = true
// mat.reflectivity = 0
// mat.shininess = 0
const mes = new THREE.Mesh(geo, mat)
scene.add(mes)

// grid helper
// const gridHelper = new THREE.InfiniteGridHelper(1, 10)
// gridHelper.material.uniforms.uDistance.value = 50
// gridHelper.name = 'awd'
// scene.add( gridHelper );

// main plane
const planeGeo = new THREE.PlaneGeometry(10, 10)
const planeMat = new THREE.MeshPhongMaterial({ color: '#000' })
const planeMes = new THREE.Mesh(planeGeo, planeMat)
planeMes.rotation.x = Math.PI*-0.5
planeMes.position.y -= 0.01
scene.add(planeMes)

// ray caster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-1, -1)
function onMouseMove({ clientX, clientY }) {
   mouse.x = (clientX / window.innerWidth) * 2 - 1
   mouse.y = -(clientY / window.innerHeight) * 2 + 1
   // console.log(Math.round(mouse.x * 1000) / 1000, Math.round(mouse.y * 1000) / 1000)
}
window.addEventListener('mousemove', onMouseMove, false)

function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   light.position.copy(camera.position)
   
   raycaster.setFromCamera(mouse, camera)
   const intersects = raycaster.intersectObjects(scene.children)
   
   for (let intersect of intersects) {
      if (intersect.object.uuid === planeMes.uuid) {
         // console.log('intersecting plane', intersect)
         mes.position.copy(intersect.point)
         
      }
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
