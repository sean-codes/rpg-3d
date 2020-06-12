class C3_GameObject {
   constructor({ attr, type }) {
      this.attr = attr
      this.type = type
      
      this.rotation = c3.vector.create(0, 0, 0)
      this.mesh = this.mesh ? this.mesh() : new THREE.Object3D()
      this.physics = this.physics ? this.physics() : { meshes: [] }
      this.body = this.physics.meshes.length ? c3.physics.addObject(this) : undefined
      
      this.create(this.attr)
      
      c3.scene.add(this.mesh)
   }
   
   setPosition({ x, y, z }) {
      if (this.body && !this.physics.linkToMesh) {
         this.body.position.x = x
         this.body.position.y = y
         this.body.position.z = z
      } else {
         this.mesh.position.x = x
         this.mesh.position.y = y
         this.mesh.position.z = z
      }
   }
   
   getPosition() {
      return this.mesh.position
   }
   
   getDirection() {
      return this.mesh.getWorldDirection(new THREE.Vector3())
   }
   
   rotate(x, y, z) {
      this.mesh.rotation.x += x
      this.mesh.rotation.y += y
      this.mesh.rotation.z += z
      this.rotateUpdate()
   }
   
   rotateX(radians) {
      this.rotation.x += radians
      this.rotateUpdate()
   }
   
   rotateY(radians) {
      this.rotation.y += radians
      this.rotateUpdate()
   }
   
   rotateZ(radians) {
      this.rotation.z += radians
      this.rotateUpdate()
   }
   
   setRotationY(radians) {
      this.rotation.y = radians
      this.rotateUpdate()
   }
   
   rotateUpdate() {
      if (this.body) {
         this.body.quaternion.setFromEuler(this.rotation.x, this.rotation.y, this.rotation.z, 'XYZ')
      } else {
         this.mesh.rotation.x = this.rotation.x
         this.mesh.rotation.y = this.rotation.y
         this.mesh.rotation.z = this.rotation.z
         console.log('updating rotation', this.mesh.rotation)
      }
   }
   
   create() {}
   step() {}
   
   handleResize(width, height) {}
}

c3.GameObject = C3_GameObject
