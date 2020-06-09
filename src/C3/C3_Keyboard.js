class C3_Keyboard {
   constructor(keyMap) {
      this.keyMap = keyMap
      this.keys = {}
      for (const keyName in this.keyMap) {
         const keyCode = this.keyMap[keyName]
         this.keys[keyCode] = { up: false, down: false, held: false }
      }
      
      this.listen()
   }
   
   listen() {
      document.body.addEventListener('keydown', e => { !e.repeat && this.onKeyDown(e.keyCode)})
      document.body.addEventListener('keyup', e => { this.onKeyUp(e.keyCode) })
   }
   
   onKeyDown(keyCode) {
      if (!this.keys[keyCode]) return
      this.keys[keyCode] = { up: false, down: true, held: true }
   }

   onKeyUp(keyCode) {
      if (!this.keys[keyCode]) return
      this.keys[keyCode] = { up: true, down: false, held: false }
   }

   check(keyName) {
      const key = this.keyMap[keyName]
      return this.keys[key] || { up: false, down: false, help: false }
   }

   resetKeys() {
      for (const keyId in this.keys) {
         this.keys[keyId].up = false
         this.keys[keyId].down = false
      }
   }
}

c3.keyboard = new C3_Keyboard(c3.keyMap)
