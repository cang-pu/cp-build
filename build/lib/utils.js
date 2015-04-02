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
		var fs = require('fs');
		var path = require('path');
		var crypto = require('crypto');
		var chalk = require('chalk');
		var _exists = fs.existsSync || path.existsSync;


		var TEXT_FILE_EXTS = [
				'css', 'tpl', 'js', 'php',
				'txt', 'json', 'xml', 'htm',
				'text', 'xhtml', 'html', 'md',
				'conf', 'po', 'config', 'tmpl',
				'coffee', 'less', 'sass', 'jsp',
				'scss', 'manifest', 'bak', 'asp',
				'tmp', 'haml', 'jade', 'aspx',
				'ashx', 'java', 'py', 'c', 'cpp',
				'h', 'cshtml', 'asax', 'master',
				'ascx', 'cs', 'ftl', 'vm', 'ejs',
				'styl', 'jsx', 'handlebars'
			],
			IMAGE_FILE_EXTS = [
				'svg', 'tif', 'tiff', 'wbmp',
				'png', 'bmp', 'fax', 'gif',
				'ico', 'jfif', 'jpe', 'jpeg',
				'jpg', 'woff', 'cur', 'webp',
				'swf', 'ttf', 'eot', 'woff2'
			],
			MIME_MAP = {
				//text
				'css': 'text/css',
				'tpl': 'text/html',
				'js': 'text/javascript',
				'jsx': 'text/javascript',
				'php': 'text/html',
				'asp': 'text/html',
				'jsp': 'text/jsp',
				'txt': 'text/plain',
				'json': 'application/json',
				'xml': 'text/xml',
				'htm': 'text/html',
				'text': 'text/plain',
				'md': 'text/plain',
				'xhtml': 'text/html',
				'html': 'text/html',
				'conf': 'text/plain',
				'po': 'text/plain',
				'config': 'text/plain',
				'coffee': 'text/javascript',
				'less': 'text/css',
				'sass': 'text/css',
				'scss': 'text/css',
				'styl': 'text/css',
				'manifest': 'text/cache-manifest',
				//image
				'svg': 'image/svg+xml',
				'tif': 'image/tiff',
				'tiff': 'image/tiff',
				'wbmp': 'image/vnd.wap.wbmp',
				'webp': 'image/webp',
				'png': 'image/png',
				'bmp': 'image/bmp',
				'fax': 'image/fax',
				'gif': 'image/gif',
				'ico': 'image/x-icon',
				'jfif': 'image/jpeg',
				'jpg': 'image/jpeg',
				'jpe': 'image/jpeg',
				'jpeg': 'image/jpeg',
				'eot': 'application/vnd.ms-fontobject',
				'woff': 'application/font-woff',
				'woff2': 'application/font-woff',
				'ttf': 'application/octet-stream',
				'cur': 'application/octet-stream'
			};

		var utils = function() {};

		var props = {
			//type
			is: function(source, type) {
				return toString.call(source) === '[object ' + type + ']';
			},

			//map
			map: function(obj, callback, merge) {
				var index = 0;
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if (merge) {
							callback[key] = obj[key];
						} else if (callback(key, obj[key], index++)) {
							break;
						}
					}
				}
			},

			//
			pad: function(str, len, fill, pre) {
				if (str.length < len) {
					fill = (new Array(len)).join(fill || ' ');
					if (pre) {
						str = (fill + str).substr(-len);
					} else {
						str = (str + fill).substring(0, len);
					}
				}
				return str;
			},

			//
			merge: function(source, target) {
				if (this.is(source, 'Object') && this.is(target, 'Object')) {
					this.map(target, this.fire(this, function(key, value) {
						source[key] = this.merge(source[key], value);
					}));
				} else {
					source = target;
				}
				return source;
			},

			//
			clone: function(source) {
				var ret;
				switch (toString.call(source)) {
					case '[object Object]':
						ret = {};
						this.map(source, function(k, v) {
							ret[k] = this.clone(v);
						});
						break;
					case '[object Array]':
						ret = [];
						source.forEach(function(ele) {
							ret.push(this.clone(ele));
						});
						break;
					default:
						ret = source;
				}
				return ret;
			},

			read: function(path, convert) {
				var content = false;
				if (_exists(path)) {
					content = fs.readFileSync(path);
					if (convert || this.isTextFile(path)) {
						content = this.readBuffer(content);
					}
				} else {
					console.log("file read error :", path);
				}
				return content;
			},

			readBuffer: function(buffer) {
				if (this.isUtf8(buffer)) {
					buffer = buffer.toString('utf8');
					if (buffer.charCodeAt(0) === 0xFEFF) {
						buffer = buffer.substring(1);
					}
				} else {
					buffer = this.getIconv().decode(buffer, 'gbk');
				}
				return buffer;
			},

			//
			readJSON: function(path) {
				var json = this.read(path),
					result = {};
				try {
					result = JSON.parse(json);
				} catch (e) {
					console.log('parse json file[' + path + '] fail, error [' + e.message + ']');
				}
				return result;
			},

			//
			isEmpty: function(obj) {
				if (obj === null) return true;
				if (this.is(obj, 'Array')) return obj.length == 0;
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						return false;
					}
				}
				return true
			},

			//
			md5: function(data, len) {
				var md5sum = crypto.createHash('md5'),
					encoding = typeof data === 'string' ? 'utf8' : 'binary';
				md5sum.update(data, encoding);
				//784a53ba6a627b20ccfcca4567eeb484
				len = len || 32;
				return md5sum.digest('hex').substring(0, len);
			},

			//
			base64: function(data) {
				if (data instanceof Buffer) {
					//do nothing for quickly determining.
				} else if (data instanceof Array) {
					data = new Buffer(data);
				} else {
					//convert to string.
					data = new Buffer(String(data || ''));
				}
				return data.toString('base64');
			},
			exists: _exists,
			isUtf8: function(bytes) {
				var i = 0;
				while (i < bytes.length) {
					if (( // ASCII
							0x00 <= bytes[i] && bytes[i] <= 0x7F
						)) {
						i += 1;
						continue;
					}

					if (( // non-overlong 2-byte
							(0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
							(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
						)) {
						i += 2;
						continue;
					}

					if (
						( // excluding overlongs
							bytes[i] == 0xE0 &&
							(0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
							(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
						) || ( // straight 3-byte
							((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
								bytes[i] == 0xEE ||
								bytes[i] == 0xEF) &&
							(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
							(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
						) || ( // excluding surrogates
							bytes[i] == 0xED &&
							(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
							(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
						)
					) {
						i += 3;
						continue;
					}

					if (
						( // planes 1-3
							bytes[i] == 0xF0 &&
							(0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
							(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
							(0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
						) || ( // planes 4-15
							(0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
							(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
							(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
							(0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
						) || ( // plane 16
							bytes[i] == 0xF4 &&
							(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
							(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
							(0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
						)
					) {
						i += 4;
						continue;
					}
					return false;
				}
				return true;
			},
			fire: function(scope, method) {
				if (arguments.length > 2) {
					return this.fireArgs.apply(this, arguments);
				}
				if (!method) {
					method = scope;
					scope = null;
				}
				if (this.is(method, 'String')) {
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
			},
			fireArgs: function(scope, method) {
				var pre = Array.prototype.slice.call(arguments, 2);
				var named = $.utils.is(method, 'String');
				return function() {
					var args = Array.prototype.slice.call(arguments);
					var f = named ? (scope || win)[method] : method;
					return f && f.apply(scope || this, pre.concat(args)); // mixed
				};
			},
			getIconv: function() {
				if (!iconv) {
					iconv = require('iconv-lite');
				}
				return iconv;
			},
			getMimeType: function(ext) {
				if (ext[0] === '.') {
					ext = ext.substring(1);
				}
				return MIME_MAP[ext] || 'application/x-' + ext;
			},
			getFileTypeReg: function(type) {
				var map = [];
				if (type === 'text') {
					map = TEXT_FILE_EXTS;
				} else if (type === 'image') {
					map = IMAGE_FILE_EXTS;
				} else {
					fis.log.error('invalid file type [' + type + ']');
				}
				map = map.join('|');
				return new RegExp('\\.(?:' + map + ')$', 'i');
			},

			toEncoding: function(str, encoding) {
				return this.getIconv().toEncoding(String(str), encoding);
			},

			isFile: function(path) {
				return _exists(path) && fs.statSync(path).isFile();
			},

			isDir: function(path) {
				return _exists(path) && fs.statSync(path).isDirectory();
			},
			isTextFile: function(path) {
				return this.getFileTypeReg('text').test(path || '');
			},
			isImageFile: function(path) {
				return this.getFileTypeReg('image').test(path || '');
			},

			mkdir: function(path, mode) {
				if (typeof mode === 'undefined') {
					//511 === 0777
					mode = 511 & (~process.umask());
				}
				if (_exists(path)) return;
				path.split('/').reduce(function(prev, next) {
					if (prev && !_exists(prev)) {
						fs.mkdirSync(prev, mode);
					}
					return prev + '/' + next;
				});
				if (!_exists(path)) {
					fs.mkdirSync(path, mode);
				}
			},

			clearBin: function(from) {
				var files = [];
				if (fs.existsSync(from)) {
					files = fs.readdirSync(from);
					files.forEach(function(file, index) {
						var curPath = from + "/" + file;
						if (fs.statSync(curPath).isDirectory()) { // recurse
							clearBin(curPath);
						} else { // delete file
							fs.unlinkSync(curPath);
						}
					});
					fs.rmdirSync(from);
				}
			}
		}

		props.map(props, utils, true);

		return utils;

	});

})(typeof define === 'function' && define.amd ? define : function(factory) {
	module.exports = factory(require);
});