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

var $ = require('./lib/core');
$.utils=require('./lib/utils');

console.dir($.utils.readJSON('./conf.js'));
var gulp = require('gulp');
var when = require('when');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var option = {
	src: './src',
	dest: './bin'
}

var $ = $ || {};
$.version = 'none version';

//get version string
$.GetVersionString = function() {
	var deferred = when.defer();
	var log = spawn('gitt', ['log', '-1']); //$.Config.logStrCMD

	console.log('检测版本子进程启动中');

	log.stdout.on('data', function(data) {
		deferred.resolve(data.toString());
	});
	log.on('error', function() {
		var err = '\r\n\r\n' +
			chalk.red.bold('SBSBSB ----------------------- SBSBSB') + '\r\n' +
			chalk.red.bold('****** 请将Git加入系统环境变量 ******') + '\r\n' +
			chalk.red.bold('****** 如果没有安装Git，请安装 ******') + '\r\n' +
			chalk.red.bold('******                         ******') + '\r\n' +
			chalk.red.bold('****** 还有，确保本项目处于git ******') + '\r\n' +
			chalk.red.bold('****** 版本控制中              ******') + '\r\n' +
			chalk.red.bold('SBSBSB ----------------------- SBSBSB');
		deferred.reject(err);
	});
	log.on('close', function(code) {
		console.log('检测版本子进程已退出');
	});
	return deferred.promise;
};
$.GetVersion = function() {
	var successHandler = function(data) {
		$.version = data.match($.Config.logStrRegexp)[0];
		//记录版本号到 .version 文件中
		exec("echo " + $.version + " > .version");

		$.version = $.version.substring(0, $.Config.versionLength || 40);

		console.log(chalk.green.bgBlack.bold('\r\n当前版本号:', $.version, "\r\n"));

	};
	var errorHandler = function(err) {
		$.Error(err);
	}
	$.GetVersionString().then(successHandler, errorHandler);
}
gulp.task('version', function() {
	$.GetVersion();
});
gulp.task('clear', function() {
	$.utils.clearBin('bin');
});
gulp.task('src', function() {
	console.log($.utils.md5('jklzt'));
	$.Config = $.utils.merge($.Config, option);
	console.log($.Config, global);
});
gulp.task("default", function() {
	var desc = "";
	desc += chalk.blue.bgGreen.bold('请输入对应的命令执行任务：\r\n\r\n');
	desc += "\t" + chalk.red.bgBlack('gulp dev') + "\t" + chalk.green.underline.bgBlack('启动开发Build监听\r\n');
	desc += "\t" + chalk.red.bgBlack('gulp test') + "\t" + chalk.green.bgBlack.underline('启动测试Build监听\r\n');
	desc += "\t" + chalk.red.bgBlack('gulp release') + "\t" + chalk.green.bgBlack.underline('启动发行Build监听\r\n');
	desc += "\t" + chalk.green.bgBlack('gulp clear') + "\t" + chalk.green.bgBlack.underline('启动清理生成\r\n');
	console.log(desc);
});