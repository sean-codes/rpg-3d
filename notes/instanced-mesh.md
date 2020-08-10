# Instanced Mesh
Instanced mesh is for rendering a lot of objects that share the same geometry / material but in different locations/rotations.

> The current implementation requires that materials are not shared between InstancedMesh and other 3D objects.

```js
// creating an instanced mesh
const iMesh = new THREE.InstancedMesh(geo, mat, 20*20*20)
iMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
scene.add(iMesh)

// setting the position of objects within
// 1. create a cursor to set position / rotation
const cursor = new THREE.Object3D()

// 2. find the index, move the cursor, copy the cursor position
for (var x = 0; x < 20; x++) {
   for (var y = 0; y < 20; y++) {
      for (var z = 0; z < 20; z++) {
         cursor.position.set(x*space-offset, y*space-offset, z*space-offset)
         cursor.updateMatrix()
         
         // copying the cursor matrix
         iMesh.setMatrixAt(i, cursor.matrix)
         i++
      }
   }
}

// if calling during render
iMesh.instanceMatrix.needsUpdate = true

```
