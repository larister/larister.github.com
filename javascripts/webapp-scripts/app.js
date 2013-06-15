// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,
requirejs.config({
    "baseUrl": "javascripts/webapp-scripts",
    "urlArgs": new Date().getTime(),
    "paths": {
        "app": "app",
        "mustache": "libs/requirejs/mustache"
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);