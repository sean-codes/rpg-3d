c3.objectTypes.AmbientLight = class GameObjectAmbientLight extends c3.GameObject {
   mesh() {
      const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
      return ambientLight
   }
   
   create() {
      
   }
}
