## Make sure you enable tab for pie menu
Edit -> Blender Preferences -> Under 3D View -> Check Tab for Pie Menu

# Hotkeys

## 3D View
Command                                      | Key
---------------------------------------------|--------------
tool menu left rail                          | t
item / tool / view right rail                | n
grab / move around                           | g
select tool menu                             | space
add menu                                     | shift-a

## 3D view edit
Command                                      | Key
---------------------------------------------|--------------
Change Select vert/edge/face                 | Num 1-3
⚠️ Change Drag select mode                   | w

## Pie Menus
Command                                      | Key
---------------------------------------------|--------------
select tool menu                             | space
3d cursor                                    | shift-s 
render mode (wireframe / solid / etc)        | z
transform origin                             | comma
pivot point                                  | period
mode                                         | tab / ctrl-tab
change view (front/back/side/top)            | tilde

# After mirroring geometry in blender you need to recalculate normals
![lighting issue after mirroring geometry](./images/blender-mirror-lighting-issue.gif)

In bender Select Mesh -> Edit Mode -> Mesh -> Normals -> Recalculate Outside
