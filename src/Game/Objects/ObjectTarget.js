class ObjectTarget extends c3.Object {
   mesh() {
      const geo = new THREE.OctahedronGeometry(2, 0)
      const mat = c3.models.materialFind('TARGET')
      const mes = new THREE.Mesh(geo, mat)
      
      mes.receiveShadow = true
      mes.castShadow = true
      return mes
   }
   
   // physics() {
   //    return {
   //       meshes: [ this.mesh ],
   //       material: 'TARGET',
   //       mass: 0,
   //    }
   // }
   
   create({ pos }) {
      this.setPosition(pos)
   }
   
   step() {
      
   }
}

c3.objectTypes.Target = ObjectTarget
