// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first

const init = async function(c3) {
   c3.camera.position.set(0, 15, 10)

   // Orbit Camera
   const controls = new THREE.OrbitControls(c3.camera, c3.renderer.domElement)
   controls.target.set(0, 0, 0)
   controls.update()

   const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
   c3.scene.add(ambientLight);

   const directionalLight = new THREE.DirectionalLight('#FFF');
   directionalLight.position.y += 1
   directionalLight.target.position.set(0, 0, 0)
   c3.scene.add(directionalLight);
   c3.scene.add(directionalLight.target);

   const directionLightHelper = new THREE.DirectionalLightHelper(directionalLight);
   c3.scene.add(directionLightHelper);

   // a gtlf file
   const gtlfLoader = new THREE.GLTFLoader();
   gtlfLoader.load('./assets/models/city/scene.gltf', (gltf) => {
      const root = gltf.scene
      root.scale.x = 0.01
      root.scale.y = 0.01
      root.scale.z = 0.01

      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize()
      const boxCenter = box.getCenter()

      console.log(root, boxSize, boxCenter)
      controls.target.set(boxCenter.x, boxCenter.y, boxCenter.z)
      controls.update()
      // root.scale(0.5);
      c3.scene.add(root)
   })
}

const render = function(c3) {
}


const c3 = new C3({ init, render })
c3.init()

window.c3 = c3
