// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first

const init = async function(c3) {
   c3.camera.position.set(0, 2, 0)

   // Orbit Camera
   const controls = new THREE.OrbitControls(c3.camera, c3.renderer.domElement)
   controls.target.set(0, 0, 0)
   controls.update()

   const ambientLight = new THREE.AmbientLight('#FFF', 0.75)
   c3.scene.add(ambientLight);

   const directionalLight = new THREE.DirectionalLight('#FFF');
   directionalLight.position.y += 4
   c3.scene.add(directionalLight);

   // position helper
   const lonGeometry = new THREE.BoxGeometry(0.25, 3, 0.25)
   const lonMaterial = new THREE.MeshPhongMaterial({ color: '#F22' })
   const lonMesh = new THREE.Mesh(lonGeometry, lonMaterial)
   c3.scene.add(lonMesh)

   const latGeometry = new THREE.BoxGeometry(3, 0.25, 0.25)
   const latMaterial = new THREE.MeshPhongMaterial({ color: '#F22' })
   const latMesh = new THREE.Mesh(latGeometry, latMaterial)
   lonMesh.add(latMesh)

   const latLonPointGeometry = new THREE.SphereGeometry(0.25)
   const latlonPointMaterial = new THREE.MeshPhongMaterial({ color: '#FF4' })
   const latLonPointMesh = new THREE.Mesh(latLonPointGeometry, latlonPointMaterial)
   latLonPointMesh.position.z = 1
   latMesh.add(latLonPointMesh)

   // create an origin helper
   const originHelper = new THREE.Object3D();
   originHelper.position.z = 0.5;
   latLonPointMesh.add(originHelper)


   // world
   const textureLoader = new THREE.TextureLoader()
   const worldTexture = textureLoader.load('./assets/world.jpg')
   const worldGeometry = new THREE.SphereGeometry(1, 32, 32)
   const worldMaterial = new THREE.MeshBasicMaterial({ map: worldTexture })
   const worldMesh = new THREE.Mesh(worldGeometry, worldMaterial)
   c3.scene.add(worldMesh)


   // add points from the dataset
   const fetchedData = await fetch('./assets/demographic-data.json')
   const data = await fetchedData.json()


   const geometries = []

   for (const point of data.points) {
      if (point.value === null) continue
      const yRot = THREE.MathUtils.degToRad(Number(point.lon) + -180) + Math.PI*0.5;
      const xRot = THREE.MathUtils.degToRad(Number(point.lat) + -60) + Math.PI*-0.135;

      lonMesh.rotation.y = yRot
      latMesh.rotation.x = xRot
      latLonPointMesh.updateWorldMatrix(true, false);

      const pointGeometry = new THREE.BoxBufferGeometry(0.01, 0.01, 0.01)
      pointGeometry.applyMatrix4(latLonPointMesh.matrixWorld)
      geometries.push(pointGeometry)
   }

   const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false)
   const pointMaterial = new THREE.MeshPhongMaterial({ color: '#F2F' })
   const pointMesh = new THREE.Mesh(mergedGeometry, pointMaterial)
   c3.scene.add(pointMesh)


   // remove helpers
   c3.scene.remove(lonMesh)
   c3.scene.remove(latMesh)
   c3.scene.remove(latLonPointMesh)
}

const render = function(c3) {
}


const c3 = new C3({ init, render })
c3.init()

window.c3 = c3
