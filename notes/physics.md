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
