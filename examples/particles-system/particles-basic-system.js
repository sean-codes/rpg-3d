// init
const scene = new THREE.Scene()
// scene.background = new THREE.Color("rgb(255, 0, 0)") 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

camera.position.z = 25


// create a circle pixel
function CircleTexture() {
   var canvas = document.createElement('canvas')
   var ctx = canvas.getContext('2d')
   canvas.width = 25 // resolution
   canvas.height = 25
   ctx.fillStyle = '#FFF' // give it 100% of the color space. remove it later
   ctx.beginPath()
   ctx.arc(canvas.width/2, canvas.height/2, canvas.height/2, 0, 2 * Math.PI)
   ctx.fill()

   return new THREE.CanvasTexture(canvas)
}




class System {
   constructor(settings) {
      this.settings = { ...settings }
      this.particles = []

      this.material = new THREE.PointsMaterial({
         size: 1,
         vertexColors: true,
         transparent: true,
         depthTest: false,
         map: settings.shape === "circle" ? CircleTexture() : null,
      })

      this.geometry = new THREE.BufferGeometry()
      this.object = new THREE.Points(this.geometry, this.material)
   }

   step() {
      // if (Math.random() > 0.5) {
      //    this.generate()
      // }
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
      for (var particle of this.particles) {
         arrPoints.push(...particle.position) // new Array(x)?
         arrColors.push(...particle.color)
      }

      const positions = new THREE.Float32BufferAttribute(arrPoints, 3)
      const colors = new THREE.Float32BufferAttribute(arrColors, 4)

      this.geometry.setAttribute('position', positions)
      this.geometry.setAttribute('color', colors)
   }

   generate() {
      const particle = new Particle(this.settings)
      this.particles.push(particle)
   }
}

class Particle {
   constructor(settings) {
      
      if (settings.pattern == 'halo') {
         var directionX = randomRange(settings.directionX.min, settings.directionX.max)
         var directionY = randomRange(settings.directionY.min, settings.directionY.max)
         var directionZ = randomRange(settings.directionZ.min, settings.directionZ.max)
         var direction = new THREE.Vector3(directionX, directionY, directionZ).normalize()
      }

      direction.multiplyScalar(settings.width)

      var speed = randomRange(settings.vel.min, settings.vel.max)


      this.position = [
         direction.x,
         direction.y,
         direction.z,
      ] // xyz

      this.life = settings.life
      this.color = [0, 1, Math.random(), 1] // rgba
      this.speed = [directionX*speed, directionY*speed, directionZ*speed]
   }

   step() {
      this.position[0] += this.speed[0]
      this.position[1] += this.speed[1]
      this.position[2] += this.speed[2]
      // this.color[3] = 0.5
      this.color[3] = Math.max(0, this.color[3]-0.01)

      this.life--
   }
}



// settings 
var settings = {
   "position": {
      "x": 0,
      "y": 0,
   },
   "shape": "circle",
   "pattern": "halo",
   "width": 5,
   "count": 10,
   "interval": 1,
   "gaussian": 1,
   "life": 120,
   "colors": [
      [
         "#fff",
         "#fff"
      ],
      [
         "#f22",
         "#fff"
      ]
   ],
   "vel": {
      "min": 0.1,
      "max": 0.25
   },
   "accel": 0,
   "friction": 0.99,
   "size": {
      "min": 1,
      "max": 4
   },
   "grow": 0,
   "wobble": {
      "time": 30,
      "amount": 0.25
   },
   "directionX": {
      "min": -1,
      "max": 1
   },
   "directionY": {
      "min": -1,
      "max": 1
   },
   "directionZ": {
      "min": -1,
      "max": 1
   },
   "alpha": 1,
   "fade": 0.02
}

var eleTextarea = document.querySelector('textarea')
eleTextarea.innerHTML = JSON.stringify(settings, null, 3)
var eleData = document.querySelector('.data')

let particleSystem = new System(settings)
scene.add(particleSystem.object)


eleTextarea.oninput = function() {
   try {
      var settings = JSON.parse(eleTextarea.value)
      console.log(settings)

      scene.remove(particleSystem.object)
      particleSystem = new System(settings)
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

// Math
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