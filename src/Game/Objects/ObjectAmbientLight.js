class ObjectAmbientLight extends c3.Object {
   mesh() {
      const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
      return ambientLight
   }
   
   create() {
      
   }
}

c3.objectTypes.AmbientLight = ObjectAmbientLight
