# Feature Identification

## Getting Started
To install an run the app use the following commands

```
cd app
npm install
npm run start
```

## Troubleshooting
- Show outline around hovered entity
    - Given limitation of time I attempted updated three.js version and related libraries.
Without going further during quick inspection I was only able to obtain a horrible green
wall around the geometry instead of an outline around the geometry. With more item I could solve this issue.
    - ![Screenshot 2025-10-04 at 12.52.08 AM.png](../img/Screenshot%202025-10-04%20at%2012.52.08%E2%80%AFAM.png)
- Upgrading three.js version resulted in colors becoming muted this may be related to enabling shadows.
  Expected this would only cast shadows in the pockets  since the abient light doesn't have a position.
  So I assumed this would be equal abient occlusion lighting which appears not be the case.
- 