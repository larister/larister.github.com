/**
 * RequireJS JSONP file loader
 */
(function () {
    'use strict';

    define({
        version: '0.1.0',

        load: function (name, req, onLoad, config) {
            if(config.isBuild){
                return onLoad();
            }

            var id = _.uniqueId('jsonpScriptLoadFunc'),
                url = req.toUrl(name + '&callback=' + id);

            window[id] = function(){

                //IE8 borks when we try to delete
                //the window property, so clear it out instead
                // http://stackoverflow.com/questions/1073414/deleting-a-window-property-in-ie
                window[id] = undefined;
                try {
                    delete window[id];
                }
                catch(e) {
                }

                onLoad();
            };

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            document.body.appendChild(script);
        }
    });
}());