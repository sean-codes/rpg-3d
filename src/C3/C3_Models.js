class C3_Models {
   constructor() {
      this.list = []
      this.materials = {}
   }
   
   find(modelName) {
      return this.list.find(m => m.name === modelName)
   }
   
   materialAdd(name, material) {
      this.materials[name] = material
   }
   
   materialFind(name) {
      return this.materials[name]
   }
   
   loop(delta) {
      for (const model of this.list) {
         model.mixer.update(delta)
      }
   }
}

c3.models = new C3_Models
