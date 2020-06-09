class C3_Models {
   constructor() {
      this.list = []
   }
   
   find(modelName) {
      return this.list.find(m => m.name === modelName)
   }
   
   loop(delta) {
      for (const model of this.list) {
         model.mixer.update(delta)
      }
   }
}

c3.models = new C3_Models
