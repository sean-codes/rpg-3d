# Physics
![physics example](./images/physics-random.gif)

There are a few physics engines to choose from
- [ammo.js](https://github.com/kripken/ammo.js/)
- [cannon.js](https://schteppe.github.io/cannon.js/)
- [oimo.js](http://lo-th.github.io/Oimo.js/index.html#basic)

They seem to all have pretty challenging documentation and not actively updated. Going with cannon since it seems to have a good ratio of features, filsesize, and performance


Create a physics world
```js
this.world = new CANNON.World()
this.world.gravity.set(0, -9.82, 0)
```

Creating a physics body
```js
boxBody = new CANNON.Body({
   mass: 5,
   position: new CANNON.Vec3(boxMes.position.x, boxMes.position.y, boxMes.position.z),
   shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25))
})
this.world.addBody(boxBody)
```

> Cannon sizes seem to be 1/2 a three.js unit!

Updating the physics world
```js
this.world.step(1/60)
```

Applying body to threejs mesh
```js
mesh.position.copy(body.position)
mesh.quaternion.copy(body.quaternion)
```

### Cannon materials
```js
// A cannon Material
const material = new CANNON.Material({
   name: "material",
   friction: -1, // how much grip
   restitution: -1 // bounciness
})

// A cannon ContactMaterial
const contactMaterial = new CANNON.ContactMaterial(material1, material2, {
   friction: 0,
   restutution: 0,
})
```

### Events
Cannon JS has a few events. The ones I could find sofar:

- 'collide' - `World.js` when a collision happens between two bodies
- 'sleepy, sleep' - `Body.js` something to do with sleep states
- 'preStep' - `World.js` before step
- 'postStep' - `World.js` after step

```js
// Listening for collision event
body.addEventListener('collide', (event) => {
   const { contact, body, target, type } = event
   // body = the body itself
   // contact = the contact information
   // target = what body collided with
   // type = the event type (collide)

   const { ni, bi, bj } = contact
   // ni = collision normal
   // bi, bj = colliding bodies

})
```


### Cylinders
To match up a physics cylinder to three we need to rotate it
```js
// Make a threejs cylinder
const cylinderGeo = new THREE.CylinderGeometry( 1, 1, 5, 10 )
const cylinderMat = new THREE.MeshPhongMaterial({ color: '#465' })
const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat)
scene.add(cylinderMesh)


// Make a cannon cylinder shape and rotate its points
const shapeCylinder = new CANNON.Cylinder(1, 1, 5, 10);
const quat = new CANNON.Quaternion();
quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);
const translation = new CANNON.Vec3(0, 0, 0);
shapeCylinder.transformAllPoints(translation, quat);

const cylBody = new CANNON.Body({
   mass: 2,
   shape: shapeCylinder,
   position: new CANNON.Vec3(5, 10, 0),
   material: new CANNON.Material({ friction: 0.1, restitution: 0 })
})

world.addBody(cylBody)
```


### Turning a body
```js
// 1. Create a blank object to rotate
const rotatorObject = new THREE.Object3D()

// 2. On keypress rotate that object and set it to the body
// I ran into weird issues trying to rotate the actual player mesh directly
function render() {
   if (leftKeyDown) {
      this.playerRotator.rotation.y -= 0.1
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.playerRotator.rotation.y);
   }

   if (rightKeyDown) {
      this.playerRotator.rotation.y += 0.1
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.playerRotator.rotation.y);
   }
}
```

### Moving a body forward
```js
// 1. Create an acceleration
let accel = 0

function render() {
   // 2. Increase / Decrease when forward key is down
   if (forwardKeyDown) {
      accel = Math.min(accel + 1, 12)
   } else {
      accel = Math.max(0, accel - 0.5)
   }

   // 3. Set the velocity!
   const playerDirection = mesh.getWorldDirection(new THREE.Vector3())

   body.velocity.set(
      playerDirection.x*accel,
      body.velocity.y,
      playerDirection.z*accel,
   )
}
```


### Remove Physics from Body but still get collisions
For make a collision box for the players weapon
```js
// creating a weapon collider type of object thing?
const weaponGeo = new THREE.BoxGeometry(4, 1, 1)
const weaponMes = new THREE.Mesh(weaponGeo, wireFrameMat)
weaponMes.position.x -= 2 // Offsetting to fix around model
models.character.bones.PalmR.add(weaponMes)

const weaponBody = new CANNON.Body({
   mass: 1,
   shape: new CANNON.Box(new CANNON.Vec3(2, 0.5, 0.5)),
   position: new CANNON.Vec3(weaponMes.position.x, weaponMes.position.y, weaponMes.position.z),
})

// this makes the object able to go through other objects but will still return collide event!
weaponBody.collisionResponse = false

world.add(weaponBody)

// added a prop here "linkToMesh" this will copy the world position from mesh to body
physicsObjects.push({ name: 'sword', body: weaponBody, mesh: weaponMes, linkToMesh: true })


weaponBody.addEventListener('collide', (e) => {
   // Making if collide on the dragon body
   const dragon = physicsObjects.find(o => o.name === 'dragon')
   if (e.body.id === dragon.body.id) {

      console.log('sword collision', e, playerBody.id, e.target.id, e.body.id)
   }
})


function render() {
   for (const { mesh, body, linkToMesh } of physicsObjects) {
      if (linkToMesh) {
         // console.log('inking')
         const meshWorldPosition = mesh.getWorldPosition(new THREE.Vector3())
         body.position.copy(meshWorldPosition)
         body.quaternion.copy(body.quaternion)
      } else {
         mesh.position.copy(body.position)
         mesh.quaternion.copy(body.quaternion)
      }
   }
}

```
