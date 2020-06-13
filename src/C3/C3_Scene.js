class C3_Scene {
   constructor() {
      this.scene = new THREE.Scene()
   }
   
   setFog(start, end) {
      this.scene.fog = new THREE.Fog('#FFF', start, end);
   }
   
   add(object) {
      this.scene.add(object)
   }
   
   remove(object) {
      this.scene.remove(object)
   }
   
   setBackground(color) {
      this.scene.background = new THREE.Color(color)
   }
}

c3.scene = new C3_Scene
