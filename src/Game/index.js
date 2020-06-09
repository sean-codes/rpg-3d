const c3 = new C3({
   keyMap: {
      forward: 87,
      left: 65,
      attack: 16,
      equip_helmet: 49
   },
   
   objects: [
      { src: './src/Game/Objects/GameObjectPlayer.js' },
      { src: './src/Game/Objects/GameObjectAmbientLight.js' },
      { src: './src/Game/Objects/GameObjectDirectionalLight.js' },
      { src: './src/Game/Objects/GameObjectCamera.js' },
      { src: './src/Game/Objects/GameObjectGround.js' },
   ],
   
   scripts: [
      { src: './src/Game/Scripts/ScriptCameraController.js' }, 
   ],
   
   models: [
      { name: 'helmet', file: './assets/models/knight/Helmet1.fbx', scale: 0.01, offset: [0.08, 0.05, 0.65] },
      { name: 'sword', file: './assets/models/knight/Sword.fbx', scale: 0.01, rotation: [0, -Math.PI*0.5, 0], offset: [0.1, 0.05, -0.15] },
      { name: 'shield', file: './assets/models/knight/Shield_Round.fbx', scale: 0.01, rotation: [-0.1, Math.PI*0.5, 0], offset: [0.2, -0.3, 0] },
      { name: 'shoulderPads', file: './assets/models/knight/ShoulderPads.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
      { name: 'dragon', file: './assets/models/monsters/FBX/Dragon_Edited.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
      { name: 'tree', file: './assets/models/environment/PineTree_Autumn_4.fbx', scale: 0.035, },
      { name: 'rock', file: './assets/models/environment/Rock_6.fbx', scale: 0.035, },
      { name: 'bush', file: './assets/models/environment/BushBerries_2.fbx', scale: 0.035, },
      { name: 'fence', file: './assets/models/environment/Fence.fbx', scale: 0.035, },
      { 
         name: 'character', 
         file: './assets/models/knight/KnightCharacter_edited.fbx', 
         scale: 0.01,
         clips: [
            { name: 'run', map: 'HumanArmature|Run_swordRight' },
            { name: 'idle', map: 'HumanArmature|Idle_swordRight' },
            { name: 'attack', map: 'HumanArmature|Run_swordAttack', type: 'ADD' },
         ]
      },
   ],
   
   init: function() {
      const { camera, scene } = this
      
      scene.background = new THREE.Color('#FFF')
      // lights
      c3.gameObjects.create({ type: 'AmbientLight' })
      c3.gameObjects.create({ type: 'DirectionalLight' })
      // player
      const player = c3.gameObjects.create({ type: 'Player', attr: { pos: c3.vector.create([0, 0, 0]) } })
      // camera
      c3.gameObjects.create({ type: 'Camera', attr: { player } })
   
      c3.gameObjects.create({ type: 'Ground' })
      // c3.camera.setup({
      //    far: 100,
      //    near: 0.1,
      // })
      // c3.camera.attachToObject(player)
   },
   
   step: function(c3) {
      this.scripts.cameraController.step()
   }
})