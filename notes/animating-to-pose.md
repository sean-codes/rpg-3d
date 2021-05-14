# Animating to a pose
To animate to a pose we can use the `clip.fadeIn()` function with a time.


```
// start the first
clipAttackStart.reset().play()
clipAttackStart.weight = 1
clipAttackStart.fadeIn(0.25 * restTime)


clipAttackStart.onDone = () => {
   // set the old ones weight to 0
   clipAttackStart.weight = 0
   
   // start next
   clipAttack.reset().play()
   clipAttack.weight = 1
   
   clipAttack.onDone = () => {
      // set the old ones weight to 0
      clipAttack.weight = 0
      
      // start next
      clipRest.reset().play()
      clipRest.weight = 1
      
      clipRest.onDone = () => {
         // zero the old one
         clipRest.weight = 0
         clipRest.stop() // not sure why we stop here? explain below
      }
   }
}
```

### Stopping and starting pose/animation
Use .weight = 0 or .stop to stop the previous animation. If using stop first start the next animation then stop the previous on the next line

> using .stop is likely preferable because it will reset/pause the time to prevent any callbacks you hooked to the action being finished
```
// .stop()
nextAction.reset().play()
nextAction.weight = 1
previousAction.stop()

// .weight = 
previousAction.weight = 0
nextAction.reset().play()
nextAction.weight = 1
```


Calling a function when a pose has finished requires checking if it's weight has reached 1

```
// Check this after mixer.update!
if (clip.onDone && clip.getEffectiveWeight() === 1) {
   clipAttackStart.onDone()
   clipAttackStart.onDone = false // remove the function
} 
```
>> if you are changing weights / or clips in any way. Calling those calls backs in the middle of the mixer.update causes lots of weird glitches
