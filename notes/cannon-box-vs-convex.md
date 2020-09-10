# Notes on performance with using ConvexPolyhedron in cannon-js

Garage comparison of a box made with Cannon.Box and Cannon.ConvexPolyhedron

> tldr: ConvexPolyhedron performs much slower than box. About 10x slower. Except ff the meshes have no mass then they perform similar if there isn't a bunch going on

# Box count to maintain 60fps
This included drawing the scene using cannon debug renderer. These tests are not super accurate

~ 60 box using ConvexPolyhedron
![cannon box and convex example](./images/cannon-box-vs-convex-convex.gif)
~ 400-50 using box
![cannon box and convex example](./images/cannon-box-vs-convex-box.gif)

# A body with no mass is not affected by performance as much
When setting the bodies to have no mass the performance is about the same. I'm assuming this is because the AABB works similar between the two bodies. Once passing AABB test the next tests for Convex will take more CPU (initially you can see frames are lower)
![cannon box and convex example](./images/cannon-box-vs-convex-convex-no-mass-with-boxes.gif)
