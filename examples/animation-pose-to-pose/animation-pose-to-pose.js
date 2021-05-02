// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
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
   this.dirLight = dirLight
   // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
   // scene.add(dirLightHelper)
   // this.dirLightHelper = dirLightHelper


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
            { map: 'Armature|Arms.AttackOnce', add: true, stringed: true },
            { map: 'Armature|Arms.AttackOnceRest', add: true, stringed: true },
         ]
      }
   })
   
   scene.add(models.cube_person.object)

   // models.cube_person.clips['Armature|Still'].enabled = true
   // models.cube_person.clips['Armature|Still'].setEffectiveWeight(1)
   // models.cube_person.clips['Armature|Still'].play()
   // 
   function attack() {
      
   }
   const model = models.cube_person
   model.mixer.endFunctions = []
   console.log(models.cube_person)
   const clipAttackStart = models.cube_person.clips['Armature|Arms.AttackStart']
   const clipAttackOnce = models.cube_person.clips['Armature|Arms.AttackOnce']
   const clipAttackRest = models.cube_person.clips['Armature|Arms.AttackOnceRest']

   clipAttackOnce.loop = THREE.LoopOnce 
   clipAttackRest.loop = THREE.LoopOnce 
   clipAttackOnce.clampWhenFinished = true
   clipAttackRest.clampWhenFinished = true
   
   // models.cube_person.getMixer().addEventListener('finished', (e) => {
   //    const clipName = e.action.getClip().name
   //    if (clipName === 'Armature|Arms.AttackOnce') {
   //       clipAttackOnce.onDone && clipAttackOnce.onDone()
   //    }
   //    if (clipName === 'Armature|Arms.AttackOnceRest') {
   //       clipAttackRest.onDone && clipAttackRest.onDone()
   //    }
   // })
   
   models.cube_person.mixer.onLoop = () => {
      // pose -> animation
      if (clipAttackStart.onDone && clipAttackStart.getEffectiveWeight() === 1) {
         clipAttackStart.onDone()
         clipAttackStart.onDone = false
      } 
      
      // animation -> animation
      if (clipAttackOnce.onDone && clipAttackOnce.time === clipAttackOnce.getClip().duration) {
         clipAttackOnce.onDone()
         clipAttackOnce.onDone = false
      }
      
      // end
      if (clipAttackRest.onDone && clipAttackRest.time === clipAttackRest.getClip().duration) {
         clipAttackRest.onDone()
         clipAttackRest.onDone = false
      }
   }
   
   // models.cube_person.getMixer().addEventListener('finished', () => console.log('finished'))
   var attacking = false
   var resting = false
   function restToAttack() {
      attacking = true
      clipAttackStart.weight = 1
      clipAttackStart.fadeIn(0.25)
      
      
      clipAttackStart.onDone = () => {
         console.log('done')
         // clipAttackStart.enabled = false
         clipAttackStart.weight = 0
         clipAttackOnce.reset()
         clipAttackOnce.weight = 1
         console.log(clipAttackOnce.time)
         setTimeout(() => console.log(clipAttackOnce.time, clipAttackOnce.getClip().duration), 2000)
         clipAttackOnce.onDone = () => {
            console.log('attackOnce done')
            clipAttackOnce.weight = 0
            clipAttackRest.reset()
            clipAttackRest.weight = 1
            
            clipAttackRest.onDone = () => {
               console.log('attackRest done')
               attacking = false
               clipAttackRest.weight = 0
            }
         }
      }
   }
   // function restToAttack() {
   //    attacking = true
   //    clipAttackStart.enabled = true 
   //    clipAttackStart.started = true
   // 
   //    clipAttackStart.setEffectiveWeight(1)
   //    clipAttackStart.weight = 1
   //    clipAttackStart.fadeIn(1)
   // 
   //    clipAttackStart.onDone = () => {
   //       clipAttackStart.enabled = false
   //       console.log('clipAttackStart.onDone')
   //       clipAttackStart.setEffectiveWeight(0)
   // 
   // 
   //       clipAttackOnce.enabled = true
   //       clipAttackOnce.reset()
   //       // clipAttackOnce.fadeIn(0)
   //       clipAttackOnce.weight = 1
   //       clipAttackOnce.setEffectiveWeight(1)
   //       clipAttackOnce.onDone = () => {
   //          clipAttackOnce.setEffectiveWeight(0)
   //          clipAttackOnce.enabled = false
   // 
   //          clipAttackRest.enabled = true
   //          clipAttackRest.reset()
   //          clipAttackRest.setEffectiveWeight(1)
   //          clipAttackRest.weight = 1
   //          resting = true
   //          clipAttackRest.onDone = () => {
   //             clipAttackRest.setEffectiveWeight(0)
   //             attacking = false
   //             resting = false
   //          }
   //       }
   //    }
   // }
   
   window.addEventListener('keydown', ({ keyCode }) => {
      const call = {
         '32': () => { //spacebar
            if (resting) {
               console.log('resting ')
               
            } 
            
            if (attacking) return
            
            // console.log('attack')
            restToAttack()
         },
      }[keyCode]
      
      call && call()
   }) 
   
   // globals
   this.models = models
}

const render = function({ c3, time, clock, camera, scene }) {
   const delta = clock.getDelta()
   for (const modelName in this.models) {
      const model = this.models[modelName]
      const mixer = model.mixer
      mixer.update(delta)
      
      mixer.onLoop && mixer.onLoop()
      // if (mixer.endFunctions) {
      //    for (let func of mixer.endFunctions) {
      //       func()
      //    }
      // 
      //    mixer.endFunctions = []
      // }
   
   }
   
   // console.log(this.dirLight.position)
   const dirPosX = Math.sin(time/500) * 30
   const dirPosZ = Math.cos(time/500) * 30
   this.dirLight.position.x = dirPosX
   this.dirLight.position.z = dirPosZ
   this.dirLight.lookAt(new THREE.Vector3(0, 0, 0))
   // this.dirLightHelper.update()
}


window.c3 = new C3({ init, render })
window.c3.init()


function loadModel() {
   
}
