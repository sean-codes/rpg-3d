c3.objectTypes.Ground = class GameObjectGround extends c3.GameObject {
   mesh() {
      const geo = new THREE.PlaneBufferGeometry(200, 200)
      const mat = new THREE.MeshPhongMaterial({ 
         color: '#4b7', 
         // map: textureGrass, 
         flatShading: true, 
         reflectivity: 0, 
         shininess: 0 
      })
      const mes = new THREE.Mesh(geo, mat)
      mes.receiveShadow = true
      mes.rotation.x -= Math.PI * 0.5
      mes.position.y -= 0.001
      
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
      
   }
}
