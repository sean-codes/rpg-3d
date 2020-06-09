class C3_GameObjects {
   constructor() {
      this.types = c3.objectTypes
      this.list = []
   }
   
   create({ type = '', attr = {} }) {
      const Template = this.types[type]
      const object = new Template({ attr, type })
      this.list.push(object)
      
      c3.scene.add(object.mesh)
      
      return object
   }
   
   find(type) {
      return this.list.find(o => o.type === type)
   }
}

c3.gameObjects = new C3_GameObjects
