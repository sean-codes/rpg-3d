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
         // Core
         { src: './src/C3/C3_GameObjects.js' },
         { src: './src/C3/C3_GameObject.js' },
         { src: './src/C3/C3_Keyboard.js' },
         { src: './src/C3/C3_Math.js' },
         { src: './src/C3/C3_Models.js' },
         { src: './src/C3/C3_Model.js' },
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
   
   init() {
      console.log('initializing c3')
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.shadowMap.enabled = true
      this.renderer.domElement.tabIndex = 1
      document.body.appendChild(this.renderer.domElement);
      
      this.scene = new THREE.Scene()
      this.clock = new THREE.Clock()
      
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.001, 1000)
      this.scene.add(this.camera)
      
      window.onresize = () => this.handleResize();
      this.handleResize();
      
      this.userInit()
      this.render()
   }
   
   render(time) {
      // console.log('meow')
      window.requestAnimationFrame((time) => this.render(time))
      this.renderer.render(this.scene, this.camera)
      
      for (const object of this.gameObjects.list) {
         object.step()
      }
      
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
      return new Promise((yay, nay) => {   
         let loading = this.listModels.length
         for (const model of this.listModels) {
            
         }
         
         yay()
      })
   }
   
   handleResize() {
      const pixelRatio = 1 //window.devicePixelRatio

      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio
      this.renderer.domElement.width = width
      this.renderer.domElement.height = height
      this.renderer.setSize(width, height, false)
      this.camera.aspect = width/height
      this.camera.updateProjectionMatrix()
      
      // for (const object of this.gameObjects.list) {
      //    object.handleResize(width, height)
      // }
   }
}
