# Importing a FBX model
![Imported Model](./images/model-imported-with-shadows.gif)


To import an FBX model we need an FBX Loader and a peer dependancy for that loader `zlibjs`

```html
<script src="./node_modules/zlibjs/bin/inflate.min.js"></script>
<script src="./node_modules/three/examples/js/loaders/FBXLoader.js"></script>
```

We will be using a model form Abobe Mixami. Select a model and download as .fbx format
> There is an option for fbx unity. I'm not sure what that's for yet


Load the model using FBXLoader and add it to the scene!
```js
const fbxLoader = new THREE.FBXLoader()
fbxLoader.load('./assets/models/xbot.fbx', (object) => {
   scene.add(object)
})
```

Be sure to zoom your camera out
```js
camera.position.set(0, 300, 400)
camera.far = 2000
camera.lookAt(0, 150, 0)
camera.updateProjectionMatrix()
```


We can also add shadows to the model by adding a light and a plane
```js
// a light bulb
const dirLight = new THREE.DirectionalLight('#FFF')
dirLight.position.set(100, 300, 400)
dirLight.castShadow = true
dirLight.shadow.camera.left -= 500
dirLight.shadow.camera.right += 500
dirLight.shadow.camera.top += 500
dirLight.shadow.camera.bottom -= 500
dirLight.shadow.camera.far = 2000
scene.add(dirLight)

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
scene.add(dirLightHelper)

const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
scene.add(dirLightCameraHelper)


// a plane
const geoGround = new THREE.PlaneBufferGeometry(4000, 4000)
const matGround = new THREE.MeshPhongMaterial({ color: '#cbdbfc' })
const mesGround = new THREE.Mesh(geoGround, matGround);
mesGround.receiveShadow = true
mesGround.rotation.x -= Math.PI * 0.5
scene.add(mesGround)
```


Then on the loaded model we need to set the meshes to cashShadows
```js
const fbxLoader = new THREE.FBXLoader()
fbxLoader.load('./assets/models/xbot.fbx', (object) => {
   scene.add(object)

   object.traverse((child) => {
      if (child.isMesh) {
         child.castShadow = true
         child.receiveShadow = true
      }
   })
})
```
