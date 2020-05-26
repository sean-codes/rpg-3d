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
   const ambientLight = new THREE.AmbientLight('#FFF', 0.75)
   scene.add(ambientLight)

   const dirLight = new THREE.DirectionalLight('#FFF', 1)
   scene.add(dirLight)

   // loading a model
   const gltfLoader = new THREE.GLTFLoader()
   gltfLoader.load('./assets/models/test-xbot-2.glb', (object) => {
      console.log('loaded', object)
      scene.add(object.scene)

      this.mixer = new THREE.AnimationMixer(object.scene)
      THREE.AnimationUtils.makeClipAdditive(object.animations[1])
      const shakingHeadAnimation = this.mixer.clipAction(object.animations[1])
      this.animations = {
         idle: this.mixer.clipAction(object.animations[0]),
         // shakingHead: this.mixer.clipAction(object.animations[1]),
         walking: this.mixer.clipAction(object.animations[3]),
      }

      for (const animationName in this.animations) {
         const animation = this.animations[animationName]
         animation.enabled = true
         animation.weight = 0
         animation.play()

         datGui.add({ btn: () => {
            if (this.currentAnimation === animationName) return

            const outAnimation = this.animations[this.currentAnimation]
            const inAnimation = this.animations[animationName]

            inAnimation.enabled = true
            inAnimation.setEffectiveWeight(1)
            inAnimation.crossFadeFrom(outAnimation, 1, true)
            this.currentAnimation = animationName
         }}, 'btn').name(animationName)
      }

      this.animations.walking.setEffectiveWeight(1)
      this.currentAnimation = 'walking'



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

const render = function({ c3, time, clock }) {
   if (this.mixer) {
      this.mixer.update(clock.getDelta())
   }
}


window.c3 = new C3({ init, render })
window.c3.init()
