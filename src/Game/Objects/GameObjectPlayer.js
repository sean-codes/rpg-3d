c3.objectTypes.Player = class GameObjectPlayer extends c3.GameObject {
   mesh() {
      const geo = new THREE.SphereGeometry(1)
      const mat = new THREE.MeshPhongMaterial({ color: '#999', flatShading: true })
      const mes = new THREE.Mesh(geo, mat)
      
      return mes
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
   }
   
   step() {
      // this.rotate(0.01, 0.02, 0.01)
      if (c3.keyboard.check('forward').down) {
         console.log('forward')
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
