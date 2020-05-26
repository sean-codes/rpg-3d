# Animations additive blending
![Additive animation blending](./images/animation-walking-and-shaking-head.gif)

To make a clip additive you have to convert it before using `clipAction`

```js
THREE.AnimationUtils.makeClipAdditive(object.animations[2])
const shakingHeadAnimation = this.mixer.clipAction(object.animations[2])
```

Now when we play and set its weight we it does not completely override the current playing animation
```js
shakingHeadAnimation.enabled = true
shakingHeadAnimation.setEffectiveWeight(1)
shakingHeadAnimation.play()
```
