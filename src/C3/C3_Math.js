class C3_Math {
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
