c3.objectTypes.Resource = class GameObjectResource extends c3.GameObject {
   mesh() {
      const geo = new THREE.SphereBufferGeometry(2)
      const mat = c3.models.materialFind('WIREFRAME')
      const mes = new THREE.Mesh(geo, mat)
      
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
