c3.objectTypes.Player = class GameObjectPlayer extends c3.GameObject {
   mesh() {
      const model = c3.models.find('character')
      this.model = model
      this.model.animateStart('idle')
      // console.log('model', model)
      // const geo = new THREE.SphereGeometry(1)
      // const mat = new THREE.MeshPhongMaterial({ color: '#999', flatShading: true })
      // const mes = new THREE.Mesh(geo, mat)
      
      return model.object
   }
   
   create({ pos }) {
      // this.setShape({ type: 'sphere', size: 1 })
      // Position
      this.setPosition(pos)
      
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
      
      // this.rotate(0.01, 0.02, 0.01)
      if (c3.keyboard.check('forward').down) {
         this.model.animateTo('run', 0.1)
      }
      
      if (c3.keyboard.check('forward').up) {
         this.model.animateTo('idle', 0.1)
      }
      
      if (c3.keyboard.check('attack').down && !this.isAttacking) {
         this.isAttacking = true
         this.model.animateOnce('attack', () => {
            this.isAttacking = false
         })
      }
      // if (c3.key('equip_helmet').down) {
      //    this.modelPlayer.addToBone('Head', this.modelSword)
      //    // this.modelPlayer.bones.Head.add(this.modelSword)
      // }
      // this.accel > 0
      //    ? this.modelPlayer.transition('run', 100)
      //    : this.modelPlayer.transition('idle', 100)
      // 
   }
}
