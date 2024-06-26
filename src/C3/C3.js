class C3 {
   constructor({ 
      node_modules = "./node_modules",
      path = "./C3",
      scripts = [], 
      objects = {},
      models = [],
      keyMap = {},
      init = () => { console.log('C3: No init function defined') },
   }) {
      this.keyMap = keyMap
      this.userInit = init
      this.global = {}
      this.scripts = {}
      this.objectTypes = objects
      
      this.listDependancies = [
         { src: `${node_modules}/three/build/three.min.js` },
         { src: `${node_modules}/cannon/build/cannon.js` },
      ]
      
      this.listScripts = [
         // External
         { src: `${node_modules}/three/examples/js/loaders/FBXLoader.js` },
         { src: `${node_modules}/three/examples/js/utils/SkeletonUtils.js` },
         { src: `${node_modules}/zlibjs/bin/inflate.min.js` },
         // Core
         { src: `${path}/C3_Camera.js` },
         { src: `${path}/C3_Keyboard.js` },
         { src: `${path}/C3_Math.js` },
         { src: `${path}/C3_Models.js` },
         { src: `${path}/C3_Model.js` },
         { src: `${path}/C3_Objects.js` },
         { src: `${path}/C3_Object.js` },
         { src: `${path}/C3_Physics.js` },
         { src: `${path}/C3_Scene.js` },
         { src: `${path}/C3_Vector.js` },
         // User
         ...scripts
      ]
      
      this.listModels = [...models]
      
      this.loading = this.listDependancies.length 
         + this.listScripts.length
         + this.listModels.length
      
      this.loadDependancies()
         .then(() => this.loadScripts())
         .then(() => this.loadModels())
         .then(() => this.init())
   }
   
   default(a, b) {
      if (a === null) return b
      return a
   }
   
   clone(object) {
      return JSON.parse(JSON.stringify(object))
   }
   
   init() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.renderer.domElement.tabIndex = 1
      document.body.appendChild(this.renderer.domElement);
      
      this.clock = new THREE.Clock()
      this.scene.add(c3.camera.object)
      
      window.onresize = () => this.handleResize();
      this.handleResize();
      
      this.userInit()
      this.render()
   }
   
   render(time) {
      const delta = this.clock.getDelta()
      window.requestAnimationFrame((time) => this.render(time))
      this.renderer.render(this.scene.scene, c3.camera.object)
      
      c3.physics.loopApplyCollisions()
      
      for (const object of this.objects.list) {
         object.step()
      }
      
      c3.physics.loop(delta)
      c3.models.loop(delta)
      c3.keyboard.resetKeys()
   }

   
   loadDependancies() {
      return new Promise((yay, nay) => {   
         let loading = this.listDependancies.length
         
         for (const dep of this.listDependancies) {
            const eleScript = document.createElement('script')
            eleScript.src = dep.src
            document.body.appendChild(eleScript)
            eleScript.addEventListener('load', () => {
               loading -= 1
               if (!loading) yay()
            })
         }
      })
   }
   
   loadScripts() {
      return new Promise((yay, nay) => {   
         let loading = this.listScripts.length
         if (!loading) yay()
         else {
            for (const script of this.listScripts) {
               const eleScript = document.createElement('script')
               eleScript.src = script.src
               eleScript.addEventListener('load', () => {
                  loading -= 1
                  if (!loading) yay()
               })
               document.body.appendChild(eleScript)
            }
         }
      })
   }
   
   loadModels() {
      const loader = new THREE.FBXLoader()
      
      return new Promise((yay, nay) => {   
         let loading = this.listModels.length
         for (const loadInfo of this.listModels) {
            // const model = models[modelName]
            loader.load(loadInfo.file, (object) => {
               c3.models.add({ loadInfo, object })
               if (loadInfo.log) console.log('Loaded Model', loadInfo.name, object)
               
               loading -= 1
               if (!loading) yay()
            }, null, (e) => { throw e })
         }
      })
   }
   
   handleResize() {
      const pixelRatio = 1 //window.devicePixelRatio

      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio
      this.renderer.domElement.width = width
      this.renderer.domElement.height = height
      this.renderer.setSize(width, height, false)
      c3.camera.setAspect(width/height)
   }
}
