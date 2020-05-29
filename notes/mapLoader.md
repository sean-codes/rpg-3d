# Map Loader
![Loading map](./images/loading-map.gif)

A look into how other games are doing map loading. I found a json file on reddit of a map for a game called krunker.io by a user hoaxnz

https://www.reddit.com/r/KrunkerIO/comments/97qg0x/map_kharack/

Downloaded the json and took a look into parsing it into a scene

The json looks like this
```json
{
   "objects": [
      {
         "p": [0, 27, 198],
         "s": [30, 2, 4],
         "r": [0, -0.17, 0],
      },
      {
         "p": [0, 27, 198],
         "s": [30, 2, 4],
         "r": [0, -0.17, 0],
      },
   ]
}

```

Thinking
- p = positon
- s = scale
- r = rotation

```js
// Fetch the data
const mapFetch = await fetch('./assets/krunkerio_map.json')
const mapJson = await mapFetch.json()

// I don't have the right textures to I will put random colors instead
const mats = {}
const boxMat = new THREE.MeshPhongMaterial({ color: '#465' })
for (const {s, p, id, t, c, r=[] } of mapJson.objects) {
   let mat = boxMat
   // I'm thinking t = texture or type
   // Will make a different color for each "type/texture"
   if (t) {
      mat = mats[t] || new THREE.MeshPhongMaterial({ color: `rgba(${Math.floor(100+Math.random()*100)}, ${Math.floor(100+Math.random()*100)}, ${Math.floor(100+Math.random()*100)})`})
   }
   const boxGeo = new THREE.BoxGeometry(s[0], s[1], s[2])
   // Moving the geometry origin to the bottom
   boxGeo.translate(0, s[1]/2, 0)
   const boxMes = new THREE.Mesh(boxGeo, mat)
   boxMes.receiveShadow = true
   boxMes.castShadow = true
   scene.add(boxMes)

   // Set the position/rotation
   boxMes.position.set(p[0], p[1], p[2])
   boxMes.rotation.set(r[0] || 0, r[1] || 0, r[2] || 0)
}
```


For lights
```js
const light = new THREE.AmbientLight('#FFF', 0.5)
scene.add(light)

const dirLight = new THREE.DirectionalLight('#FFF', 1)
dirLight.castShadow = true
dirLight.position.y += 300
dirLight.position.z += 500
dirLight.position.x += 300
dirLight.shadow.camera.near = 1
dirLight.shadow.camera.far = 1500
dirLight.shadow.camera.right = 1000;
dirLight.shadow.camera.left = -1000;
dirLight.shadow.camera.top = 1000;
dirLight.shadow.camera.bottom = -1000;
dirLight.shadow.bias = -0.005
dirLight.shadow.mapSize.width = 2048
dirLight.shadow.mapSize.height = 2048
scene.add(dirLight)
```
