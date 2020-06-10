class GameObjectBox extends c3.GameObject {
   mesh() {
      const geo = new THREE.BoxGeometry(2, 2, 2)
      const mat = new THREE.MeshPhongMaterial({ color: '#ddd' })
      const mes = new THREE.Mesh(geo, mat)
         
      return mes
   }
   
   create() {
      this.setPosition(c3.vector.create([
         c3.math.randomRange(-8, 8), 
         c3.math.randomRange(3, 20), 
         c3.math.randomRange(-8, 8)
      ]))
      
      c3.physics.addObject(this, { material: 'BOX' })
   }
   
   step() {

   }
   
   draw() {

   }
}

c3.objectTypes.Box = GameObjectBox
