var tests = {
	'postcss-unroot': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:copy': {
			message: 'supports "copy" usage',
			options: {
				method: 'copy'
			}
		},
		'basic:warn': {
			message: 'supports "warn" usage',
			options: {
				method: 'warn'
			},
			warning: 1
		},
		'svg': {
			message: 'supports usage with <svg>'
		},
		'class': {
			message: 'supports usage with class'
		}
	}
};

var debug = true;
var dir   = './test/fixtures/';

var fs      = require('fs');
var path    = require('path');
var plugin  = require('../');
var test    = require('tape');

Object.keys(tests).forEach(function (name) {
	var parts = tests[name];

	test(name, function (t) {
		var fixtures = Object.keys(parts);

		t.plan(fixtures.length * 2);

		fixtures.forEach(function (fixture) {
			var message    = parts[fixture].message;
			var options    = parts[fixture].options;
			var warning    = parts[fixture].warning || 0;
			var warningMsg = message + ' (# of warnings)';

			var baseName   = fixture.split(':')[0];
			var testName   = fixture.split(':').join('.');

			var inputPath  = path.resolve(dir + baseName + '.css');
			var expectPath = path.resolve(dir + testName + '.expect.css');
			var actualPath = path.resolve(dir + testName + '.actual.css');

			var inputCSS = '';
			var expectCSS = '';

			try {
				inputCSS = fs.readFileSync(inputPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(inputPath, inputCSS);
			}

			try {
				expectCSS = fs.readFileSync(expectPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(expectPath, expectCSS);
			}

			plugin.process(inputCSS, options).then(function (result) {
				var actualCSS = result.css;

				if (debug) fs.writeFileSync(actualPath, actualCSS);

				t.equal(actualCSS, expectCSS, message);

				t.equal(result.warnings().length, warning, warningMsg);
			});
		});
	});
});
