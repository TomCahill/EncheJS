# Enchè JS
A loose clone of Project Enchè using Javascript.

Directory structure:
```
/
--> app_client/ - Game client files (src/build)
--> app_server/ - Game server files (src/build) [Not used]
--> game-assets-src/ - Editable game asset files
--> nginx/ - Nginx config files
```

Use your static server of choice (e.g. Express / Nginx).
Build process requires NodeJS & NPM (client & server are separate):
```
npm install
gulp build
```



