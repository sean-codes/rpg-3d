// Animating to a pose
/*

i think i made a notes file
*/



const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#3a293f')
   // scene.fog = new THREE.Fog('#FFF', 20, 50);
   camera.position.set(5, 12, 8)
   camera.near = 1
   camera.far = 5000
   camera.updateProjectionMatrix()
   const cameraTarget = new THREE.Object3D()
   var controls = new THREE.OrbitControls( camera, renderer.domElement );
   controls.target = new THREE.Vector3(0, 4, 0)
   controls.update()
   
   
   const ambientLight = new THREE.AmbientLight('#FFF', 1)
   scene.add(ambientLight)

   const dirLight = new THREE.DirectionalLight('#FFF', 1)
   dirLight.castShadow = true
   dirLight.position.set(12, 40, 10)
   dirLight.shadow.mapSize.width = 3072
   dirLight.shadow.mapSize.height = 3072
   dirLight.shadow.camera.right = 80;
   dirLight.shadow.camera.left = -80;
   dirLight.shadow.camera.top = 80;
   dirLight.shadow.camera.bottom = -80;
   dirLight.shadow.camera.far = 100;
   dirLight.target = new THREE.Object3D()
   scene.add(dirLight.target)
   scene.add(dirLight)


   // a grid
   const gridHelper = new THREE.GridHelper(50, 50)
   scene.add(gridHelper)

   const models = await c3.loadModels({
      cube_person: { 
         log: true, 
         file: '../../assets/blender_practice/CubePerson2.fbx', 
         scale: 0.01,
         clipMap: [
            { map: 'Armature|Arms.AttackStart', add: true, pose: true },
            { map: 'Armature|Arms.AttackTwiceStart', add: true, pose: true },
            { map: 'Armature|Arms.AttackOnce', add: true, stringed: true },
            { map: 'Armature|Arms.AttackTwice', add: true, stringed: true },
            { map: 'Armature|Arms.AttackOnceRest', add: true, stringed: true },
            { map: 'Armature|Arms.AttackTwiceRest', add: true, stringed: true },
         ]
      }
   })
   this.models = models
   scene.add(models.cube_person.object)

   const model = models.cube_person
   model.mixer.endFunctions = []
   console.log(models.cube_person)
   const clipAttackStart = models.cube_person.clips['Armature|Arms.AttackStart']
   const clipAttackOnce = models.cube_person.clips['Armature|Arms.AttackOnce']
   const clipAttackTwice = models.cube_person.clips['Armature|Arms.AttackTwice']
   const clipAttackTwiceStart = models.cube_person.clips['Armature|Arms.AttackTwiceStart']
   const clipAttackRest = models.cube_person.clips['Armature|Arms.AttackOnceRest']
   const clipAttackTwiceRest = models.cube_person.clips['Armature|Arms.AttackTwiceRest']

   clipAttackOnce.loop = THREE.LoopOnce 
   clipAttackRest.loop = THREE.LoopOnce 
   clipAttackTwice.loop = THREE.LoopOnce 
   clipAttackTwiceRest.loop = THREE.LoopOnce 
   clipAttackOnce.clampWhenFinished = true
   clipAttackRest.clampWhenFinished = true
   clipAttackTwice.clampWhenFinished = true
   clipAttackTwiceRest.clampWhenFinished = true
   
   models.cube_person.mixer.onLoop = () => {
      // pose -> animation
      if (clipAttackStart.onDone && clipAttackStart.getEffectiveWeight() === 1) {
         clipAttackStart.onDone()
         clipAttackStart.onDone = false
      } 
      
      if (clipAttackTwiceStart.onDone && clipAttackTwiceStart.getEffectiveWeight() === 1) {
         clipAttackTwiceStart.onDone()
         clipAttackTwiceStart.onDone = false
      } 
      
      // animation -> animation
      if (clipAttackOnce.onDone && clipAttackOnce.time === clipAttackOnce.getClip().duration) {
         clipAttackOnce.onDone()
         clipAttackOnce.onDone = false
      }
      
      // animation -> animation
      if (clipAttackTwice.onDone && clipAttackTwice.time === clipAttackTwice.getClip().duration) {
         clipAttackTwice.onDone()
         clipAttackTwice.onDone = false
      }
      
      // end
      if (clipAttackRest.onDone && clipAttackRest.time === clipAttackRest.getClip().duration) {
         clipAttackRest.onDone()
         clipAttackRest.onDone = false
      }
      
      // end
      if (clipAttackTwiceRest.onDone && clipAttackTwiceRest.time === clipAttackTwiceRest.getClip().duration) {
         clipAttackTwiceRest.onDone()
         clipAttackTwiceRest.onDone = false
      }
   }
   
   var attackQued = false
   var attacking = false
   var resting = false
   function restToAttack() {
      if (!attackQued || attacking) return
      attacking = true
      attackQued = false
      const shouldUseTwice = resting && (clipAttackRest.getEffectiveWeight() > 0 || clipAttackOnce.getEffectiveWeight())
      const useAttackStart = shouldUseTwice ? clipAttackTwiceStart : clipAttackStart
      const useAttack = shouldUseTwice ? clipAttackTwice : clipAttackOnce
      const useRest = shouldUseTwice ? clipAttackTwiceRest : clipAttackRest
      
      let restTime = 1
      if (resting) {          
         restTime = Math.max(
            clipAttackRest.time  / clipAttackRest.getClip().duration,
            clipAttackTwiceRest.time  / clipAttackTwiceRest.getClip().duration
         )

         clipAttackRest.halt()
         clipAttackRest.fadeOut(0.25 * restTime)
         clipAttackTwiceRest.halt()
         clipAttackTwiceRest.fadeOut(0.25 * restTime)
         resting = false
      }
      
      useAttackStart.reset().play()
      useAttackStart.weight = 1
      useAttackStart.fadeIn(0.25 * restTime)
      
      useAttackStart.onDone = () => {
         useAttackStart.weight = 0 // can use .weight = 0 or stop()
         useAttack.reset().play()
         useAttack.weight = 1
         // useAttackStart.stop() // has to be after the next clip is played or will skip
         
         useAttack.onDone = () => {
            attacking = false
            resting = true
             
            useAttack.weight = 0
            useRest.reset().play()
            // useAttack.stop()
            useRest.weight = 1
            
            useRest.onDone = () => {
               useRest.weight = 0
               useRest.stop()
               resting = false
            }
         }
      }
   }
   
   
   window.addEventListener('keydown', ({ keyCode }) => {
      const call = {
      '32': () => { //spacebar
         attackQued = true
      },
      }[keyCode]
      
      call && call()
   }) 
   
   this.onRender = (time) => {
      restToAttack()
   }
}

const render = function({ c3, time, clock, camera, scene }) {
   const delta = clock.getDelta()
   for (const modelName in this.models) {
      const model = this.models[modelName]
      const mixer = model.mixer
      mixer.update(delta)
      
      mixer.onLoop && mixer.onLoop()
   }
   
   this.onRender(time)
}


window.c3 = new C3({ init, render })
window.c3.init()


function loadModel() {
   
}
