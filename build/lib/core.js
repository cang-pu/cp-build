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
        var utils = require('./utils');
        var chalk = require('chalk');
        var path = require('path');
        function $() {};
        $.utils=utils;
        $.version = 'none version';
        //default option
        $.opt = {
            debug:false,
            test:path.resolve('./','test/'),
            src: path.resolve('../project','src'),
            bin: path.resolve('../project','bin'),
            logStrRegexp: /\b\w{40}\b/img,
            versionLength: 40
        };

        //Error handler
        $.Error = function(err) {
            console.log("\r\n", chalk.red.bold("Error : "), err, "\r\n");
        }

        //fire : change current context 
        $.fire = utils.fire;
        $.fireArgs = utils.fireArgs;

        $.init = function() {
            //merge option
            var opt = utils.readJSON($.configPath);
            (!opt) && (opt = utils.readJSON(path.join(__dirname, "./../conf.js")));
            utils.merge($.opt, opt);

            //is debug
            $.debug = $.opt.debug;

            //debug output
            $.debug && (console.log(chalk.green.bold("\n调试模式开启\n")));
            $.debug && (console.log(chalk.green.bold("配置信息：")));
            $.debug && (console.log($.opt));
            $.debug && (console.log(""));
        };
        return $;

    });

})(typeof define === 'function' && define.amd ? define : function(factory) {
    module.exports = factory(require);
});