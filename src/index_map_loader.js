// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first
const init = async function({ c3, camera, scene, renderer, datGui }) {
   scene.background = new THREE.Color('#cdcdff')
   camera.position.set(0, 1000, -1000)
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


   const mapFetch = await fetch('./assets/krunkerio_map.json')
   const mapJson = await mapFetch.json()

   const mats = {}

   const boxMat = new THREE.MeshPhongMaterial({ color: '#666' })
   for (const {s, p, id, t, c, r=[] } of mapJson.objects) {
      let mat = boxMat
      if (t) {
         mat = mats[t] || new THREE.MeshPhongMaterial({ color: `rgba(${Math.floor(100+Math.random()*100)}, ${Math.floor(100+Math.random()*100)}, ${Math.floor(100+Math.random()*100)})`})
      }
      const boxGeo = new THREE.BoxGeometry(s[0], s[1], s[2])
      boxGeo.translate(0, s[1]/2, 0)
      const boxMes = new THREE.Mesh(boxGeo, mat)
      boxMes.receiveShadow = true
      boxMes.castShadow = true
      scene.add(boxMes)
      boxMes.position.set(p[0], p[1], p[2])
      boxMes.rotation.set(r[0] || 0, r[1] || 0, r[2] || 0)
   }
}

const render = function({ c3, time, clock, camera }) {

}


window.c3 = new C3({ init, render })
window.c3.init()
