// control scheme I made for editing on my macbook
// WASD = Forward, Backward, Left, Right
// RF = Up, Down
// Scroll = Pan camera

THREE.FlyControls = class {
   constructor(camera, domElement) {
      this.domElement = domElement
      this.camera = camera
      
      this.object = new THREE.Object3D()
      this.xAxis = new THREE.Object3D()
      this.yAxis = new THREE.Object3D()
      this.yAxis.add(camera)
      this.xAxis.add(this.yAxis)
      this.object.add(this.xAxis)
      
      this.object.position.y += 15
      
      this.key = {
         forward: { down: false, code: 87 },
         backward: { down: false, code: 83 },
         left: { down: false, code: 65 },
         right: { down: false, code: 68 },
         up: { down: false, code: 82 },
         down: { down: false, code: 70 },
      }
      
      this.listen()
      this.loop()
   }
   
   listen() {
      this.domElement.addEventListener('wheel', (e) => this.handleMouseWheel(e))
      this.domElement.addEventListener('keydown', (e) => this.handleKeyDown(e))
      this.domElement.addEventListener('keyup', (e) => this.handleKeyUp(e))
   }
   
   handleMouseWheel(e) {
      this.xAxis.rotation.y += e.deltaX/100
      this.yAxis.rotation.x += e.deltaY/100
   }
   
   handleKeyDown(e) {
      for (const keyName in this.key) {
         const key = this.key[keyName]
         if (e.keyCode === key.code) {
            key.down = true
         }
      }
   }
   
   handleKeyUp(e) {
      for (const keyName in this.key) {
         const key = this.key[keyName]
         if (e.keyCode === key.code) {
            key.down = false
         }
      }
   }
   
   loop() {
      setTimeout(() => this.loop(), 1000/60)
      
      const direction = this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.25)
      // ..flat what? cmon wtf.
      // give me a break I mean make it 2d like a piece of paper. Paper is flat
      const flat = new THREE.Vector2(direction.x, direction.z)
      // polar is a angle and length
      // cart is an x/y
      const angle = flat.angle() + Math.PI*0.5
      const turned = new THREE.Vector3(Math.cos(angle)*0.25, 0, Math.sin(angle)*0.25)
      
      if (this.key.forward.down) {
         this.object.position.add(direction)
      }
      
      if (this.key.backward.down) {
         this.object.position.sub(direction)
      }
      
      if (this.key.right.down) {
         this.object.position.add(turned)
      }
      
      if (this.key.left.down) {
         this.object.position.sub(turned)
      }
      
      if (this.key.up.down) {
         this.object.position.y += 0.25
      }
      
      if (this.key.down.down) {
         this.object.position.y -= 0.25
      }
   }
}
