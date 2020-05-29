# lots of objects

```js

const image = new Image()
image.src = './assets/flat-pixel-map.png'
image.onload = function() {

   const canvas = document.createElement('canvas')
   canvas.width = image.width
   canvas.height = image.height
   const ctx = canvas.getContext('2d')
   ctx.drawImage(image, 0, 0)
   const imageData = ctx.getImageData(0, 0, image.width, image.height)

   const boxes = []
   const boxMat = new THREE.MeshPhongMaterial({
      vertexColors: THREE.VertexColors,
      shininess: 0,
   })

   for (let x = 0; x < canvas.width; x++) {
      for (let z = 0; z < canvas.height; z++) {
         const pos = (z*image.width+x) * 4
         const r = imageData.data[pos]
         const g = imageData.data[pos + 1]
         const b = imageData.data[pos + 2]
         if (x == 0) console.log(r, g, b)
         const boxGeo = new THREE.BoxBufferGeometry(1, 1, 1)

         boxGeo.translate(-image.width/2 + x, g == 214 ? 0.5 : 0, -image.width/2 + z)

         const numVerts = boxGeo.getAttribute('position').count;
         const itemSize = 3;  // r, g, b
         const colors = new Uint8Array(itemSize * numVerts);
         for (let i = 0; i < colors.length; i+=3) {
            colors[i] = r
            colors[i+1] = g
            colors[i+2] = b
         }

         boxGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3, true))
         boxes.push(boxGeo)
      }
   }

   const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(boxes, false)

   const mesh = new THREE.Mesh(mergedGeometry, boxMat)
   console.log(mesh)
   scene.add(mesh)

}
```
