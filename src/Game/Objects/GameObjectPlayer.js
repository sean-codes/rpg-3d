c3.objectTypes.Player = class GameObjectPlayer extends c3.GameObject {
   mesh() {
      // Bodies for physics
      const geoBodyBottom = new THREE.SphereGeometry(1)
      const matBodyBottom = c3.models.materialFind('WIREFRAME')
      this.meshBodyBottom = new THREE.Mesh(geoBodyBottom, matBodyBottom)
      
      const geoBodyTop = new THREE.SphereGeometry(1)
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
         fixedRotation: true
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
      this.accel = 0
      this.speed = 20
      this.isAttacking = false
      this.spinSpeed = 10
      this.isOnGround = false
      
      this.body.addEventListener('collide', event => this.setIsOnGround(event))
   }
   
   step() {
      // Movement
      if (c3.keyboard.check('forward').held) {
         const targetAngle = c3.math.loopAngle(this.camera.yRot.rotation.y)
         let angleDiff = c3.math.angleToAngle(this.rotation.y, targetAngle)
         this.setRotationY(c3.math.loopAngle(this.rotation.y + angleDiff / this.spinSpeed))
      }
      
      if (c3.keyboard.check('backward').held) {
         const targetAngle = c3.math.loopAngle(this.camera.yRot.rotation.y + Math.PI)
         let angleDiff = c3.math.angleToAngle(this.rotation.y, targetAngle)
         this.setRotationY(c3.math.loopAngle(this.rotation.y + angleDiff / this.spinSpeed))
      }
      
      if (c3.keyboard.check('left').held) {
         const targetAngle = c3.math.loopAngle(this.camera.yRot.rotation.y + Math.PI/2)
         let angleDiff = c3.math.angleToAngle(this.rotation.y, targetAngle)
         this.setRotationY(c3.math.loopAngle(this.rotation.y + angleDiff / this.spinSpeed))
      }
      
      if (c3.keyboard.check('right').held) {
         const targetAngle = c3.math.loopAngle(this.camera.yRot.rotation.y - Math.PI/2)
         let angleDiff = c3.math.angleToAngle(this.rotation.y, targetAngle)
         this.setRotationY(c3.math.loopAngle(this.rotation.y + angleDiff / this.spinSpeed))
      }

      // Run / Idle Animation
      if (c3.keyboard.check(['forward', 'backward', 'left', 'right']).down
         && !c3.keyboard.check(['forward', 'backward', 'left', 'right']).held
      ) {
         this.model.animateTo('run', 0.1)
      }
      
      if (c3.keyboard.check(['forward', 'backward', 'left', 'right']).up
         && !c3.keyboard.check(['forward', 'backward', 'left', 'right']).held
      ) {
         this.model.animateTo('idle', 0.1)
      }
      
      // Acceleration
      this.accel = c3.keyboard.check(['forward', 'backward', 'left', 'right']).held
         ? Math.min(this.accel + 0.5, this.speed)
         : Math.max(this.accel - 0.5, 0)
      
      // Attack
      if (c3.keyboard.check('attack').down && !this.isAttacking) {
         this.isAttacking = true
         this.model.animateOnce('attack', () => { this.isAttacking = false })
      }
      
      // Jump
      if (c3.keyboard.check('jump').down && this.isOnGround) {
         this.body.velocity.y = 18
         this.isOnGround = false
      }
      
      if (c3.keyboard.check('equip_helmet').down) {
         const modelHelmet = c3.models.find('helmet')
         this.model.boneToggle('Head', modelHelmet)
      }
      
      const playerDirection = this.mesh.getWorldDirection(new THREE.Vector3())
      this.body.velocity.set(
         playerDirection.x*this.accel,
         this.body.velocity.y,
         playerDirection.z*this.accel,
      )
   }
   
   setIsOnGround(event) {
      const { contact, body, target, type } = event
      const { ni, bj, bi } = contact

      const contactNormal = new CANNON.Vec3()
      const upAxis = new CANNON.Vec3(0, 1, 0)
      const directionOfCollision = bi.id === this.body.id ? -ni.y : ni.y

      if (directionOfCollision > 0.9) {
         this.isOnGround = true
      }
   }
}
