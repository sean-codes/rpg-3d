c3.objectTypes.Player = class GameObjectPlayer extends c3.GameObject {
   mesh() {
      this.model = c3.models.find('character')
      this.model.animateStart('idle')
      
      const modelHelmet = c3.models.find('helmet')
      const modelSword = c3.models.find('sword')
      const modelShield = c3.models.find('shield')
      const modelShoulders = c3.models.find('shoulderPads')
      this.model.boneToggle('Head', modelHelmet)
      this.model.boneToggle('PalmR', modelSword)
      this.model.boneToggle('PalmL', modelShield)
      this.model.boneToggle('Neck', modelShoulders)
      
      // console.log('model', model)
      
      const geo = new THREE.SphereGeometry(1)
      const mat = c3.models.materialFind('WIREFRAME')
      const mes = new THREE.Mesh(geo, mat)
      mes.add(this.model.object)
      this.model.object.position.y -= 1
      this.physicsMeshAdd(mes)
      
      const geo2 = new THREE.SphereGeometry(1)
      const mat2 = c3.models.materialFind('WIREFRAME')
      const mes2 = new THREE.Mesh(geo2, mat2)
      mes2.position.y += 2
      mes.add(mes2)
      this.physicsMeshAdd(mes2)
      
      return mes
   }
   
   create({ pos }) {
      c3.physics.addObject(this, { material: 'BOX', fixedRotation: true })
      
      this.setPosition(pos)
      
      // this.setShape({ type: 'sphere', size: 1 })
      // Position
      
      // // Models
      // this.modelPlayer = c3.Models.clone('player')
      // this.modelSword = c3.Models.clone('sword')
      // this.add(modelPlayer)
      // 
      // // Physics
      // this.setPhysics({
      //    shape: c3.SHAPE_CIRCLE,
      //    material: c3.materials.GENERAL,
      //    size: 5,
      // })
      // 
      // // Others
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
