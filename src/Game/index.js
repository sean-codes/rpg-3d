const c3 = new C3({
   node_modules: '../../node_modules',
   path: '../C3',
   keyMap: {
      forward: 87,
      left: 65,
      right: 68,
      backward: 83,
      attack: 69,
      equip_helmet: 49,
      jump: 32, 
      block: 81, // q
      target: 84, // t
      sheath: 88, // x
      sprint: 16, // shift
   },

   scripts: [
      // Objects
      { src: './Objects/ObjectAmbientLight.js' },
      { src: './Objects/ObjectDirectionalLight.js' },
      { src: './Objects/ObjectBox.js' },
      { src: './Objects/ObjectCamera.js' },
      { src: './Objects/ObjectDragon.js' },
      { src: './Objects/ObjectPlayer.js' },
      { src: './Objects/ObjectPlatform.js' },
      { src: './Objects/ObjectGround.js' },
      { src: './Objects/ObjectResource.js' },
      { src: './Objects/ObjectTarget.js' },
      { src: './Objects/ObjectWeapon.js' },
      { src: './Objects/ObjectArrow.js' },
      // Scripts
      { src: './Scripts/ScriptCameraController.js' }, 
   ],
   
   models: [
      { name: 'helmet', file: '../../assets/models/knight/Helmet1.fbx', scale: 0.01, offset: [0.08, 0.05, 0.65] },
      { name: 'sword', file: '../../assets/models/knight/Sword.fbx', scale: 0.0125, rotation: [0, Math.PI*0.5, 0], offset: [0, -0.4, 0.15] },
      { name: 'shield', file: '../../assets/models/knight/Shield_Round.fbx', scale: 0.013, rotation: [0, -Math.PI*0.5, 0], offset: [0, 0, 0] },
      { name: 'shoulderPads', file: '../../assets/models/knight/ShoulderPads.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
      { name: 'tree', file: '../../assets/models/environment/PineTree_Autumn_4.fbx', scale: 0.035, },
      { name: 'rock', file: '../../assets/models/environment/Rock_6.fbx', scale: 0.035, },
      { name: 'bush', file: '../../assets/models/environment/BushBerries_2.fbx', scale: 0.035, },
      { name: 'fence', file: '../../assets/models/environment/Fence.fbx', scale: 0.035, },
      { name: 'dragon', file: '../../assets/models/monsters/FBX/Dragon_Edited.fbx', scale: 0.01, offset: [0, 0.2, 0.15] },
      { log: true, name: 'arrow', file: '../../assets/blender_practice/Arrow.fbx', scale: 0.015, rotation: [-Math.PI*0.5, 0, 0], offset: [0, 0, 0] },
      { 
         name: 'bow', 
         file: '../../assets/blender_practice/bow_wooden.fbx', 
         scale: 0.01, 
         rotation: [0, -Math.PI*0.5, 0], 
         offset: [0, 0, 0],
         clips: [
            { name: 'Hold', map: 'Armature|Hold', add: true, pose: true }
         ]  
      },
      {
         name: 'character', 
         scale: 0.01,
         file: '../../assets/blender_practice/cube_person.fbx',
         clips: [
            { name: 'Idle', map: 'Armature|Idle', add: true },
            { name: 'Legs.Walk', map: 'Armature|Legs.Walk', add: true },
            { name: 'Legs.Walk_Strafe', map: 'Armature|Legs.Walk_Strafe', add: true },
            { name: 'Arms.Walk', map: 'Armature|Arms.Walk', add: true },
            { name: 'Arms.Attack', map: 'Armature|Arms.Attack', add: true },
            { name: 'Arms.Block', map: 'Armature|Arms.Block', add: true, pose: true },
            { name: 'Arms.Bow', map: 'Armature|Arms.Bow', add: true, pose: true },
            { name: 'Arms.EquipWeapon', map: 'Armature|Arms.EquipWeapon', add: true },
            { name: 'Arms.EquipWeaponEnd', map: 'Armature|Arms.EquipWeaponEnd', add: true, stringed: true },
            { name: 'Arms.EquipShield', map: 'Armature|Arms.EquipShield', add: true },
            { name: 'Arms.EquipShieldEnd', map: 'Armature|Arms.EquipShieldEnd', add: true, stringed: true },
            { name: 'Legs.Jump', map: 'Armature|Legs.Jump', add: true, pose: true },
            { name: 'Arms.Jump', map: 'Armature|Arms.Jump', add: true, pose: true },
         ]
      },
   ],
   
   init: function() {
      const { camera, scene } = this
      scene.setBackground('#FFF')
      
      camera.setNearFar(1, 75)
      c3.scene.setFog(45, 75)
      
      c3.models.materialAdd('BOX', new THREE.MeshLambertMaterial({ color: '#F55' }))
      c3.models.materialAdd('TARGET', new THREE.MeshLambertMaterial({ color: '#99f' }))
      c3.models.materialAdd('WIREFRAME', new THREE.MeshBasicMaterial({
         color: '#000',
         wireframe: true,
         opacity: 0.1,
         transparent: true,
         visible: false,
      }))
      
      // Setup materials
      c3.physics.addMaterial('BOX', { friction: 0.1, restitution: 0  })
      c3.physics.addMaterial('PLAYER', { friction: 0, restitution: 0 })
      c3.physics.addMaterial('GROUND', { friction: 0.1, restitution: 0 })

      // lights
      c3.objects.create('AmbientLight')
      c3.objects.create('DirectionalLight')
   
      const player = c3.objects.create('Player', { pos: c3.vector.create(0, 2, 0) })
      c3.objects.create('Ground')

      for (let i = 0; i < 40; i++) {
         c3.objects.create('Box')
      }
      
      for (let i = 0; i < 100; i++) {
         c3.objects.create('Resource')
      }
      
      for (let x = 0; x < 2; x++) {
         for (let y = 0; y < 2; y++) {
            c3.objects.create('Dragon', { pos: c3.vector.create(15+x*6, 2, -15+y*6) })
         }
      }
      
      c3.objects.create('Platform', { pos: c3.vector.create(-15, 3, -15) })
      c3.objects.create('Platform', { pos: c3.vector.create(-20, 6, -15) })
      c3.objects.create('Target', { pos: c3.vector.create(-8, 4, 8) })
   },
   
   step: function(c3) {
      this.scripts.cameraController.step()
   }
})
