// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#cdcdff')
   camera.position.set(0, 2, 2.5)
   camera.lookAt(0, 0, 0)

   // orbitable camera
   const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
   orbitControls.target.set(0, 1, 0)
   orbitControls.update()

   // a light
   const ambientLight = new THREE.AmbientLight('#FFF', 1)
   scene.add(ambientLight)

   const dirLight = new THREE.DirectionalLight('#FFF', 1)
   scene.add(dirLight)

   // a plane under
   const planeGeo = new THREE.PlaneBufferGeometry(50, 50)
   const planeMat = new THREE.MeshBasicMaterial({ color: '#cdcdff' })
   this.planeMes = new THREE.Mesh(planeGeo, planeMat)
   this.planeMes.rotation.x -= Math.PI * 0.5
   this.planeMes.position.y -= 0.001
   scene.add(this.planeMes)

   // a grid
   const gridHelper = new THREE.GridHelper(50, 50)
   scene.add(gridHelper)

   // physics
   this.world = new CANNON.World()
   this.world.gravity.set(0, -9.82, 0)


   // a box with physics
   this.boxes = []
   for (let i = 1; i < 50; i++) {
      const boxGeo = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5)
      const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
      const boxMes = new THREE.Mesh(boxGeo, boxMat)
      boxMes.position.y += 2 * i
      scene.add(boxMes)

      boxBody = new CANNON.Body({
         mass: 5,
         position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
         // cannon size is 1/2 a three? or the way three makes cubes is different
         shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25))
      })
      this.world.addBody(boxBody)

      this.boxes.push({ mesh: boxMes, body: boxBody})
   }


   // how to i size this to match my plane I wonder. maybe plane sog on forever
   this.planeBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(this.planeMes.position.x, this.planeMes.position.y, this.planeMes.position.z),
   })

   this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2)
   this.world.addBody(this.planeBody)

   // model experiment wrapped to minimize for now
   {
      // loading a model
      const gltfLoader = new THREE.GLTFLoader()
      gltfLoader.load('./assets/models/test-xbot-2.glb', (object) => {
         console.log('loaded', object)
         scene.add(object.scene)
         object.scene.position.x += 2 // just going to scoot this over

         this.mixer = new THREE.AnimationMixer(object.scene)
         THREE.AnimationUtils.makeClipAdditive(object.animations[2])
         const shakingHeadAnimation = this.mixer.clipAction(object.animations[2])
         this.animations = {
            idle: this.mixer.clipAction(object.animations[0]),
            running: this.mixer.clipAction(object.animations[1]),
            TPose: this.mixer.clipAction(object.animations[3]),
            walking: this.mixer.clipAction(object.animations[4]),
         }

         for (const animationName in this.animations) {
            const animation = this.animations[animationName]
            animation.enabled = true
            animation.weight = 0
            animation.play()

            datGui.add({ btn: () => {
               if (this.currentAnimation === animationName) return
               const time = Date.now()
               const onLoopFinished = () => {
                  console.log('finished', Date.now() - time)
                  this.mixer.removeEventListener('loop', onLoopFinished)
                  const outAnimation = this.animations[this.currentAnimation]
                  const inAnimation = this.animations[animationName]

                  // outAnimation.setEffectiveWeight(1)
                  inAnimation.time = 0

                  inAnimation.enabled = true
                  inAnimation.setEffectiveWeight(1)
                  inAnimation.crossFadeFrom(outAnimation, 0.5, true)
                  this.currentAnimation = animationName
               }
               this.mixer.addEventListener('loop', onLoopFinished)
            }}, 'btn').name(animationName)
         }

         this.animations.running.setEffectiveWeight(1)
         this.currentAnimation = 'running'



         // additive action
         shakingHeadAnimation.enabled = true
         shakingHeadAnimation.setEffectiveWeight(0)
         shakingHeadAnimation.play()
         datGui.add({ add_headshake: false }, 'add_headshake').onChange((v) => {
            if (v) {
               shakingHeadAnimation.enabled = true
               shakingHeadAnimation.setEffectiveWeight(1)
               shakingHeadAnimation.fadeIn(1)
            } else {
               // shakingHeadAnimation.enabled = false
               shakingHeadAnimation.enabled = true
               // shakingHeadAnimation.setEffectiveWeight(0)
               shakingHeadAnimation.fadeOut(1)
            }
         })
      })
   }
}

const render = function({ c3, time, clock }) {
   if (this.mixer) {
      this.mixer.update(clock.getDelta())
   }

   // update physics
   this.world.step(1/60)

   for (const { mesh, body } of this.boxes) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
   }
}


window.c3 = new C3({ init, render })
window.c3.init()
