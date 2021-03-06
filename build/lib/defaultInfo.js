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

        var chalk = require('chalk');

        function info() {
            var desc = "";
            desc += chalk.yellow.bgBlack.bold('请输入对应的命令执行任务：\r\n\r\n');
            desc += "\t" + chalk.red.bgBlack('dev') + "\t" + chalk.green.underline.bgBlack('启动开发Build监听\r\n');
            desc += "\t" + chalk.red.bgBlack('test') + "\t" + chalk.green.bgBlack.underline('启动测试Build监听\r\n');
            desc += "\t" + chalk.red.bgBlack('release') + "\t" + chalk.green.bgBlack.underline('启动发行Build监听\r\n');
            desc += "\t" + chalk.red.bgBlack('clear') + "\t" + chalk.green.bgBlack.underline('启动清理生成\r\n');
            console.log(desc);
        }
        return info;

    });

})(typeof define === 'function' && define.amd ? define : function(factory) {
    module.exports = factory(require);
});