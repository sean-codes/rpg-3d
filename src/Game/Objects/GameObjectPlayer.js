c3.objectTypes.Player = class GameObjectPlayer extends c3.GameObject {
   mesh() {
      // Bodies for physics
      const geoBodyBottom = new THREE.SphereGeometry(0.9)
      const matBodyBottom = c3.models.materialFind('WIREFRAME')
      this.meshBodyBottom = new THREE.Mesh(geoBodyBottom, matBodyBottom)
      
      const geoBodyTop = new THREE.CylinderGeometry( 1, 1, 5, 10 )
      const matBodyTop = c3.models.materialFind('WIREFRAME')
      this.meshBodyTop = new THREE.Mesh(geoBodyTop, matBodyTop)
      this.meshBodyTop.position.y += 2
      this.meshBodyBottom.add(this.meshBodyTop)
      
      // Character Model
      this.model = c3.models.find('character')
      this.meshBodyBottom.add(this.model.object)
      this.model.object.position.y -= 1
      this.model.animateStart('idle')
      
      const modelHelmet = c3.models.find('helmet')
      const modelSword = c3.models.find('sword')
      const modelShield = c3.models.find('shield')
      const modelShoulders = c3.models.find('shoulderPads')
      this.model.boneToggle('Head', modelHelmet)
      this.model.boneToggle('PalmR', modelSword)
      this.model.boneToggle('PalmL', modelShield)
      this.model.boneToggle('Neck', modelShoulders)
      
      return this.meshBodyBottom
   }
   
   physics() {
      return {
         meshes: [ this.meshBodyBottom, this.meshBodyTop ],
         material: 'PLAYER',
         fixedRotation: true,
         watchCollisions: true,
      }
   }
   
   create({ pos, camera }) {
      this.setPosition(pos)
      
      // Camera
      this.camera = c3.gameObjects.create({ type: 'Camera', attr: { player: this } })
      
      // Weapon Collider
      this.weapon = c3.gameObjects.create({ type: 'Weapon' })
      this.model.boneToggle('PalmR', this.weapon.mesh)
      
      // Others
      this.accel = 5
      this.speed = 20
      this.currentSpeed = c3.vector.create(0, 0)
      this.spinSpeed = 10
      this.isOnGround = false
      this.targetAngle = 0
   }
   
   step() {
      this.checkIsOnGround()
      
      // Movement
      let targetAngle = null
      if (c3.keyboard.check('forward').held) {
         targetAngle = c3.math.loopAngle(this.camera.yRot.rotation.y)
      }
      
      if (c3.keyboard.check('backward').held) {
         targetAngle = c3.math.loopAngle(this.camera.yRot.rotation.y + Math.PI)
      }
      
      if (c3.keyboard.check('left').held) {
         const keyAngle = c3.math.loopAngle(this.camera.yRot.rotation.y + Math.PI/2)
         targetAngle = targetAngle !== null
             ? targetAngle + c3.math.angleToAngle(targetAngle, keyAngle) / 2
             : keyAngle
      }
      
      if (c3.keyboard.check('right').held) {
         const keyAngle = c3.math.loopAngle(this.camera.yRot.rotation.y - Math.PI/2)
         targetAngle = targetAngle !== null
             ? targetAngle + c3.math.angleToAngle(targetAngle, keyAngle) / 2
             : keyAngle
      }
      
      if (c3.keyboard.check('forward').held
         || c3.keyboard.check('backward').held
         || c3.keyboard.check('left').held
         || c3.keyboard.check('right').held
      ) {
         this.currentSpeed.add(c3.vector.create(0, this.accel).rotateAround(c3.vector.create(), -targetAngle))
      } else {
         this.currentSpeed.multiplyScalar(0.9)
      }
      

      if (targetAngle !== null) this.targetAngle = targetAngle
      this.addRotationY(c3.math.angleToAngle(this.rotation.y, this.targetAngle)/5)

      // Run / Idle Animation
      if (c3.keyboard.check(['forward', 'backward', 'left', 'right']).down
         && !c3.keyboard.check(['forward', 'backward', 'left', 'right']).held
      ) {
         this.model.animateTo('run', 0.1)
      } else if (c3.keyboard.check(['forward', 'backward', 'left', 'right']).up
         && !c3.keyboard.check(['forward', 'backward', 'left', 'right']).held
      ) {
         this.model.animateTo('idle', 0.1)
      }
      
      // Attack
      if (c3.keyboard.check('attack').down && !this.isAttacking) {
         this.weapon.isAttacking = true
         this.model.animateOnce('attack', () => { this.weapon.isAttacking = false })
      }
      
      // Jump
      if (this.body.velocity.y > 5) this.isOnGround = false
      if (c3.keyboard.check('jump').down && this.isOnGround) {
         this.body.velocity.y = 25
         this.isOnGround = false
      }
      
      if (c3.keyboard.check('equip_helmet').down) {
         const modelHelmet = c3.models.find('helmet')
         this.model.boneToggle('Head', modelHelmet)
      }
      
      // clamp speed
      
      const speedDirection = this.currentSpeed.clone().normalize()
      const speedLength = this.currentSpeed.distanceTo(c3.vector.create())
      if (speedLength > this.speed) this.currentSpeed = speedDirection.multiplyScalar(this.speed)
      
      // const speedRotated = this.currentSpeed.clone().rotateAround(c3.vector.create(), targetAngle)
      
      this.body.velocity.set(
         this.currentSpeed.x,
         this.body.velocity.y,
         this.currentSpeed.y,
      )
   }
   
   checkIsOnGround() {
      for (const collision of this.getCollisions()) {
         this.isOnGround = this.isOnGround || collision.isOnGround
      }
   }
}
