// init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
const controls = new THREE.OrbitControls(camera, renderer.domElement)

camera.position.z = 5

// hold all the verticies in an array [x0, y0, z0, x1, y1, z1, xn, yn, zn]
const arrPoints = [] 
const arrColors = []
for (var i = 0; i < 10000; i++) {
   arrPoints.push(
      Math.random()*10-5,
      Math.random()*10-5,
      Math.random()*10-5,
   )
   
   arrColors.push(
      Math.random()>0.5? 1: 0.5,
      Math.random()>0.5? 1: 0.5,
      Math.random()>0.5? 1: 0.5,
   )
}



// material to set color or points
const material = new THREE.PointsMaterial( { size: 4, vertexColors: true, depthTest: false, sizeAttenuation: false } )
material.opacity = 0.5
// Can use either of these. THREE docs recommends .setAttribute
// geometry.attributes.position = positions
const geometry  = new THREE.BufferGeometry()

const positions = new THREE.Float32BufferAttribute(arrPoints, 3)
const colors = new THREE.Float32BufferAttribute(arrColors, 3 )
geometry.setAttribute('position', positions)
geometry.setAttribute('color', colors)

// Put the geometry and material together!
const points = new THREE.Points(geometry, material)
scene.add(points)

function moveParticles() {
   for (var i = 0; i < arrPoints.length/3; i++) {
      // verticies[i*3+0] += 0.01 // x
      arrPoints[i*3+1] += 0.01 // y
      // verticies[i*3+2] += 0.01 // z

      if (arrPoints[i*3+1] > 5) {
         arrPoints[i*3+1] = 0
      }
   }
   
   const positions = new THREE.Float32BufferAttribute(arrPoints, 3)
   geometry.setAttribute('position', positions)
}

// render
function render() {
   requestAnimationFrame(render)
   renderer.render(scene, camera)
   moveParticles()
}
render()


// resizing
function resize() {
   renderer.setSize(window.innerWidth, window.innerHeight)
   camera.aspect = window.innerWidth/ window.innerHeight
   camera.updateProjectionMatrix()
}
window.onresize = resize
resize()
