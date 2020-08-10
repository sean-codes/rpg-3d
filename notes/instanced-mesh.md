# Instanced Mesh
![Instanced Mesh](./images/instanced-mesh.gif)

Instanced mesh is for rendering a lot of objects that share the same geometry / material but in different locations/rotations.

> The current implementation requires that materials are not shared between InstancedMesh and other 3D objects.


## Basic Cube
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

## Model
When loading an FBX Model I needed to rotate and scale the geometry.
```js
geometry.rotateX(-Math.PI/2)
// you can find the scale fix from the geometries parent
const scaleFix = object.children[0].scale.x
geometry.scale(scaleFix, scaleFix, scaleFix)
```

```js
const loader = new THREE.FBXLoader()
loader.load('../../assets/models/monsters/FBX/Dragon_Edited.fbx', (object) => {
   console.log('Loaded object', object)
   
   // geometry + material out of the model
   const geometry = object.children[0].geometry
   const material = object.children[0].material
   console.log('geometry', geometry)
   console.log('material', material)
   
   // fixing scale based on the models scale
   const modelScale = 0.1 // made this up
   const scaleFix = object.children[0].scale.x / 10 * modelScale
   geometry.scale(scaleFix, scaleFix, scaleFix)
   geometry.rotateX(-Math.PI/2)
   
   // regular mesh
   // const mesh = new THREE.Mesh(geometry, material)
   // scene.add(mesh)
   
   // instanced mesh
   iMesh = new THREE.InstancedMesh(geometry, material, perRow*perRow*perRow)
   iMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
   
   scene.add(iMesh)
}, null, (e) => { throw e })

```
