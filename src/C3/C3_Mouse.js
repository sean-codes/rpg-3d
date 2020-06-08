class C3_Mouse {
   constructor() {
      window.addEventListener('mousewheel', (e) => {
         cameraLookX.rotation.x -= e.deltaY/100
         cameraLookY.rotation.y += e.deltaX/100
      })
   }
   
   handleMouseWheel(e) {
      e.preventDefault()
      
   }
}
