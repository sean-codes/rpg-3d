# Adding a light
To make our shape not look so flat we will add a light!


Fight we will create a directional light
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
