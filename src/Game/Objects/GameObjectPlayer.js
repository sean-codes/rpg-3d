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
      
      const targetGeo = new THREE.SphereGeometry()
      const targetMat = new THREE.MeshBasicMaterial({ color: '#FFF', depthTest: false, flatShading: true})
      const targetMes = new THREE.Mesh(targetGeo, targetMat)
      targetMes.renderOrder = 1000
      this.meshTarget = targetMes
      
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
      this.accel = 4
      this.friction = 0.8
      this.speed = 20
      this.currentSpeed = c3.vector.create(0, 0)
      this.spinSpeed = 10
      this.isOnGround = false
      this.targetMoveAngle = 0
      this.targetLookAngle = 0
      this.target = undefined
   }
   
   step() {
      this.stepTargeting()
      this.stepAttack()
      this.stepMovement()
      this.stepJump()
      
      // testing equip
      if (c3.keyboard.check('equip_helmet').down) {
         const modelHelmet = c3.models.find('helmet')
         this.model.boneToggle('Head', modelHelmet)
      }
   }
   
   stepTargeting() {
      if (c3.keyboard.check('target').down) {
         if (this.target) {
            this.target = undefined
         } else {
            const dragons = c3.gameObjects.findAll(['Dragon', 'Target'])
            let closestDragon = undefined
            let closestDistance = 100000000000
            for (const dragon of dragons) {
               const distanceFromPlayer = this.mesh.position.distanceTo(dragon.mesh.position)
   
               if (distanceFromPlayer < 20 && distanceFromPlayer < closestDistance) {
                  closestDragon = dragon
                  closestDistance = distanceFromPlayer               
               }
            }

            if (closestDragon) {
               this.target = closestDragon
            }
         }
      }
      
      
      if (this.target) {
         !this.meshTarget.parent && c3.scene.add(this.meshTarget)
         this.meshTarget.position.copy(this.target.mesh.position)
         const distanceFromCamera = c3.camera.distanceFrom(this.meshTarget)
         const targetScale = distanceFromCamera/100
         this.meshTarget.scale.set(targetScale, targetScale, targetScale)
      } else {
         c3.scene.remove(this.meshTarget)
      }
   }
   
   stepMovement() {
      // Movement
      let targetMoveAngle = null
      let targetLookAngle = null
      let baseAngle = this.camera.yRot.rotation.y
      
      
      if (this.target) {
         const direction = this.target.mesh.position.clone().sub(this.mesh.position)
         const angleToTarget = new THREE.Vector2(-direction.x, direction.z).angle() - (Math.PI/2)
         
         baseAngle = angleToTarget
         targetLookAngle = angleToTarget
      }
      
      if (c3.keyboard.check('forward').held) {
         targetMoveAngle = c3.math.loopAngle(baseAngle)
      }
      
      if (c3.keyboard.check('backward').held) {
         targetMoveAngle = c3.math.loopAngle(baseAngle + Math.PI)
      }
      
      if (c3.keyboard.check('left').held) {
         const keyAngle = c3.math.loopAngle(baseAngle + Math.PI/2)
         targetMoveAngle = targetMoveAngle !== null
             ? targetMoveAngle + c3.math.angleToAngle(targetMoveAngle, keyAngle) / 2
             : keyAngle
      }
      
      if (c3.keyboard.check('right').held) {
         const keyAngle = c3.math.loopAngle(baseAngle - Math.PI/2)
         targetMoveAngle = targetMoveAngle !== null
             ? targetMoveAngle + c3.math.angleToAngle(targetMoveAngle, keyAngle) / 2
             : keyAngle
      }
      
      if (!this.target) {
         targetLookAngle = targetMoveAngle
      }
      if (c3.keyboard.check('forward').held
         || c3.keyboard.check('backward').held
         || c3.keyboard.check('left').held
         || c3.keyboard.check('right').held
      ) {
         this.currentSpeed.add(c3.vector.create(0, this.accel).rotateAround(c3.vector.create(), -targetMoveAngle))
      } else {
         this.currentSpeed.multiplyScalar(this.friction)
      }
      

      if (targetMoveAngle !== null) this.targetMoveAngle = targetMoveAngle
      if (targetLookAngle !== null) this.targetLookAngle = targetLookAngle
      this.addRotationY(c3.math.angleToAngle(this.rotation.y, this.targetLookAngle)/5)

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
      
      // clamp speed
      const speedDirection = this.currentSpeed.clone().normalize()
      const speedLength = this.currentSpeed.distanceTo(c3.vector.create())
      if (speedLength > this.speed) this.currentSpeed = speedDirection.multiplyScalar(this.speed)
      
      this.body.velocity.set(
         this.currentSpeed.x,
         this.body.velocity.y,
         this.currentSpeed.y,
      )
   }
   
   stepAttack() {
      // Attack
      if (c3.keyboard.check('attack').down && !this.weapon.isAttacking) {
         this.weapon.isAttacking = true
         this.model.animateOnce('attack', () => { this.weapon.isAttacking = false })
      }
   }
   
   stepJump() {
      for (const collision of this.getCollisions()) {
         this.isOnGround = this.isOnGround || collision.isOnGround
      }
      
      // Jump
      if (this.body.velocity.y > 5) this.isOnGround = false
      if (c3.keyboard.check('jump').down && this.isOnGround) {
         this.body.velocity.y = 25
         this.isOnGround = false
      }
   }
}
