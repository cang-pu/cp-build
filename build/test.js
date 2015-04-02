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
		var chalk=require('chalk');
		var log={
			info:function(string){
				console.log(chalk.green.bold(string));
			},
			warn:function(string){
				console.log(chalk.yellow.bold(string));
			},
			error:function(string){
				console.log(chalk.red.bold(string));
			}
		}
		//get version string
		var test = function() {

			var randomString=$.utils.randomString(40)

			log.info('\n随机字符串：');
			log.info('\t '+randomString);

			log.info('\n将随机字符串进行MD5输出：');
			log.info('\t'+$.utils.md5(randomString));

			log.info('\n将随机字符串进行Base64输出：');
			log.info('\t'+$.utils.base64(randomString));

			

		}
		return test;
	});
})(typeof define === 'function' && define.amd ? define : function(factory) {
	module.exports = factory(require);
});