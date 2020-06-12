class C3_Physics {
   constructor() {
      this.list = {}
      this.materials = {}
      
      this.world = new CANNON.World()
      this.world.gravity.set(0, -40, 0)
   }
   
   addMaterial(name, options) {
      this.materials[name] = new CANNON.Material(options)
   }
   
   addObject(object) {
      const { 
         meshes, 
         material, 
         mass=1, 
         fixedRotation=false, 
         linkToMesh=false,
         collisionResponse=true,
         watchCollisions=false
      } = object.physics
      
      const mesh = meshes[0]
      const geoType = mesh.geometry.type
      let body = undefined
      
      const quaternion = new CANNON.Quaternion()
      quaternion.setFromEuler(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z, 'XYZ')

      if (geoType.startsWith('Box')) {
         const { width, height, depth } = object.mesh.geometry.parameters
         const { x, y, z } = object.mesh.position
         
         body = new CANNON.Body({
            fixedRotation,
            mass,
            quaternion,
            material: this.materials[material],
            position: new CANNON.Vec3(x, y, z),
            shape: new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2)),
         })
      }
      
      if (geoType.startsWith('Plane')) {
         const { x, y, z } = object.mesh.position
         
         body = new CANNON.Body({
            fixedRotation,
            mass,
            quaternion,
            material: this.materials[material],
            position: new CANNON.Vec3(x, y, z),
            shape: new CANNON.Plane(),
         })

         body.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI/2)
      }
      
      if (geoType.startsWith('Sphere')) {
         const { radius } = object.mesh.geometry.parameters
         const { x, y, z } = object.mesh.position
         
         body = new CANNON.Body({
            fixedRotation,
            mass,
            quaternion,
            position: new CANNON.Vec3(x, y, z),
            shape: new CANNON.Sphere(radius),
            material: this.materials[material],
         })
      }
      
      // Additional Bodies
      for (let i = 1; i < object.physics.meshes.length; i++) {
         const mesh = object.physics.meshes[i]
         const geoType = mesh.geometry.type
         
         if (geoType.startsWith('Box')) {
            const { width, height, depth } = mesh.geometry.parameters
            const { x, y, z } = mesh.position
            const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2))
            body.addShape(shape, new CANNON.Vec3(x, y, z))
         }
         
         if (geoType.startsWith('Sphere')) {
            const { radius } = mesh.geometry.parameters
            const { x, y, z } = mesh.position
            const shape = new CANNON.Sphere(radius)
            body.addShape(shape, new CANNON.Vec3(x, y, z))
         }
      }
      
      // cannot be applied in body constructor :,(
      body.collisionResponse = collisionResponse
      const physicObject = {
         object,
         body, 
         mesh, 
         linkToMesh,
         tempCollisions: [],
         collisions: []
      }
      
      if (watchCollisions) {
         body.addEventListener('collide', (event) => {
            const biIsSelf = event.contact.bi.id === physicObject.body.id
            const contactNormal = new CANNON.Vec3()
            let obj1 = biIsSelf ? event.contact.bi : event.contact.bj
            let obj2 = biIsSelf ? event.contact.bj : event.contact.bi
            
            const other = this.list[obj2.id].object
            const normal = biIsSelf 
               ? event.contact.ni.negate(contactNormal) 
               : contactNormal.copy(contactNormal)
               
            const isOnGround = normal.y > 0.8
            physicObject.tempCollisions.push({ other, normal, isOnGround })
         })
      }
      
      this.world.addBody(body)
      this.list[body.id] = physicObject
      
      return physicObject
   }
   
   removeObject(physicsObject) {
      this.world.removeBody(physicsObject.body)
      delete this.list[physicsObject.body.id]
   }
   
   loopApplyCollisions() {
      for (const physicObjectId in this.list) {
         this.list[physicObjectId].collisions = this.list[physicObjectId].tempCollisions
         this.list[physicObjectId].tempCollisions = []
      }
   }
   
   loop() {
      this.world.step(1/60)

      for (const physicObjectId in this.list) {
         const { mesh, body, linkToMesh } = this.list[physicObjectId]
         if(linkToMesh) {
            const meshWorldPosition = mesh.getWorldPosition(new THREE.Vector3())
            body.position.copy(meshWorldPosition)
            body.quaternion.copy(body.quaternion)
         } else {
            mesh.position.copy(body.position)
            mesh.quaternion.copy(body.quaternion)
         }
         
      }
   }
}

c3.physics = new C3_Physics
