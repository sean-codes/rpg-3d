class GameObjectBox extends c3.GameObject {
   mesh() {
      const scale = c3.math.randomRange(0.5, 2)
      const geo = new THREE.BoxGeometry(scale, scale, scale)
      const mat = new THREE.MeshLambertMaterial({ color: '#F66' })
      const mes = new THREE.Mesh(geo, mat)
      
      // c3.material.create("BOX", { type: "Lambert", color: "#F44" })
      // const mesh = c3.shape.create("BOX", { mat: "BOX", size: [1, 1, 1] })
      // put this in a config to default?
      mes.receiveShadow = true
      mes.castShadow = true
      return mes
   }
   
   physics() {
      return {
         meshes: [ this.mesh ],
         material: 'BOX'
      }
   }
   
   create() {
      this.xOff = 15
      this.zOff = 15
      this.spread = 1
      
      this.setPosition(c3.vector.create(
         this.xOff + c3.math.randomRange(-this.spread, this.spread), 
         c3.math.randomRange(10, 20), 
         this.zOff + c3.math.randomRange(-this.spread, this.spread)
      ))
      
      this.resetInterval = 60*6
      this.resetTime = c3.math.iRandom(this.resetInterval)
   }
   
   step() {
      if (!this.resetTime--) {
         this.resetTime = this.resetInterval
         this.setPosition(c3.vector.create(
            this.xOff + c3.math.randomRange(-this.spread, this.spread), 
            c3.math.randomRange(10, 20), 
            this.zOff + c3.math.randomRange(-this.spread, this.spread)
         ))
      }
   }
}

c3.objectTypes.Box = GameObjectBox
