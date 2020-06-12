class C3_Vector {
   // cheater :]
   create(x=0, y=0, z) {
      if (z !== null) {
         return new THREE.Vector3(x, y, z)
      }

      return new THREE.Vector2(x, y)
   }
}

c3.vector = new C3_Vector 
