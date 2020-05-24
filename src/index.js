// Not sure yet how we will structure this :]
// Lets figure out the basics of using three first

const init = async function(c3) {
   c3.camera.position.set(1500, 1500, 0)

   // Orbit Camera
   const controls = new THREE.OrbitControls(c3.camera, c3.renderer.domElement)
   controls.target.set(0, 0, 0)
   controls.update()

   const ambientLight = new THREE.AmbientLight('#FFF', 0.5)
   c3.scene.add(ambientLight);

   const directionalLight = new THREE.DirectionalLight('#FFF');
   directionalLight.castShadow = true;
   directionalLight.position.y += 1000
   directionalLight.position.x += 1000
   directionalLight.position.z += 1000
   directionalLight.target.position.set(0, 0, 0)
   directionalLight.shadow.bias = -0.005

   c3.datGui.add(directionalLight.shadow, 'bias', -1, 1, 0.001)
   directionalLight.shadow.camera.far = 4000
   directionalLight.shadow.camera.left -= 1500
   directionalLight.shadow.camera.top += 1500
   directionalLight.shadow.camera.bottom -= 1500
   directionalLight.shadow.camera.right += 1500
   directionalLight.shadow.mapSize.width = 2048
   directionalLight.shadow.mapSize.height = 2048
   c3.scene.add(directionalLight);
   c3.scene.add(directionalLight.target);

   const directionLightHelper = new THREE.DirectionalLightHelper(directionalLight);
   c3.scene.add(directionLightHelper);

   const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
   c3.scene.add(directionLightCameraHelper)

   // a gtlf file
   this.cars = []
   const gtlfLoader = new THREE.GLTFLoader();
   gtlfLoader.load('./assets/models/city/scene.gltf', (gltf) => {
      const root = gltf.scene
      console.log(root)
      // root.scale.x = 0.01
      // root.scale.y = 0.01
      // root.scale.z = 0.01

      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize()
      const boxCenter = box.getCenter()

      controls.target.set(boxCenter.x, boxCenter.y, boxCenter.z)
      controls.update()
      c3.scene.add(root)

      c3.logSceneGraph(root)
      const loadedCars = root.getObjectByName('Cars');
      console.log(loadedCars.children.length)
      // console.log(loadedCars)

      const fixes = [
         { prefix: 'car_08', y: 25, rot: [Math.PI * 0.5, 0, Math.PI * 0.5 ] },
         { prefix: 'car_03', y: 60, rot: [0, Math.PI, 0 ] },
         { prefix: 'car_04', y: 80, rot: [0, Math.PI, 0 ] },
      ]
      //
      root.updateMatrixWorld();
      let i = 0;
      for (const car of loadedCars.children.slice()) {
         const fix = fixes.find(f => car.name.toLowerCase().startsWith(f.prefix))
         // console.log(car, fix)
         const obj = new THREE.Object3D();
         car.getWorldPosition(obj.position); // <-- puts the world pos into the obj
         car.position.set(0, fix.y, 0); // <-- put the car to nothing. we will put inside the obj :]
         car.rotation.set(...fix.rot);
         obj.add(car) // see!
         c3.scene.add(obj) // wow
         // car.scale.x = 0.01
         // car.scale.y = 0.01
         // car.scale.z = 0.01
         // console.log(fix)
         this.cars.push(obj);
      }

      c3.scene.traverse((obj) => {
         if (obj.castShadow !== undefined) {
            obj.castShadow = true
            obj.receiveShadow = true
         }
      })
      //
      console.log(this.cars.length);
   })


   // create pathing
  const controlPoints = [
    [1.118281, 5.115846, -3.681386],
    [3.948875, 5.115846, -3.641834],
    [3.960072, 5.115846, -0.240352],
    [3.985447, 5.115846, 4.585005],
    [-3.793631, 5.115846, 4.585006],
    [-3.826839, 5.115846, -14.736200],
    [-14.542292, 5.115846, -14.765865],
    [-14.520929, 5.115846, -3.627002],
    [-5.452815, 5.115846, -3.634418],
    [-5.467251, 5.115846, 4.549161],
    [-13.266233, 5.115846, 4.567083],
    [-13.250067, 5.115846, -13.499271],
    [4.081842, 5.115846, -13.435463],
    [4.125436, 5.115846, -5.334928],
    [-14.521364, 5.115846, -5.239871],
    [-14.510466, 5.115846, 5.486727],
    [5.745666, 5.115846, 5.510492],
    [5.787942, 5.115846, -14.728308],
    [-5.423720, 5.115846, -14.761919],
    [-5.373599, 5.115846, -3.704133],
    [1.004861, 5.115846, -3.641834],
  ];
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  this.curve = new THREE.CatmullRomCurve3(
    controlPoints.map((p, ndx) => {
      p0.set(...p);
      p1.set(...controlPoints[(ndx + 1) % controlPoints.length]);
      return [
        (new THREE.Vector3()).copy(p0),
        (new THREE.Vector3()).lerpVectors(p0, p1, 0.1),
        (new THREE.Vector3()).lerpVectors(p0, p1, 0.9),
      ];
    }).flat(),
    true,
  );
  console.log('hello', this.curve)

   const points = this.curve.getPoints(250);
   const geometry = new THREE.BufferGeometry().setFromPoints(points);
   const material = new THREE.LineBasicMaterial({color: 'transparent'});
   this.curveObject = new THREE.Line(geometry, material);
   this.curveObject.position.y -= 650
   this.curveObject.scale.set(100, 100, 100)
   material.depthTest = false;
   // this.curveObject.renderOrder = 1;
   c3.scene.add(this.curveObject);
}

const render = function(c3, time) {
   const timeInSeconds = time / 1000

   if (this.cars) {
      const carTarget = new THREE.Vector3()
      const carPosition = new THREE.Vector3()

      this.cars.forEach((car, i) => {
         const carTime = timeInSeconds + (i * 4)
         const pathTime = (carTime * 0.01) % 1
         this.curve.getPointAt(pathTime, carPosition)
         this.curve.getPointAt(pathTime + 0.01, carTarget)

         carPosition.applyMatrix4(this.curveObject.matrixWorld)
         carTarget.applyMatrix4(this.curveObject.matrixWorld)

         car.position.set(carPosition.x, carPosition.y, carPosition.z)
         car.lookAt(carTarget)
      })
   }
}


const c3 = new C3({ init, render })
c3.init()

window.c3 = c3
