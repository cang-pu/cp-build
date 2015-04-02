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
		var $ = global.$;
		var when = require('when');
		var chalk = require('chalk');
		var spawn = require('child_process').spawn;
		var exec = require('child_process').exec;

		//get version string
		var getGitVersionString = function() {
			var deferred = when.defer();
			var log = spawn('git', ['log', '-1']); //$.Config.logStrCMD

			console.log('检测版本子进程启动中');

			log.stdout.on('data', function(data) {
				deferred.resolve(data.toString());
			});
			log.on('error', function(error) {
				$.debug && (console.log(error));
				var errInfo = '\r\n\r\n' +
					chalk.red.bold('SBSBSB ----------------------- SBSBSB') + '\r\n' +
					chalk.red.bold('****** 请将Git加入系统环境变量 ******') + '\r\n' +
					chalk.red.bold('****** 如果没有安装Git，请安装 ******') + '\r\n' +
					chalk.red.bold('******                         ******') + '\r\n' +
					chalk.red.bold('****** 还有，确保本项目处于git ******') + '\r\n' +
					chalk.red.bold('****** 版本控制中              ******') + '\r\n' +
					chalk.red.bold('SBSBSB ----------------------- SBSBSB');
				deferred.reject(errInfo);
			});
			log.on('close', function(code) {
				console.log('检测版本子进程已退出');
			});
			return deferred.promise;
		};

		var getGitVersion = function() {
			var successHandler = function(data) {
				$.version = data.match($.opt.logStrRegexp)[0];
				//记录版本号到 .version 文件中
				exec("echo " + $.version + " > ./../.version");

				$.version = $.version.substring(0, $.opt.versionLength || 40);

				console.log(chalk.green.bgBlack.bold('\r\n当前版本号:', $.version, "\r\n"));

			};
			var errorHandler = function(err) {
				$.Error(err);
			}
			getGitVersionString().then(successHandler, errorHandler);
		}

		return getGitVersion;
	});
})(typeof define === 'function' && define.amd ? define : function(factory) {
	module.exports = factory(require);
});