class C3_Camera {
   constructor() {
      this.object = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.001, 1000)
   }
   
   setAspect(aspect) {
      this.object.aspect = aspect
      this.object.updateProjectionMatrix()
   }
   setPosition(x, y, z) {
      this.object.position.set(0, 0, -15)
   }
   
   setNearFar(near, far) {
      this.object.near = 1
      this.object.far = 5000
      this.object.updateProjectionMatrix()
   }
   
   lookAt(x, y, z) {
      this.object.lookAt(0, 0, 0)
   }
}

c3.camera = new C3_Camera
