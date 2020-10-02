// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

const textures = {
   checker: { file: '../../assets/checker.png' },
   grass: { file: '../../assets/grass.png' },
}

const loader = new THREE.TextureLoader()
let loading = Object.keys(textures).length

for (const textureName in textures) {
   const textureInfo = textures[textureName]
   loader.load(textureInfo.file, texture => {
      texture.magFilter = THREE.NearestFilter
      textureInfo.texture = texture
      loading -= 1
      !loading && init()
   })
}

function init() {
   const geometry = new THREE.BoxGeometry()

   const matTop = new THREE.MeshBasicMaterial({ color: '#F00' })
   const matBottom = new THREE.MeshBasicMaterial({ color: '#0F0' })
   const matLeft = new THREE.MeshBasicMaterial({ color: '#00F' })
   const matRight = new THREE.MeshBasicMaterial({ map: textures.grass.texture })
   const matFront = new THREE.MeshBasicMaterial({ map: textures.checker.texture })
   const matBack = new THREE.MeshBasicMaterial({ color: '#0FF' })

   const mesh = new THREE.Mesh(geometry, [
      matRight, 
      matLeft, 
      matTop, 
      matBottom, 
      matFront, 
      matBack,
   ])
   
   scene.add(mesh)
   camera.position.z = 5
   camera.position.y = 2
   camera.position.x = 2
   camera.lookAt(0, 0, 0)
   
   
   render()
   function render() {
      requestAnimationFrame(render)
      renderer.render(scene, camera)
      // mesh.rotation.x += 0.01
      // mesh.rotation.y += 0.01
   }
}

// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()
