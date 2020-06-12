c3.gameObjects.types.Dragon = class Dragon extends c3.GameObject {
   mesh() {
      const geo = new THREE.SphereGeometry(2)
      const mat = c3.models.materialFind('WIREFRAME')
      const mes = new THREE.Mesh(geo, mat)
      
      this.model = c3.models.find('dragon').clone()
      this.model.object.position.y -= 2
      this.model.object.position.z += 0.5
      mes.add(this.model.object)
      
      return mes
   }
   
   physics() {
      return {
         meshes: [this.mesh],
         material: 'BOX',
         fixedRotation: true
      }
   }
   
   create({ pos }) {
      this.setPosition(pos)
      this.model.animateStart('DragonModel|Dragon_Flying', { time: Math.random() * 15 })
      this.accel = 0
      this.dead = false
   }
   
   step() {
      const player = c3.gameObjects.find('Player')
      const distanceFromPlayer = this.mesh.position.distanceTo(player.mesh.position)

      if (distanceFromPlayer < 10) {
         const direction = player.mesh.position.clone().sub(this.mesh.position)
         const targetAngle = c3.math.loopAngle(new THREE.Vector2(-direction.x, direction.z).angle() - (Math.PI/2))
         const angleDiff = c3.math.angleToAngle(this.rotation.y, targetAngle)
         const newAngle = c3.math.loopAngle(this.rotation.y + angleDiff / 10)
         
         this.setRotationY(newAngle)
      }

      if (distanceFromPlayer < 10 && distanceFromPlayer > 4) {
         this.accel = Math.min(5, this.accel + 1)
      } else {
         this.accel = Math.max(0, this.accel - 0.5)
      }

      const dragonDirection = this.getDirection()

      this.body.velocity.set(
         dragonDirection.x*this.accel,
         this.body.velocity.y,
         dragonDirection.z*this.accel,
      )
   }
   
   killDragon() {
      if (this.dead) return
      this.dead = true
      this.model.animateOnce('DragonModel|Dragon_Death', () => {
         this.destroy()
      })
   }
}
