# Third person camera
```js
// 1. Make an object to rotate x/y and attach the camera to it
cameraLookX = new THREE.Object3D()
cameraLookY = new THREE.Object3D()
cameraLookY.add(cameraLookX)
cameraLookX.add(camera)

// 2. Add that to the player mesh
playerMesh.add(cameraLookY)

// 3. Update
function render() {
   // Arrow keys
   if (c3.checkKey(39).held) {
      cameraLookY.rotation.y += 0.1
   }

   if (c3.checkKey(37).held) {
      cameraLookY.rotation.y -= 0.1
   }

   if (c3.checkKey(38).held) {
      cameraLookX.rotation.x += 0.1
   }

   if (c3.checkKey(40).held) {
      cameraLookX.rotation.x -= 0.1
   }

   // Pressing forward on the character move behind
   if (c3.checkKey(87).held) {
      cameraLookY.rotation.y -= cameraLookY.rotation.y * 0.01
   }

   // Stop camera for twisting more than one time
   if (cameraLookY.rotation.y < -Math.PI) {
      cameraLookY.rotation.y = Math.PI*2 + cameraLookY.rotation.y
   }

   if (cameraLookY.rotation.y > Math.PI) {
      cameraLookY.rotation.y = -Math.PI*2 + cameraLookY.rotation.y
   }


   // Keep camera from going to high or low
   cameraLookX.rotation.x = Math.max(-0.8, cameraLookX.rotation.x)
   cameraLookX.rotation.x = Math.min(0.8, cameraLookX.rotation.x)
}
```
