
// Cats, Code, and Coffee
class C3 {
   constructor({ init, render }) {
      this.renderer = new THREE.WebGLRenderer();
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#666')
      // this.datGui = new dat.GUI();

      this.userObject = {};
      this.userInitFunction = init.bind(this.userObject);
      this.userRenderFunction = render.bind(this.userObject);
   }

   async init() {
      document.body.appendChild(this.renderer.domElement);
      window.onresize = this.handleResize;
      this.handleResize();

      await this.userInitFunction(this);
      window.requestAnimationFrame((time) => this.render(time));
   }

   handleResize() {
      const pixelRatio = window.devicePixelRatio
      const width = window.innerWidth * pixelRatio
      const height = window.innerHeight * pixelRatio
      this.renderer.domElement.width = width;
      this.renderer.domElement.height = height;
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width/height;
      this.camera.updateProjectionMatrix();
   }

   render(time) {
      // console.log(time)
      const timeInSeconds = time / 1000
      window.requestAnimationFrame((time) => this.render(time));
      this.renderer.render(this.scene, this.camera);

      this.userRenderFunction(this);
   }
}
