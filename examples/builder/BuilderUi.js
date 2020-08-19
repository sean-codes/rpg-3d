// This will load the models and setup the ui

function BuilderUi() {
   // setup a canvas
   const canvas = document.createElement('canvas')
   canvas.width = 400
   canvas.height = 400
   
   // setup threejs
   const scene = new THREE.Scene()
   const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
   
   const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
   camera.position.z = 1.5
   camera.position.x = 1.5
   camera.position.y = 1.5
   camera.lookAt(0, 0, 0)

   const light = new THREE.PointLight('#FFF', 3, 45)
   light.position.z = 1.5
   light.position.x = 1
   light.position.y = 2
   scene.add(light)

   var colors = [
      '#C1A5A9',
      '#F08CAE',
      '#9A4C95',
      '#4D2D52',
      '#1d1a31',
      '#322F44',
      '#454255',
   ]

   for (var color of colors) {
      // create the object
      const geo = new THREE.BoxGeometry()
      const mat = new THREE.MeshPhongMaterial({ color: color })
      const mes = new THREE.Mesh(geo, mat)
      scene.add(mes)
      
      // render it then convert to image
      renderer.render(scene, camera)
      const imageData = canvas.toDataURL("image/png")
      
      // create a image template
      const htmlObject = templateObjectBuilderObject.content.firstElementChild.cloneNode(true)
      htmlObject.querySelector('img').src = imageData
      htmlObject.addEventListener('click', handleObjectClick)
      objectBuilder.appendChild(htmlObject)
      
      // clear scene
      scene.remove(mes)
   }
   
   function handleObjectClick() {
      console.log('clicked an object')
   }
}
