c3.gameObjects.types.DirectionalLight = class GameObjectDirectionalLight extends c3.GameObject {
   mesh() {
      const dirLight = new THREE.DirectionalLight('#FFF', 1)
      dirLight.castShadow = true
      dirLight.position.set(10, 10, 0)
      dirLight.shadow.mapSize.width = 3072
      dirLight.shadow.mapSize.height = 3072
      dirLight.shadow.camera.right = 80;
      dirLight.shadow.camera.left = -80;
      dirLight.shadow.camera.top = 80;
      dirLight.shadow.camera.bottom = -80;
      dirLight.shadow.camera.far = 100;
      return dirLight
   }
   
   create() {
      
   }
}
