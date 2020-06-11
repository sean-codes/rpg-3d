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
      this.keys[keyCode] = { up: false, down: true, held: false }
   }

   onKeyUp(keyCode) {
      if (!this.keys[keyCode]) return
      this.keys[keyCode] = { up: true, down: false, held: false }
   }

   check(keyNameOrArrayOfKeys) {
      const returnVal = { up: false, down: false, held: false }
      const keyNames = Array.isArray(keyNameOrArrayOfKeys)
         ? keyNameOrArrayOfKeys 
         : [keyNameOrArrayOfKeys]
   

      for (const keyName of keyNames) {
         const key = this.keyMap[keyName]
         const status = this.keys[key]
         if (!status) continue
         
         returnVal.up = returnVal.up || status.up
         returnVal.down = returnVal.down || status.down
         returnVal.held = returnVal.held || status.held
      }
      
      return returnVal
   }

   resetKeys() {
      for (const keyId in this.keys) {
         if (this.keys[keyId].down) this.keys[keyId].held = true
         
         this.keys[keyId].up = false
         this.keys[keyId].down = false
      }
   }
}

c3.keyboard = new C3_Keyboard(c3.keyMap)
