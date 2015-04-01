/****************************************************************************
 Copyright (c) 2015 Jkl-zt.
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
/**
 * Created by Jkl-zt on 2015/4/1.
 *
 */

(function(define) {
    'use strict';

    define(function(require) {

        function $() {
            console.log("Core");
        };

        //default option
        $.opt = {
            logStrRegexp: /\b\w{40}\b/img,
            versionLength: 12
        };

        //Error handler
        $.Error = function(err) {
            console.log("\r\n", chalk.red.bold("Error : "), err, "\r\n");
        }

        //fire : change current context 
        $.fire = function(scope, method) {
            if (arguments.length > 2) {
                return $.fireArgs.apply(this, arguments);
            }
            if (!method) {
                method = scope;
                scope = null;
            }
            if ($.utils.is(method, 'String')) {
                scope = scope || window;
                if (!scope[method]) {
                    throw new Error('');
                }
                return function() {
                    return scope[method].apply(scope, arguments || []);
                };
            }
            return !scope ? method : function() {
                return method.apply(scope, arguments || []);
            };
        };
        $.fireArgs = function(scope, method) {
            var pre = Array.prototype.slice.call(arguments, 2);
            var named = $.utils.is(method, 'String');
            return function() {
                var args = Array.prototype.slice.call(arguments);
                var f = named ? (scope || win)[method] : method;
                return f && f.apply(scope || this, pre.concat(args)); // mixed
            };
        };

        
        return $;

    });

})(typeof define === 'function' && define.amd ? define : function(factory) {
    module.exports = factory(require);
});