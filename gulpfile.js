var gulp = require('gulp');
var when = require('when');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var option = {
	src: './src',
	dest: './bin'
}

var $ = $ || {};
$.version = 'none version';
$.Error = function(err) {
	console.log("\r\n",chalk.red.bold("Error : "), err,"\r\n");
}
$.Config = {
	logStrRegexp: /\b\w{40}\b/img,
	versionLength: 12
};
$.utils = {
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
	merge: function(source, target) {
		if (this.is(source, 'Object') && this.is(target, 'Object')) {
			this.map(target, $.fire(this,function(key, value) {
				source[key] = this.merge(source[key], value);
			}));
		} else {
			source = target;
		}
		return source;
	},
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
	readJSON: function(path) {
		var json = _.read(path),
			result = {};
		try {
			result = JSON.parse(json);
		} catch (e) {
			fis.log.error('parse json file[' + path + '] fail, error [' + e.message + ']');
		}
		return result;
	},
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
	md5: function(data, len) {
		var md5sum = crypto.createHash('md5'),
			encoding = typeof data === 'string' ? 'utf8' : 'binary';
		md5sum.update(data, encoding);
		//784a53ba6a627b20ccfcca4567eeb484
		len = len || 32;
		return md5sum.digest('hex').substring(0, len);
	},
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
	}
};
$.fire = function(scope, method) {
	if (arguments.length > 2) {
		return $.fireArgs.apply(this, arguments);
	}
	if (!method) {
		method = scope;
		scope = null;
	}
	if ($.utils.is(method,'String')) {
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
	var named = $.utils.is(method,'String');
	return function() {
		var args = Array.prototype.slice.call(arguments);
		var f = named ? (scope || win)[method] : method;
		return f && f.apply(scope || this, pre.concat(args)); // mixed
	};
};
//清除生成的Bin文件夹
$.utils.clearBin = function(from) {
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

//get version string
$.GetVersionString = function() {
	var deferred = when.defer();
	var log = spawn('gitt', ['log', '-1']); //$.Config.logStrCMD

	console.log('检测版本子进程启动中');

	log.stdout.on('data', function(data) {
		deferred.resolve(data.toString());
	});
	log.on('error',function(){
		var err='\r\n\r\n'+
				chalk.red.bold('SBSBSB ----------------------- SBSBSB')+'\r\n'+
				chalk.red.bold('****** 请将Git加入系统环境变量 ******')+'\r\n'+
				chalk.red.bold('****** 如果没有安装Git，请安装 ******')+'\r\n'+
				chalk.red.bold('******                         ******')+'\r\n'+
				chalk.red.bold('****** 还有，确保本项目处于git ******')+'\r\n'+
				chalk.red.bold('****** 版本控制中              ******')+'\r\n'+
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
	console.log($.Config,global);
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