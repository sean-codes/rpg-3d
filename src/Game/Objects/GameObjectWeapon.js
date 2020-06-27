c3.objectTypes.Weapon = class GameObjectWeapon extends c3.GameObject {
   mesh() {
      const geo = new THREE.BoxGeometry(0.5, 5, 1)
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
         watchCollisions: true
      }
   }
   
   create({ pos, parent }) {
      this.setPosition(c3.vector.create(0, 2.25, 0))
      this.parent = parent
   }
   
   step() {
      for (const collision of this.getCollisions()) {
         const { other } = collision
         
         if (other.type === 'Dragon' && this.parent.isAttacking) {
            other.killDragon()
         }
      }
   }
}
