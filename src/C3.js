import {
   WebGLRenderer,
   PerspectiveCamera,
   Scene
} from 'three';

import * as dat from 'dat.gui';

// Cats, Code, and Coffee
class C3 {
   constructor({ init, render }) {
      this.renderer = new WebGLRenderer();
      this.camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      this.scene = new Scene();
      this.datGui = new dat.GUI();

      this.userObject = {};
      this.userInitFunction = init.bind(this.userObject);
      this.userRenderFunction = render.bind(this.userObject);

      this.init();
      this.userInitFunction(this);
   }

   init() {
      document.body.appendChild(this.renderer.domElement);
      window.onresize = this.handleResize;
      this.handleResize();
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

export default C3;
