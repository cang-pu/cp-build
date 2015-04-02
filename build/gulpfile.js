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
 * build-tools
 */

var gulp = require('gulp');

var $ = global.$ = require('./lib/core');

//自定义opt
$.configPath = require('path').join(__dirname, "./conf.js");

//初始化操作
$.init();


gulp.task('version', function() {
	//加载获取GIT版本字符串
	require('./lib/getGitVersion')();
});
gulp.task('clear', function() {
	$.utils.clear($.opt.bin);
});
gulp.task('src', function() {

});
gulp.task('test', require('./test'));

gulp.task("default", require('./lib/defaultInfo'));