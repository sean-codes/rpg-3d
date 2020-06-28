class C3_Objects {
   constructor() {
      this.types = c3.objectTypes
      this.list = []
      this.id = -1
   }
   
   create(type, attr = {}) {
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
      return this.list.find(o => type === o.type)
   }
   
   findAll(type) {
      const arrTypes = typeof type === 'object' ? type : [type]
      return this.list.filter(o => arrTypes.includes(o.type))
   }
}

c3.objects = new C3_Objects
