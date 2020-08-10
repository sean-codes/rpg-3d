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
      sword: { file: '../../assets/models/knight/Sword.fbx', scale: 0.01, rotation: [0, -Math.PI*0.5, 0], offset: [0.1, 0.05, -0.15] },
      shield: { file: '../../assets/models/knight/Shield_Round.fbx', scale: 0.01, rotation: [-0.1, Math.PI*0.5, 0], offset: [0.2, -0.3, 0] },
      knight: { file: '../../assets/models/knight/KnightCharacter_edited.fbx', scale: 0.01 },
      cube_person: { 
         log: true, 
         file: '../../assets/blender_practice/cube_person.fbx', 
         scale: 0.01,
         clipMap: [
            { map: 'Armature|Idle', add: true },
            { map: 'Armature|Legs.Walk', add: true },
            { map: 'Armature|Arms.Walk', add: true },
            { map: 'Armature|Arms.Attack', add: true, playOnce: true },
            { map: 'Armature|Arms.Block', add: true, pose: true },
            { map: 'Armature|Arms.Jump', add: true, pose: true },
            { map: 'Armature|Legs.Jump', add: true, pose: true },
            { map: 'Armature|Arms.Bow', add: true, pose: true },
            { map: 'Armature|Arms.EquipWeapon', add: true, playOnce: true },
            { map: 'Armature|Arms.EquipWeaponEnd', add: true, pose: false, playOnce: false, stringed: true },
         ]
      }
   })
   
   scene.add(models.cube_person.object)

   // models.cube_person.clips['Armature|Still'].enabled = true
   // models.cube_person.clips['Armature|Still'].setEffectiveWeight(1)
   // models.cube_person.clips['Armature|Still'].play()
   // 
   
   for (const animationName of [
      'Armature|Legs.Walk', 
      // 'Armature|Legs.Backstep', 
      'Armature|Arms.Walk', 
      'Armature|Arms.Block', 
      'Armature|Arms.Attack', 
      'Armature|Arms.Jump', 
      'Armature|Legs.Jump', 
      'Armature|Idle',
      'Armature|Arms.Bow',
      'Armature|Arms.EquipWeapon',
      'Armature|Arms.EquipWeaponEnd',
   ]) {      

      let type = false
      const clip = models.cube_person.clips[animationName]
      if (clip.playOnce) {
         type = () => {}
      }
      
      datGui.add({ toggle: type }, 'toggle').name(`${animationName.split('|').splice(1, 1).join()}`).onChange((value, uhh) => {
         models.cube_person.clips[animationName].enabled = true
         
         if (value || value === undefined) {
            models.cube_person.clips[animationName].enabled = true
            models.cube_person.clips[animationName].setEffectiveWeight(1)
            models.cube_person.clips[animationName].fadeIn(0.15)
            
            if (animationName == 'Armature|Block' || animationName == 'Armature|Arms.Attack') {
               models.cube_person.clips[animationName].time = 0
               const isRunArmsPlaying = models.cube_person.clips[`Armature|Arms.Walk`].getEffectiveWeight() > 0
               isRunArmsPlaying && models.cube_person.clips[`Armature|Arms.Walk`].setEffectiveWeight(0.1)
               
            }
            
            if (clip.playOnce) {
               clip.time = 0
               const clearAnimation = () => {
                  clip.fadeOut(0)
                  clip.setEffectiveWeight(0)
                  models.cube_person.getMixer().removeEventListener('loop', clearAnimation)
               }
               
               models.cube_person.getMixer().addEventListener('loop', (e) => {
                  if (e.action.getClip().name === animationName) {
                     clearAnimation()
                  }
               })
            }
            
            if (animationName == 'Armature|Arms.Walk') {
               models.cube_person.clips[`Armature|Arms.Walk`].time = models.cube_person.clips[`Armature|Legs.Walk`].time
               const isBlockPlaying = models.cube_person.clips[`Armature|Arms.Block`].getEffectiveWeight() > 0
               const isAttackPlaying = models.cube_person.clips[`Armature|Arms.Attack`].getEffectiveWeight() > 0

               if (isBlockPlaying || isAttackPlaying) models.cube_person.clips['Armature|Arms.Walk'].setEffectiveWeight(0.1)
            }
         } else {
            models.cube_person.clips[animationName].fadeOut(0.15)
            
            if (animationName == 'Armature|Block' || animationName == 'Armature|Arms.Attack') {
               const isRunArmsPlaying = models.cube_person.clips[`Armature|Arms.Walk`].weight > 0
               isRunArmsPlaying && models.cube_person.clips[`Armature|Arms.Walk`].setEffectiveWeight(1)
               isRunArmsPlaying && models.cube_person.clips[`Armature|Arms.Walk`].fadeIn(0.1)
            }
         }
      })
   }
   
   // globals
   this.models = models
}

const render = function({ c3, time, clock, camera, scene }) {
   const delta = clock.getDelta()
   for (const modelName in this.models) {
      const model = this.models[modelName]
      for (const mixerName in model.mixers) {
         const mixer = model.mixers[mixerName]
         mixer.update(delta)
      }
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
