// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   camera.position.set(0, 900, 800)
   camera.far = 4000
   camera.updateProjectionMatrix()
   scene.fog = new THREE.Fog('#cbdbfc', 1, 3000);
   scene.background = new THREE.Color('#cbdbfc');

   // Orbit Camera
   const controls = new THREE.OrbitControls(c3.camera, c3.renderer.domElement)
   controls.target.set(0, 300, 0)
   controls.update()

   // a light
   const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
   scene.add(ambientLight)

   // a light bulb
   const dirLight = new THREE.DirectionalLight('#FFF', 0.75)
   dirLight.position.set(100, 300, 400)
   dirLight.castShadow = true
   dirLight.shadow.camera.left -= 1500
   dirLight.shadow.camera.right += 1500
   dirLight.shadow.camera.top += 1500
   dirLight.shadow.camera.bottom -= 1500
   dirLight.shadow.camera.far = 2000
   scene.add(dirLight)

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
   fbxLoader.load('./assets/models/knight/KnightCharacter.fbx', (object) => {
      scene.add(object)

      // Enable animations
      this.mixer = new THREE.AnimationMixer(object)
      this.actions = {
         idle: this.mixer.clipAction(object.animations[4]),
         walk: this.mixer.clipAction(object.animations[8]),
      }

      for (const actionName in this.actions) {
         const action = this.actions[actionName]
         action.enabled = true
         // action.setEffectiveTimeScale(1)
         action.setEffectiveWeight(0)
         action.play()

         datGui.add({ btn: () => {
            // change animation
            if (actionName === this.currentActionName) return

            const outAction = this.actions[this.currentActionName]
            const inAction = this.actions[actionName]

            inAction.enabled = true
            inAction.setEffectiveWeight(1)
            outAction.crossFadeTo(inAction, 1, true)
            this.currentActionName = actionName
         }}, 'btn').name(`play: ${actionName}`)
      }

      this.currentActionName = 'idle'
      this.actions.idle.setEffectiveWeight(1)

      // Flat shading
      object.traverse((child) => {
         if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
         }

         if (child.material) {
            for (const material of child.material) {
               material.flatShading = true
               material.reflectivity = 0
               material.shininess = 0
            }
         }
      })
   }, ()=>{}, console.log)
}

const render = function({ c3, time, clock }) {
   if (this.mixer) {
      this.mixer.update(clock.getDelta())
   }
}


const c3 = new C3({ init, render })
c3.init()

window.c3 = c3
