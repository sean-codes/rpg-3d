class C3_GameObjects {
   constructor() {
      this.types = {}
      this.list = []
   }
   
   create({ type = '', attr = {} }) {
      console.log('creating an object')
      const Template = this.types[type]
      const object = new Template({ attr })
      this.list.push(object)
      
      c3.scene.add(object.mesh)
      
      return object
   }
}

c3.gameObjects = new C3_GameObjects
