# Adding a light
To make our shape not look so flat we will add a light!

Before we can add a light and make it work we will need to change out MeshBasicMaterial into one that can be affected by light. We can use `MeshPhongMaterial`, `MeshStandardMaterial`, or `MeshPhysicalMaterial`. For this we will use Phong since it seems to be the best for performance.

Change Basic Material for Phong
```js
const material = new THREE.MeshPhongMaterial({ color: "#465" });
```

Create a directional light
```js
const light = new THREE.DirectionalLight(0xffffff, 1);
```

Then move it a bit
```js
light.position.set(2, 0, 0);
```

And add it to the scene
```js
scene.add(light);
```

Complete code:
```js
// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 4);
scene.add(light);
```
