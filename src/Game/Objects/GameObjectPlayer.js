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
         material: 'BOX',
         fixedRotation: true
      }
   }
   
   create({ pos }) {
      this.setPosition(pos)
      
      this.weapon = c3.gameObjects.create({ type: 'Weapon' })
      this.model.boneToggle('PalmR', this.weapon.mesh)
      // Others
      this.accel = 0
      this.isAttacking = false
   }
   
   step() {
      // Movement
      if (c3.keyboard.check('forward').down) {
         this.model.animateTo('run', 0.1)
      }
      
      if (c3.keyboard.check('forward').up) {
         this.model.animateTo('idle', 0.1)
      }
      
      // Attack
      if (c3.keyboard.check('attack').down && !this.isAttacking) {
         this.isAttacking = true
         this.model.animateOnce('attack', () => { this.isAttacking = false })
      }
      
      if (c3.keyboard.check('equip_helmet').down) {
         const modelHelmet = c3.models.find('helmet')
         this.model.boneToggle('Head', modelHelmet)
      }
      // this.accel > 0
      //    ? this.modelPlayer.transition('run', 100)
      //    : this.modelPlayer.transition('idle', 100)
      // 
   }
}
