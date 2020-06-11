class C3_Math {
   randomRange(min, max) {
      const range = max-min
      return Math.random()*range + min
   }
   
   iRandomRange(min, max) {
      return Math.round(this.randomRange(min, max))
   }
   
   iRandom(num) {
      return Math.round(Math.random() * num)
   }
   
   randomPointFromPoint(point, radius) {
      const angle = Math.PI*2 * Math.random()
      return c3.vector.create(
         point.x + Math.cos(angle) * radius,
         point.y,
         point.z + Math.sin(angle) * radius
      )
   }
   
   choose(array) {
      return array[this.iRandomRange(0, array.length - 1)]
   }
   
   angleToAngle(a1, a2) {
      let right = a2 - a1
      if (right < 0) {
         right = Math.PI*2 + right
      }

      let left = a1 - a2
      if (left < 0) {
         left = Math.PI*2 + left
      }

      return right > left ? -left : right
   }

   loopAngle(a) {
      let modAngle = a % (Math.PI*2)
      if (modAngle < 0) {
         modAngle = Math.PI*2 + modAngle
      }

      if (modAngle > Math.PI*2) {
         modAngle = -Math.PI*2 + modAngle
      }

      return modAngle
   }
}

c3.math = new C3_Math
