# Animations and blending
![Animation Blending](./images/animation-blending.gif)

Animations using threejs require a couple components to work.

- `AnimationMixer` - Holds all the animations. Lets us run and mix animations together
- `AnimationAction` - Get the animation clip out of a model. Should be created calling `AnimationMixer.clipAction`

> Pretty simple a mixer holds our discs and we can play one or more together!

## Where are animations in an object?
When you load an object we can see the animations within the loaded object under `.animations`

```js
const fbxLoader = new THREE.FBXLoader()
fbxLoader.load('./assets/models/knight/KnightCharacter.fbx', (object) => {

   console.log(object.animations)

   scene.add(object)
});
```

## Setting up a mixer
Create a mixer and add it to the render function

```js
// object is the object to apply the animations to
const mixer = new THREE.AnimationMixer(object)

// call mixer.update with a deltaTime. Create a clock!
const clock = new THREE.Clock()
function render() {
   mixer.update(clock.getDelta())
}
```


## Run an animation
To play an animation we need to create an action, enable it, and play!
```js
// within loader function!
const action = mixer.clipAction(object.animations[0])
action.enabled = true
action.play()
```

## Fade animations
Fading animations is not to difficult. For this we will need more than one animation. Lets load up a couple:

```js
const actions = {
   idle: mixer.clipAction(object.animations[4]),
   walk: mixer.clipAction(object.animations[8]),
}

for (const actionName in actions) {
   const action = this.actions[actionName]
   action.enabled = true
   action.setEffectiveWeight(0)
   action.play()
}

let currentActionName = 'idle'
actions.idle.setEffectiveWeight(1) // always use .setEffectiveWeight never .weight = x!
```

To switch between an action we need a in and out animation. Then we set the weight to 1, and run crossDafeTo!

> NOTE: crossDafeTo seems to set enabled to false on the action. Don't forget to set enabled back to true on the action we are switching to!

```js
const outAction = actions.idle // the old action
const inAction = actions.walk // the new action

inAction.enabled = true
inAction.setEffectiveWeight(1)
outAction.crossFadeTo(inAction, 1, true)
```

Lets create a button for each animation using dat.GUI
```js
for (const actionName in this.actions) {
   ...
   datGui.add({ btn: () => {
      // change animation
      if (actionName === currentActionName) return

      const outAction = actions[this.currentActionName]
      const inAction = actions[actionName]

      inAction.enabled = true
      inAction.setEffectiveWeight(1)
      outAction.crossFadeTo(inAction, 1, true)
      currentActionName = actionName
   }}, 'btn').name(`play: ${actionName}`)
}
```


#### Connecting two animations seamlessly

We can set and event on the mixer waiting for loop to then change the animation

```js
const onLoopFinished = () => {
   this.mixer.removeEventListener('loop', onLoopFinished)
   const outAnimation = this.animations[this.currentAnimation]
   const inAnimation = this.animations[animationName]

   inAnimation.time = 0 // start the new animation at the beginning
   inAnimation.enabled = true
   inAnimation.setEffectiveWeight(1)
   inAnimation.crossFadeFrom(outAnimation, 0.5, true)
   this.currentAnimation = animationName
}
this.mixer.addEventListener('loop', onLoopFinished)
```
