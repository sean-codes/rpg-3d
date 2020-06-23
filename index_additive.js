// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#3a293f')
   // scene.fog = new THREE.Fog('#FFF', 20, 50);
   camera.position.set(5, 12, 8)
   camera.near = 1
   camera.far = 5000
   camera.updateProjectionMatrix()
   camera.lookAt(0, 5, 0)
   
   var controls = new THREE.OrbitControls( camera, renderer.domElement );
   
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
   scene.add(dirLight)

   // a grid
   const gridHelper = new THREE.GridHelper(50, 50)
   scene.add(gridHelper)

   const models = await c3.loadModels({
      sword: { file: './assets/models/knight/Sword.fbx', scale: 0.01, rotation: [0, -Math.PI*0.5, 0], offset: [0.1, 0.05, -0.15] },
      shield: { file: './assets/models/knight/Shield_Round.fbx', scale: 0.01, rotation: [-0.1, Math.PI*0.5, 0], offset: [0.2, -0.3, 0] },
      knight: { file: './assets/models/knight/KnightCharacter_edited.fbx', scale: 0.01 },
      box_chracter: { 
         file: './assets/blender_practice/additive_animations.fbx', 
         scale: 0.0075, 
         clipMap: [
            { map: 'Armature|Stand', add: false },
            { map: 'Armature|Run', add: true },
            { map: 'Armature|Attack', add: true },
            { map: 'Armature|Block', add: true, pose: true },
            { map: 'Armature|Idle', add: true },
            { map: 'Armature|Run.Arms', add: true },
         ],
         log: true
      },
      multi_object: { 
         // log: true, 
         file: './assets/blender_practice/multiple_object_armature.fbx', 
         scale: 0.01,
         clipMap: [
            { map: 'Top|TopAction', object: 'Top' },
            { map: 'Bottom|BottomAction', object: 'Bottom' },
         ]
      }
   })
   
   console.log(models)

   scene.add(models.box_chracter.object) // Adding this to the physics box

   models.box_chracter.clips['Armature|Idle'].enabled = true
   models.box_chracter.clips['Armature|Idle'].setEffectiveWeight(1)
   models.box_chracter.clips['Armature|Idle'].play()
   
   
   for (const animationName of ['Armature|Run', 'Armature|Run.Arms', 'Armature|Block', 'Armature|Attack', 'Armature|Idle']) {      
      datGui.add({ toggle: false }, 'toggle').name(`Toggle ${animationName.split('|').splice(1, 1).join()}`).onChange((value, uhh) => {
         if (value) {
            models.box_chracter.clips[animationName].enabled = true
            models.box_chracter.clips[animationName].setEffectiveWeight(1)
            models.box_chracter.clips[animationName].fadeIn(0.5)
            // models.box_chracter.clips[animationName].play()
            
            if (animationName == 'Armature|Block' || animationName == 'Armature|Attack') {
               const isRunArmsPlaying = models.box_chracter.clips[`Armature|Run.Arms`].weight > 0
               isRunArmsPlaying && models.box_chracter.clips[`Armature|Run.Arms`].setEffectiveWeight(0.1)
            }
            
            if (animationName == 'Armature|Run.Arms') {
               const isBlockPlaying = models.box_chracter.clips[`Armature|Block`].weight > 0
               const isAttackPlaying = models.box_chracter.clips[`Armature|Attack`].weight > 0
               models.box_chracter.clips[animationName].setEffectiveWeight(0.1)
            }
         } else {
            models.box_chracter.clips[animationName].fadeOut(0.5)
            
            if (animationName == 'Armature|Block' || animationName == 'Armature|Attack') {
               const isRunArmsPlaying = models.box_chracter.clips[`Armature|Run.Arms`].weight > 0
               isRunArmsPlaying && models.box_chracter.clips[`Armature|Run.Arms`].setEffectiveWeight(1)
               isRunArmsPlaying && models.box_chracter.clips[`Armature|Run.Arms`].fadeIn(0.1)
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


   // if (c3.checkKey(87).held) {
}


window.c3 = new C3({ init, render })
window.c3.init()
