# Adding a light
To make our shape not look so flat we will add a light!

Before we can add a light and make it work we will need to change out MeshBasicMaterial into one that can be affected by light. We can use `MeshPhongMaterial`, `MeshStandardMaterial`, or `MeshPhysicalMaterial`. For this we will use Phong since it seems to be the best for performance.

# Experiment
Change Basic Material for Phong
```js
const material = new THREE.MeshPhongMaterial({ color: "#465" });
```

Create a directional light
```js
const light = new THREE.DirectionalLight(0xffffff, 1);
```

Then move it a bit
```js
light.position.set(2, 0, 0);
```

And add it to the scene
```js
scene.add(light);
```

Complete code:
```js
// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 4);
scene.add(light);
```

## Light types
There a couple useful types of lights
- `AmbientLight` - Lights everything
- `HemisphereLight` - Lights everything top to bottom
- `DirectionalLight` - Points towards a target
- `PointLight` - Like a lightbulb

## Helpers
Those two lights can attach a helper

```js
// PointLightHelper
const lightHelper = new THREE.PointLightHelper(light, 1, '#F22');

// DirectionalLightHelper
const lightHelper = new THREE.DirectionalLightHelper(light, 1, '#F22');
```

## Directional Light Target
A Directional Light uses a target which is an object that can be added to the scene and moved around. You can also assign any object that has a `.position` property on it!
