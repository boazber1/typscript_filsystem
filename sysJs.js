SystemJS.config({
    packages: {
        "js" :{
            defaultExtension: "js"
        }
    },

    map: {
        "jquery": "node_modules/jquery/dist/jquery.js"
    },

    meta: {
        "jquery": "global"
    }
});

SystemJS.import('js/main');