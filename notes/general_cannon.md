# General Cannon notes

## Fixed Rotation
```js
// Add fixed rotation to constructor
const body = new CANNON.Body({
   mass: 0.1,
   shape: new CANNON.Sphere(),
   position: new CANNON.Vec3(),
   material: new CANNON.Material({ friction: 0 }),
   fixedRotation: true
})


// Add to body later
body.fixedRotation = true
body.updateMassProperties() // dont forget to run this
```
