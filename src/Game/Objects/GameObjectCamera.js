c3.objectTypes.Camera = class GameObjectCamera extends c3.GameObject {
   mesh() {
      const { camera } = c3
      
      camera.position.set(0, 0, -15)
      camera.near = 1
      camera.far = 5000
      camera.updateProjectionMatrix()
      camera.lookAt(0, 0, 0)
      
      this.xRot = new THREE.Object3D()
      this.yRot = new THREE.Object3D()
      this.xRot.rotation.x += 0.2
      this.xRot.position.y += 3
      this.yRot.add(this.xRot)
      this.xRot.add(camera)
      return this.yRot
   }
   
   create({ player }) {
      this.player = player
      
      window.addEventListener('mousewheel', (e) => {
         this.xRot.rotation.x -= e.deltaY/100
         this.xRot.rotation.x = Math.min(this.xRot.rotation.x, Math.PI/2)
         this.xRot.rotation.x = Math.max(this.xRot.rotation.x, -0.25)
         this.yRot.rotation.y += e.deltaX/100
         this.yRot.rotation.y = c3.math.loopAngle(this.yRot.rotation.y)
      })
   }
   
   step() {
      const { mesh } = this
      mesh.position.copy(this.player.mesh.position)
   }
}
