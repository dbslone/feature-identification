# Feature Identification

## Getting Started
To install an run the app use the following commands

```
cd app
npm install
npm run start
```

## Features not implemented
- Hovering over an entity to show its bounding box
- Adding an icon in the pocket list that would lock the outline. Hover and rotate on the viewport would not deselect the outline. Allowing user to orbit camera and examine where the pocket is located

## Troubleshooting
- Show outline around hovered entity
    - Given limitation of time I attempted updated three.js version and related libraries.
      Without going further during quick inspection I was only able to obtain a horrible green
      wall around the geometry instead of an outline around the geometry. With more time I could solve this issue.
    - ![Screenshot 2025-10-04 at 12.52.08 AM.png](img/Screenshot%202025-10-04%20at%2012.52.08%E2%80%AFAM.png)
- Upgrading three.js version resulted in colors becoming muted this may be related to how the ambient occlusion is calculated or something from post-processing package. With a little more time and studying three.js sure I could resolve the issues