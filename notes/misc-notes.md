# Make an object appear on top of everything

```js
// Set depthTest to false either in constructor
const material = new MeshPhongMaterial({
   color: 'red',
   depthTest: false
})

// or outside
material.depthTest = false
```

# Get size of threeJS object
```js
const box = new THREE.Box3().setFromObject(someMeshOrObject)
console.log(box)
```
