class C3 {
   constructor({ 
      scripts = [], 
      objects = [], 
      models = [],
      keyMap = {},
      init = () => { console.log('C3: No init function defined') },
   }) {
      this.keyMap = keyMap
      this.userInit = init
      this.global = {}
      this.scripts = {}
      this.objectTypes = {}
      
      this.listDependancies = [
         { src: './node_modules/three/build/three.min.js' },
         { src: './node_modules/cannon/build/cannon.js' },
      ]
      
      this.listScripts = [
         // External
         { src: './node_modules/three/examples/js/loaders/FBXLoader.js' },
         { src: './node_modules/three/examples/js/utils/SkeletonUtils.js' },
         { src: './node_modules/zlibjs/bin/inflate.min.js' },
         // Core
         { src: './src/C3/C3_Camera.js' },
         { src: './src/C3/C3_GameObjects.js' },
         { src: './src/C3/C3_GameObject.js' },
         { src: './src/C3/C3_Keyboard.js' },
         { src: './src/C3/C3_Math.js' },
         { src: './src/C3/C3_Models.js' },
         { src: './src/C3/C3_Model.js' },
         { src: './src/C3/C3_Physics.js' },
         { src: './src/C3/C3_Scene.js' },
         { src: './src/C3/C3_Vector.js' },
         // User
         ...scripts
      ]
      
      this.listObjects = [...objects]
      this.listModels = [...models]
      
      this.loading = this.listDependancies.length 
         + this.listScripts.length 
         + this.listObjects.length
         + this.listModels.length
      
      this.loadDependancies()
         .then(() => this.loadScripts())
         .then(() => this.loadObjects())
         .then(() => this.loadModels())
         .then(() => this.init())
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
      
      this.scene = new THREE.Scene()
      this.clock = new THREE.Clock()
      
      this.scene.add(c3.camera.object )
      
      window.onresize = () => this.handleResize();
      this.handleResize();
      
      this.userInit()
      this.render()
   }
   
   render(time) {
      const delta = this.clock.getDelta()
      window.requestAnimationFrame((time) => this.render(time))
      this.renderer.render(this.scene, c3.camera.object)
      
      c3.physics.loopApplyCollisions()
      
      for (const object of this.gameObjects.list) {
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
         for (const script of this.listScripts) {
            const eleScript = document.createElement('script')
            eleScript.src = script.src
            eleScript.addEventListener('load', () => {
               loading -= 1
               if (!loading) yay()
            })
            document.body.appendChild(eleScript)
         }
      })
   }
   
   loadObjects() {
      return new Promise((yay, nay) => {   
         let loading = this.listObjects.length
         for (const object of this.listObjects) {
            const eleScript = document.createElement('script')
            eleScript.src = object.src
            eleScript.addEventListener('load', () => {
               loading -= 1
               if (!loading) yay()
            })
            document.body.appendChild(eleScript)
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
