// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first

const init = async function({ c3, camera, scene, renderer }) {
   camera.position.set(0, 300, 400)
   camera.far = 2000
   camera.updateProjectionMatrix()
   scene.fog = new THREE.Fog('#cbdbfc', 1, 2000);
   scene.background = new THREE.Color('#cbdbfc');

   // Orbit Camera
   const controls = new THREE.OrbitControls(c3.camera, c3.renderer.domElement)
   controls.target.set(0, 100, 0)
   controls.update()

   // a light
   const ambientLight = new THREE.AmbientLight('#FFF', 0.25)
   scene.add(ambientLight)

   // a light bulb
   const dirLight = new THREE.DirectionalLight('#FFF')
   dirLight.position.set(100, 300, 400)
   dirLight.castShadow = true
   dirLight.shadow.camera.left -= 500
   dirLight.shadow.camera.right += 500
   dirLight.shadow.camera.top += 500
   dirLight.shadow.camera.bottom -= 500
   dirLight.shadow.camera.far = 2000
   scene.add(dirLight)

   const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
   scene.add(dirLightHelper)

   const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
   scene.add(dirLightCameraHelper)

   // make a ground
   const geoGround = new THREE.PlaneBufferGeometry(4000, 4000)
   const matGround = new THREE.MeshPhongMaterial({ color: '#cbdbfc' })
   const mesGround = new THREE.Mesh(geoGround, matGround);
   mesGround.receiveShadow = true
   mesGround.rotation.x -= Math.PI * 0.5
   scene.add(mesGround)

   // grid
   const grid = new THREE.GridHelper(4000, 100, '#000', '#000')
   grid.material.opacity = 0.2
   grid.material.transparent = true
   grid.position.y += 1
   scene.add(grid)

   // load a fbx model
   const fbxLoader = new THREE.FBXLoader()
   fbxLoader.load('./assets/models/xbot.fbx', (object) => {
      scene.add(object)

      object.traverse((child) => {
         if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
         }
      })
   })
}

const render = function({ c3, time }) {

}


const c3 = new C3({ init, render })
c3.init()

window.c3 = c3
