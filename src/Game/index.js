const c3 = new C3({
   keyMap: {
      forward: 87,
      left: 65,
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
