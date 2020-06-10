class C3_Physics {
   constructor() {
      this.list = []
      this.materials = {}
      
      this.world = new CANNON.World()
      this.world.gravity.set(0, -40, 0)
   }
   
   addMaterial(name, options) {
      this.materials[name] = new CANNON.Material(options)
   }
   
   addObject(object) {
      const { meshes, material, mass=1, fixedRotation=false } = object.physics
      const mesh = meshes[0]
      const geoType = mesh.geometry.type
      let body = undefined
      
      if (geoType.startsWith('Box')) {
         const { width, height, depth } = object.mesh.geometry.parameters
         const { x, y, z } = object.mesh.position
         
         body = new CANNON.Body({
            fixedRotation,
            mass,
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
            position: new CANNON.Vec3(x, y, z),
            shape: new CANNON.Sphere(radius),
            material: this.materials[material]
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
      
      this.world.addBody(body)
      this.list.push({ body, mesh })
   }
   
   loop() {
      this.world.step(1/60)

      for (const { mesh, body } of this.list) {
         // console.log('meow', mesh.position)
         mesh.position.copy(body.position)
         mesh.quaternion.copy(body.quaternion)
      }
   }
}

c3.physics = new C3_Physics
