# Applying a texture

## Loading
```js
// Create a texture loader and use it within the Material constructor
const textureLoader = new THREE.TextureLoader()
```

## Plane
```js
const texture = textureLoader.load('./assets/grass.png')
const texturedMaterial = new THREE.MeshPhongMaterial({ map: texture })
```

## Wrapping
```js
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(45, 45);
```

## Crisp / pixelart
```js
texture.magFilter = THREE.NearestFilter
```
