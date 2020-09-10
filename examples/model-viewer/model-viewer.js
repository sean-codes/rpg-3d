// Could not find a model viewer that supported opening multiple models
// Ok this code is an absolute mess.


// init
const scene = new THREE.Scene()
scene.background = new THREE.Color('rgb(34, 34, 34)')
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
const controls = new THREE.OrbitControls(camera, renderer.domElement)
const fbxLoader = new THREE.FBXLoader()
const gltfLoader = new THREE.GLTFLoader()
const GUI = new dat.GUI({ closed: true });

function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()

// lighting
const pointLight = new THREE.PointLight('#FFF', 10, 10000)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
scene.add(ambientLight)

// config
GUI.add(ambientLight, 'intensity', 0, 5, 0.1).name('Ambient Light')
GUI.add(pointLight, 'intensity', 0, 5, 0.1).name('Point Light 1')

// globals
let offset = 0
let currentObject = undefined
const holder = new THREE.Object3D()
scene.add(holder)

// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   
   const dirToCamera = camera.position.clone().normalize()
   pointLight.position.copy(dirToCamera.multiplyScalar(offset*2))
}
render()


// file dropper
let files = []
let selected = 0
fileInput.addEventListener('input', (e) => {
   selected = 0
   files = e.target.files
   
   fileList.innerHTML = ''
   for (var i = 0; i < files.length; i++) {
      const file = files[i]
      fileList.innerHTML += `<button class="file" onClick="loadFile(${i})">${file.name}</button>`
   }
   
   loadFile(selected)
})

fileList.addEventListener('keydown', (e) => {
   e.stopPropagation()
   e.preventDefault()
   if(e.keyCode == 38) {
      selected = Math.max(0, selected - 1)
   }
   if(e.keyCode == 40) {
      selected = Math.min(files.length-1, selected + 1)
   }
   
   const eleFiles = document.querySelectorAll('.file')
   const eleSelectFile = eleFiles[selected]
   eleSelectFile.click()
   eleSelectFile.focus()
})


function loadFile(i) {
   const eleFiles = document.querySelectorAll('.file')
   
   for (var o = 0; o < eleFiles.length; o++) {
      const eleFile = eleFiles[o]
      eleFile.classList.remove('selected')
      if (i == o) eleFile.classList.add('selected')
   }
   
   const fileReader = new FileReader()
   fileReader.onload = () => {
      const isGltf = files[i].name.includes('.gltf') || files[i].name.includes('.glb')
      const isFbx = files[i].name.includes('.fbx')
      
      if (isGltf) {
         gltfLoader.parse(fileReader.result, undefined, (loaded) => {
            onLoadObject(loaded.scene.children[0])
         })
      } 
      
      if (isFbx) {
         const object = fbxLoader.parse(fileReader.result)
         onLoadObject(object)
      }
   }
   fileReader.readAsArrayBuffer(files[i])
}

function onLoadObject(object) {
   object.traverse((part) => {
      // flat shading
      if (part.material) {
         const makeMaterialFlat = (material) => {
            material.flatShading = true
            material.reflectivity = 0
            material.shininess = 0
         }

         if (part.material.length) part.material.forEach(makeMaterialFlat)
         else makeMaterialFlat(part.material)
      }
   })
   
   addObject(object)
   fixCamera()
}

function addObject(object) {
   if (currentObject) {
      holder.remove(currentObject)
   }
   currentObject = object
   
   const box = new THREE.Box3().setFromObject(object)
   const center = box.max.clone().add(box.min).multiplyScalar(0.5)
   const size = box.getSize()
   offset = Math.max(size.x, size.y, size.z)
   
   holder.add(object)
   holder.position.set(-center.x, -center.y, -center.z)   
   pointLight.distance = offset*5
}

function fixCamera() {
   camera.position.z = -offset*0.75
   camera.position.y = offset*0.5
   camera.position.x = -offset*0.75
   camera.lookAt(0, 0, 0)
}
