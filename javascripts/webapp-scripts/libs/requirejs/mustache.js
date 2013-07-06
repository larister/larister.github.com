/**
 * RequireJS mustache plugin
 *
 * Steve Mason Brandwatch 2011
 *
 * usage:
 *  require(['ModuleA', 'mustache!myTemplate'], function (ModuleA, myTemplate) {
 *      var a = new ModuleA();
 *    var html = myTemplate({foo: 'bar'});
 *
 *      $(a.el).html(html);
 *  });
 *
 * The module will also automatically use innerShiv to "fix" HTML5 elements in IE
 *
 *
 * Configuration:
 *  var require = {
 *    ... curl configuration ...
 *    mustache: {
 *      rootUrl: '/js/templates'
 *      templateExtension: 'bar'  // Default = 'template'
 *    }
 *  };
 */
(function (window) {
    'use strict';
    /*
     * Actual plugin code
    **/
    var templateCache = {},
        rendererCache = {},
        parseHtml;

    function makeParseHtml(){
        // html5Shiv fixes setting .html() on HTML5 elements
        // And should only be included on the page if we're IE8 or below
        if(window.html5){ //This is included in Modernizr
            return function(html){
                if(!html){
                    return $();
                }
                var el = window.html5.createElement('div');
                el.innerHTML = html;
                return $(el).children();
            };
        }
        return function(html){
            return $(html);
        };
    }
    parseHtml = makeParseHtml();

    define(['libs/requirejs/text', 'libs/mustache'], function(text, mustache){
        return {
            templateCache: templateCache,
            rendererCache: rendererCache,
            makeParseHtml: makeParseHtml,
            'load': function (resourceId, require, callback, config) {
                var split = resourceId.split('!'),
                    name = split[0],
                    rootUrl = (config.rootUrl || (config.baseUrl + '/templates/')).replace(/\/\//g, '/'),
                    ext = config.templateExtension || '.template',
                    fullName = rootUrl + name + ext + '?v='+config.urlArgs;

                if(!config.isBuild && rendererCache[name]){
                    callback(rendererCache[name]);
                    return;
                } else {
                    // The text plugin knows how to load files in node, rhino, and the browser, so let it do the hard work
                    text.get(fullName, function(template){
                        if(!rendererCache[name]){
                            templateCache[name] = template;

                            rendererCache[name] = function(data, partials, wrapInjQuery){
                                var html;

                                if(_.isBoolean(partials) && wrapInjQuery === undefined){
                                    wrapInjQuery = partials;
                                    partials = undefined;
                                }

                                html = mustache.to_html(templateCache[name], data, partials);

                                if(wrapInjQuery === false){
                                    return html;
                                }

                                return parseHtml(html);
                            };
                        }
                        callback(rendererCache[name]);
                    });
                }
            },
            pluginBuilder: 'mustacheBuilder'
        };
    });

}(typeof window !== 'undefined' ? window : {}));
