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
``

Applying body to threejs mesh
```js
mesh.position.copy(body.position)
mesh.quaternion.copy(body.quaternion)
```
