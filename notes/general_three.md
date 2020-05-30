# make an object appear on top of everything
```js
// Set depthTest to false either in constructor
const material = new MeshPhongMaterial({
   color: 'red',
   depthTest: false
})

// or outside
material.depthTest = false
```
