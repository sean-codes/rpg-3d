// This will load the models and setup the ui

function BuilderUi({ onSelect, models }) {
   // setup a canvas
   const canvas = document.createElement('canvas')
   canvas.width = 400
   canvas.height = 400
   
   // setup threejs
   const scene = new THREE.Scene()
   const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
   
   const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
   
   camera.lookAt(0, 0, 0)
   
   const ambientLight = new THREE.AmbientLight('#FFF', 1)
   scene.add(ambientLight)
   
   const light = new THREE.PointLight('#FFF', 3, 45)
   scene.add(light)
   
   // load models
   const fbxLoader = new THREE.FBXLoader()
   const holder = new THREE.Object3D()
   scene.add(holder)
   const htmlObjects = []
   const objects = {}
   
   for (const model of models) {
      const { src, name, scale } = model
      
      fbxLoader.load(src, object => {
         objects[name] = object
         
         // Flat shading
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
            
            if (part.type === 'Mesh' || part.type === 'SkinnedMesh') {
               part.receiveShadow = true
               part.castShadow = true
            }
         })
         
         object.scale.x = scale
         object.scale.y = scale
         object.scale.z = scale
         
         const box = new THREE.Box3().setFromObject(object)
         const center = box.max.clone().add(box.min).multiplyScalar(0.5)
         const size = box.getSize()
         const offset = Math.max(size.x, size.y, size.z)
         
         holder.add(object)
         holder.position.set(-center.x, -center.y, -center.z)   
         
         light.distance = offset*5
         light.position.z = 1.5*offset
         light.position.x = 1*offset
         light.position.y = 2*offset
         
         camera.position.z = 1*offset
         camera.position.x = 1*offset
         camera.position.y = 1*offset
         camera.lookAt(0, 0, 0)
         
         renderer.render(scene, camera)
         const imageData = canvas.toDataURL("image/png")
         
         // create a image template
         const htmlObject = templateObjectBuilderObject.content.firstElementChild.cloneNode(true)
         htmlObject.querySelector('img').src = imageData
         htmlObject.querySelector('.title').innerHTML = name
         // htmlObject.querySelector('.text').innerHTML = desc
         htmlObject.addEventListener('click', handleObjectClick)
         htmlObject.dataset.name = name
         htmlObjects.push(htmlObject)
         objectBuilder.appendChild(htmlObject)
         
         // clear scene
         holder.remove(object)
      })
   }

   function handleObjectClick(e) {
      // reset them all
      for (let htmlObject of htmlObjects) {
         htmlObject.classList.remove('selected')
      }
      
      // set selected
      const htmlClicked = this
      htmlClicked.classList.add('selected')
      
      // call back with the selected object
      const object = objects[htmlClicked.dataset.name]
      onSelect(object)
   }
}
