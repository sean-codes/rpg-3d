class C3_Vector {
   create(components) {
      if (components.length === 3) {
         return new THREE.Vector3(...components)
      }
      
      if (components.length === 2) {
         return new THREE.Vector2(...components)
      }
   }
}

c3.vector = new C3_Vector 
