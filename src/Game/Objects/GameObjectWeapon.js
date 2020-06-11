c3.objectTypes.Weapon = class GameObjectWeapon extends c3.GameObject {
   mesh() {
      const geo = new THREE.BoxGeometry(4.5, 1, 0.5)
      const mat = c3.models.materialFind('WIREFRAME')
      const mesh = new THREE.Mesh(geo, mat)
      
      return mesh
   }
   
   physics() {
      return {
         meshes: [ this.mesh ],
         material: 'BOX',
         fixedRotation: true,
         mass: 0,
         collisionResponse: false,
         linkToMesh: true,
      }
   }
   
   create({ pos }) {
      this.setPosition(c3.vector.create(-1.75, 0, 0))
      
      console.log(this.body)
   }
   
   step() {
   }
}
