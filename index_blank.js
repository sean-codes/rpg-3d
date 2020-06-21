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
      character: { file: './assets/models/knight/KnightCharacter_edited.fbx', scale: 0.01 },
   })
   
   console.log(models)
   

   // models.character.bones.Head.add(models.helmet.object)
   scene.add(models.character.object) // Adding this to the physics box
   // 
   models.character.clips['HumanArmature|Idle_swordRight'].enabled = true
   models.character.clips['HumanArmature|Idle_swordRight'].setEffectiveWeight(1)
   models.character.clips['HumanArmature|Idle_swordRight'].play()

   
   // globals
   this.models = models
}

const render = function({ c3, time, clock, camera, scene }) {
   const delta = clock.getDelta()
   for (const modelName in this.models) {
      const model = this.models[modelName]
      model.mixer.update(delta)
   }


   // if (c3.checkKey(87).held) {
}


window.c3 = new C3({ init, render })
window.c3.init()
