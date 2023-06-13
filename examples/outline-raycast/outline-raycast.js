import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from '../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '../../node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from '../../node_modules/three/examples/jsm/postprocessing/ShaderPass.js'
import { OutlinePass } from '../../node_modules/three/examples/jsm/postprocessing/OutlinePass.js'

// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)

// cubes
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial({ color: '#465' })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.x -= 1
scene.add(mesh)

const geometry2 = new THREE.BoxGeometry()
const material2 = new THREE.MeshPhongMaterial({ color: '#465' })
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.position.x += 1
scene.add(mesh2)



// lights
const aLight = new THREE.AmbientLight('#FFF', 0.75)
scene.add(aLight)

const pLight = new THREE.PointLight('$FFF', 1, 5)
pLight.position.y += 2
pLight.position.z += 2
scene.add(pLight)


// raycast outline
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera)
composer.addPass(outlinePass)
outlinePass.selectedObjects = [] // see end of updateSelectedObjects

// mouse hover
const mousePos = new THREE.Vector2(0, 0)
const mouseCaster = new THREE.Raycaster()
function updateSelectedObjects(mx, my) {
   // -1 to 1 ratio
   mousePos.x = (mx / window.innerWidth) * 2 - 1
   mousePos.y = -(my / window.innerHeight) * 2 + 1
   mouseCaster.setFromCamera(mousePos, camera)
   
   const intersections = mouseCaster.intersectObjects(scene.children)
   outlinePass.selectedObjects = intersections.map(i => i.object)
}
window.addEventListener('mousemove', (e) => updateSelectedObjects(e.clientX, e.clientY))


// render
function render() {
   requestAnimationFrame(render)
   // post processing takes over the normal renderer.render
   // renderer.render(scene, camera)
   composer.render()

   mesh.rotation.x += 0.01
   mesh.rotation.y += 0.01

   mesh2.rotation.x -= 0.01
   mesh2.rotation.y -= 0.01
}
render()


// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
   composer.setSize(window.innerWidth, window.innerHeight)
}
window.onresize = resize
resize()
