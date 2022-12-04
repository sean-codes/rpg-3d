// init
const scene = new THREE.Scene()
// scene.background = new THREE.Color("rgb(255, 0, 0)") 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

camera.position.z = 25



class System {
   constructor(settings) {
      this.settings = { ...settings }
      this.particles = []

      this.material = new THREE.ShaderMaterial({
         vertexShader: pointVertexShader(),
         fragmentShader: pointFragmentShader(),
         //    vertexColors: true,
         transparent: true,
         depthTest: false,
         uniforms: {
            shape: { value: settings.shape === 'circle' ? 1 : 0 },
            pointTexture: { value: CircleTexture(100) },
         }
      })

      this.geometry = new THREE.BufferGeometry()
      this.object = new THREE.Points(this.geometry, this.material)
   }

   step() {
      for (var i = 0; i < this.settings.count; i++) {
         this.generate()
      }
      
      this.updateGeometry()

      var particles = []
      for (var particle of this.particles) {
         if (particle.life) {
            particles.push(particle)
         }
         particle.step()
      }

      this.particles = particles
   }

   updateGeometry() {
      let arrPoints = [] // sorry gc...
      let arrColors = [] // >:(
      let arrSizes = []
      for (var particle of this.particles) {
         arrPoints.push(...particle.position.toArray()) // new Array(x)?
         arrColors.push(...particle.color)
         arrSizes.push(particle.size)
      }

      const positions = new THREE.Float32BufferAttribute(arrPoints, 3)
      const colors = new THREE.Float32BufferAttribute(arrColors, 4)
      const sizes = new THREE.Float32BufferAttribute(arrSizes, 1)
      this.geometry.setAttribute('position', positions)
      this.geometry.setAttribute('color', colors)
      this.geometry.setAttribute('size', sizes)
   }

   generate() {
      const particle = new Particle(this.settings)
      this.particles.push(particle)
   }
}

class Particle {
   constructor(settings) {
      this.userStep = settings.step
      this.userCreate = settings.create

      const setup = this.userCreate(this)
      this.position = setup.position
      this.size = setup.size
      this.color = setup.color
      this.life = setup.life
   }

   step() {
      this.life -= 1
      const update = this.userStep(this)

      this.position = update.position
      this.size = update.size
      this.color = update.color
   }
}


// Example 1
// function ParticleCreate(part) {
//    var life = 60
//    var color = [1, 0, 0, 1]
   
//    var directionX = randomRange(-1, 1)
//    var directionY = randomRange(-1, 1)
//    var directionZ = randomRange(-1, 1)
//    var direction = new THREE.Vector3(directionX, directionY, directionZ).normalize()
   
//    part.direction = direction
//    part.accel = part.direction.clone().multiplyScalar(0.1)
//    var position = direction.clone().multiplyScalar(5)

//    var size = randomRange(1, 5)

//    var colorOptions = ['#F22', 'skyblue']
//    var color = new THREE.Color(colorOptions[Math.floor(Math.random()*colorOptions.length)])


//    return {
//       position, // Vec3
//       life: life, // == 0 = destroy
//       size: size, // scale
//       color: [color.r, color.g, color.b, 1], // [r, g, b, a]
//    }
// }

// function ParticleStep(part) {
//    part.color[3] -= 0.01
   
//    part.position.add(part.accel)
   
//    return {
//       position: part.position,
//       size: part.size,
//       color: part.color,
//    }
// }

// Example 2
function ParticleCreate(part) {
   var life = 60
   var color = [1, 0, 0, 1]
   
   var directionX = randomRange(-1, 1)
   var directionY = randomRange(0, 0)
   var directionZ = randomRange(-1, 1)
   var direction = new THREE.Vector3(directionX, directionY, directionZ).normalize()

   
   part.direction = direction
   part.vel = new THREE.Vector3(0, 1, 0).multiplyScalar(0.1)
   var position = direction.clone().multiplyScalar(5)

   var size = randomRange(3, 3)

   var colorOptions = ['#F22', 'skyblue']
   var color = new THREE.Color(colorOptions[Math.floor(Math.random()*colorOptions.length)])


   return {
      position, // Vec3
      life: life, // == 0 = destroy
      size: size, // scale
      color: [color.r, color.g, color.b, 1], // [r, g, b, a]
   }
}

function ParticleStep(part) {
   part.color[3] -= 0.01
   
   part.position.add(part.vel)
   part.size -= 0.05
   return {
      position: part.position,
      size: part.size,
      color: part.color,
   }
}


// settings 

var settings = {
   shape: "circle",
   count: 2,
   create: ParticleCreate,
   step: ParticleStep,
}

var eleTextarea = document.querySelector('textarea')
eleTextarea.innerHTML = settings.create.toString() + '\r\n\r\n' + settings.step.toString()
var eleData = document.querySelector('.data')

let particleSystem = new System(settings)
scene.add(particleSystem.object)


eleTextarea.oninput = function() {
   try {
      eval(eleTextarea.value)
      console.log(ParticleCreate.toString())

      scene.remove(particleSystem.object)
      particleSystem = new System({
         shape: "circle",
         count: 1,
         create: ParticleCreate,
         step: ParticleStep,
      }
      )
      scene.add(particleSystem.object)


   } catch(e) {
      console.error(e)
   }
   
}

var fpsLast = Date.now()
var frames = 0
var fps = 0

// render
function render() {
   particleSystem.step()
   requestAnimationFrame(render)
   renderer.render(scene, camera)

   if (Date.now() - fpsLast > 1000) {
      fpsLast = Date.now()
      fps = frames
      frames = 0
   }

   frames ++
   eleData.innerHTML = `particles: ${particleSystem.particles.length} <br> fps: ${fps}`
}
render()


// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth / window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()

// Utils

// create a circle pixel
function CircleTexture(res) {
   var canvas = document.createElement('canvas')
   var ctx = canvas.getContext('2d')
   canvas.width = res // resolution
   canvas.height = res
   ctx.imageSmoothingEnabled = false
   ctx.fillStyle = '#FFF' // give it 100% of the color space. remove it later
   ctx.beginPath()
   ctx.arc(canvas.width/2, canvas.height/2, canvas.height/2, 0, 2 * Math.PI)
   ctx.fill()

   const texture = new THREE.CanvasTexture(canvas)
   texture.minFilter = THREE.NearestFilter
   texture.magFilter = THREE.NearestFilter
   return texture
}

function randomRange(min, max) {
   return min + Math.random() * (max - min)
}

function degreeToRadian(degree) {
   return degree * (Math.PI/180)
}

function degreeCos(degree) {
   return Math.cos(degreeToRadian(degree))
}

function degreeSin(degree) {
   return Math.sin(degreeToRadian(degree))
}


function pointVertexShader() {
   return `
       attribute float size;
       attribute vec4 color;
       varying vec4 vColor;
       void main() {
           vColor = color;
           vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
           gl_PointSize = size * ( 250.0 / -mvPosition.z );
           gl_Position = projectionMatrix * mvPosition;
       }
   `
}

function pointFragmentShader() {
   return `
      varying vec4 vColor;
      uniform sampler2D pointTexture;
      uniform int shape;

      void main() {
         gl_FragColor = vec4( vColor );
         if (shape == 1) {
            gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
         }
      }
   `
}