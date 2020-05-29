// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#cdcdff')
   camera.position.set(0, 100, -150)
   camera.near = 1
   camera.far = 10000
   camera.updateProjectionMatrix()
   camera.lookAt(0, 0, 0)

   var controls = new THREE.OrbitControls( camera, renderer.domElement );


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
            // const boxMes = new THREE.Mesh(boxGeo, boxMat)
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

      console.log(boxes)

      const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(boxes, false)
      const mesh = new THREE.Mesh(mergedGeometry, boxMat)
      scene.add(mesh)
      // for (const pixel of imageData)
      // var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
      // return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

   }

}

const render = function({ c3, time, clock, camera }) {

}


window.c3 = new C3({ init, render })
window.c3.init()
