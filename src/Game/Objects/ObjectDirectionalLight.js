class ObjectDirectionalLight extends c3.Object {
   mesh() {
      const dirLight = new THREE.DirectionalLight('#FFF', 1)
      dirLight.castShadow = true
      dirLight.position.set(60, 60, 0)
      // dirLight.shadow.bias = -0.0000
      dirLight.shadow.mapSize.width = 3840
      dirLight.shadow.mapSize.height = 3840
      dirLight.shadow.camera.right = 120;
      dirLight.shadow.camera.left = -120;
      dirLight.shadow.camera.top = 80;
      dirLight.shadow.camera.bottom = -80;
      dirLight.shadow.camera.far = 170;
      
      // const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
      // dirLight.add(dirLightCameraHelper)
      
      return dirLight
   }
   
   create() {
      
   }
}

c3.objectTypes.DirectionalLight = ObjectDirectionalLight
