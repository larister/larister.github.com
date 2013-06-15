/**
 * RequireJS JavaScript file loader
 *
 * RequireJS does this itself, if your dependency name ends in ".js", but I prefer the js! syntax ala curl.js, which can also be mixed with !order
 */
(function () {
    'use strict';

    define({
        version: '0.9.0',

        load: function (name, req, onLoad, config) {
            var url = name;

            if(!config.isBuild){
                url = req.toUrl(url);

                if(config.urlArgs){
                    url = url.replace('?' + config.urlArgs, '');    // Fix double-urlArgs after next require
                }

                require([url], function(){
                    onLoad();
                });
            }else{
                onLoad();
            }
        },
        pluginBuilder: 'jsBuilder'
    });
}());