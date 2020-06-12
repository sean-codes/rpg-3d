class C3_GameObjects {
   constructor() {
      this.types = c3.objectTypes
      this.list = []
      this.id = -1
   }
   
   create({ type = '', attr = {} }) {
      const Template = this.types[type]
      const id = this.id++
      const object = new Template({ attr, type, id })
      this.list.push(object)
      
      return object
   }
   
   destroy(object) {
      this.list = this.list.filter((o) => o.id !== object.id)
   }
   
   find(type) {
      return this.list.find(o => o.type === type)
   }
}

c3.gameObjects = new C3_GameObjects
