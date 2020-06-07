// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#111')
   // scene.fog = new THREE.Fog('#FFF', 20, 50)
   camera.position.set(0, 0, 15)
   camera.near = 1
   camera.far = 5000
   camera.updateProjectionMatrix()
   camera.lookAt(0, 0, 0)


   cameraLookX = new THREE.Object3D()
   cameraLookX.rotation.x += Math.PI/10
   cameraLookY = new THREE.Object3D()
   cameraLookY.add(cameraLookX)
   cameraLookX.add(camera)
   scene.add(cameraLookY)

   window.addEventListener('mousewheel', (e) => {
      if (e.shiftKey) {
         camera.position.z += e.deltaY/100
      } else {
         // add min/maxes to this
         cameraLookX.rotation.x -= e.deltaY/200
         cameraLookY.rotation.y += e.deltaX/200
      }
   })
   
   this.mousePos = new THREE.Vector2()
   window.addEventListener('mousemove', (e) => {
      const canvas = renderer.domElement
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      this.mousePos.set(x, y)
   })

   // a light
   const ambientLight = new THREE.AmbientLight('#FFF', 1)
   scene.add(ambientLight)
   
   
   
   const spinner = new THREE.Object3D()
   scene.add(spinner)
   
   const planeGeo = new THREE.PlaneGeometry(10, 10)
   const planeMat = new THREE.MeshPhongMaterial({ color: '#465' })
   const planeMes = new THREE.Mesh(planeGeo, planeMat)
   planeMes.rotation.y += Math.PI*2
   scene.add(planeMes)
   this.plane = planeMes
   
   const gridHelper = new THREE.GridHelper(10, 10)
   gridHelper.rotation.x += Math.PI/2
   gridHelper.position.z += 0.01
   
   scene.add(gridHelper)
   
   const rayCaster = new THREE.Raycaster()
   this.rayCaster = rayCaster
   
   
   const boxGeo = new THREE.BoxGeometry()
   const boxMat = new THREE.MeshBasicMaterial({ wireframe: true, color: '#FFF', opacity: 0.2, transparent: true })
   const boxMes = new THREE.Mesh(boxGeo, boxMat)
   boxMes.position.z += 0.5
   scene.add(boxMes)
   
   this.box = boxMes
}



const render = function({ c3, time, clock, camera, scene }) {
   const { rayCaster, mousePos } = this
   
   rayCaster.setFromCamera(mousePos, camera)
   const intersections = rayCaster.intersectObject(this.plane)
   
   if (intersections.length) {
      const intersection = intersections[0]
      this.box.position.copy(intersection.point)
      this.box.position.z += 0.5
      
      const box = new THREE.Box3().setFromObject(this.plane)
      const planeWidth = box.max.x - box.min.y
      
      const xStart = (this.plane.position.x - planeWidth/2)
      const yStart = (this.plane.position.y - planeWidth/2)
      const relativeX =  intersection.point.x - xStart //+ 
      const relativeY = intersection.point.y - yStart
      
      const xLock = Math.floor(relativeX)
      const yLock = Math.floor(relativeY)
      
      this.box.position.x = xStart + xLock + 0.5
      this.box.position.y = yStart + yLock + 0.5
   }
}


window.c3 = new C3({ init, render })
window.c3.init()
