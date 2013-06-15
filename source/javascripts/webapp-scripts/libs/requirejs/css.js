/**
 * Quick-and-dirty CSS plugin
 */
(function() {
    "use strict";
    // Heavily inspired by: http://javascript.nwbox.com/CSSReady/cssready.html
    function cssReady(link, fn) {
        var type = document.createStyleSheet,
            rules = type ? 'rules' : 'cssRules',
            sheet = type ? 'styleSheet' : 'sheet';

        function check() {
            try {
                return link && link[sheet] && link[sheet][rules] && link[sheet][rules][0];
            } catch (e) {
                return false;
            }
        }

        (function poll() {
            if(check()){
                return setTimeout(fn, 0);
            }
            setTimeout(poll, 50);
        })();
    }
    define({
        'load': function(resourceId, require, callback, config) {
            var path = resourceId,
                link = document.createElement("link");

            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = require.toUrl((config.baseUrl + '/' + path).replace(/\/+/g, '/'));

            if (config.isBuild) {
                return callback();
            }

            cssReady(link, function() {
                callback();
            });

            document.getElementsByTagName("head")[0].appendChild(link);
        },
        pluginBuilder: 'cssBuilder'
    });

})();
