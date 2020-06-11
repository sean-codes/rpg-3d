c3.objectTypes.Resource = class GameObjectResource extends c3.GameObject {
   mesh() {
      const geo = new THREE.SphereBufferGeometry(2)
      const mat = c3.models.materialFind('WIREFRAME')
      const mes = new THREE.Mesh(geo, mat)
      
      const type = c3.math.choose(['tree', 'rock', 'bush'])
      const model = c3.models.find(type).clone()
      
      mes.add(model.object)
      return mes
   }
   
   physics() {
      return {
         meshes: [this.mesh],
         material: 'GROUND',
         mass: 0
      }
   }
   
   create() {
      const randomPos = c3.math.randomPointFromPoint(this.body.position, c3.math.randomRange(10, 100))
      this.setPosition(randomPos)
      
   }
}
