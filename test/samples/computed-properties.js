module.exports = [
	{
		description: 'creates a computed property',

		input: `
			var obj = {
				[a]: 1
			};`,

		output: `
			var obj = {};
			obj[a] = 1;`
	},

	{
		description: 'creates a computed property with a non-identifier expression',

		input: `
			var obj = {
				[a()]: 1
			};`,

		output: `
			var obj = {};
			obj[a()] = 1;`
	},

	{
		description: 'creates a computed property at start of literal',

		input: `
			var obj = {
				[a]: 1,
				b: 2
			};`,

		output: `
			var obj = {};
			obj[a] = 1;
			obj.b = 2;`
	},

	{
		description: 'creates a computed property at start of literal with method afterwards',

		input: `
			var obj = {
				[a]: 1,
				b() {}
			};`,

		output: `
			var obj = {};
			obj[a] = 1;
			obj.b = function b() {};`
	},

	{
		description: 'creates a computed property at start of literal with generator method afterwards when transpiling methods is disabled',

		options: { transforms: { conciseMethodProperty: false, generator: false } },

		input: `
			var obj = {
				[a]: 1,
				*b() {}
			};`,

		output: `
			var obj = {};
			obj[a] = 1;
			obj.b = function* () {};`
	},

	{
		description: 'creates a computed property at end of literal',

		input: `
			var obj = {
				a: 1,
				[b]: 2
			};`,

		output: `
			var obj = {
				a: 1
			};
			obj[b] = 2;`
	},

	{
		description: 'creates a computed property in middle of literal',

		input: `
			var obj = {
				a: 1,
				[b]: 2,
				c: 3
			};`,

		output: `
			var obj = {
				a: 1
			};
			obj[b] = 2;
			obj.c = 3;`
	},

	{
		description: 'creates multiple computed properties',

		input: `
			var obj = {
				[a]: 1,
				b: 2,
				[c]: 3,
				[d]: 4,
				e: 5,
				[f]: 6
			};`,

		output: `
			var obj = {};
			obj[a] = 1;
			obj.b = 2;
			obj[c] = 3;
			obj[d] = 4;
			obj.e = 5;
			obj[f] = 6;`
	},

	{
		description: 'creates computed property in complex expression',

		input: `
			var a = 'foo', obj = { [a]: 'bar', x: 42 }, bar = obj.foo;`,

		output: `
			var _obj$1;

			var a = 'foo', obj = ( _obj$1 = {}, _obj$1[a] = 'bar', _obj$1.x = 42, _obj$1 ), bar = obj.foo;`
	},

	{
		description: 'creates computed property in block with conflicts',

		input: `
			var x;

			if ( true ) {
				let x = {
					[a]: 1
				};
			}`,

		output: `
			var x;

			if ( true ) {
				var x$1 = {};
				x$1[a] = 1;
			}`
	},

	{
		description: 'closing parenthesis put in correct place (#73)',

		input: `
			call({ [a]: 5 });`,

		output: `
<<<<<<< HEAD
<<<<<<< HEAD
			var obj;

			call(( obj = {}, obj[a] = 5, obj ));`
=======
			var _obj;
			call(( _obj = {}, _obj[a] = 5, _obj ));`
>>>>>>> rename obj to _obj for computed properties
=======
			call(( _obj = {}, _obj[a] = 5, _obj ));
			var _obj;`
>>>>>>> fix tests
	},

	{
		description: 'creates a computed method (#78)',

		input: `
			var obj = {
				[a] () {
					// code goes here
				}
			};`,

		output: `
			var obj = {};
			obj[a] = function () {
					// code goes here
				};`
	},

	{
		description:
			'creates a computed method with a non-identifier expression (#78)',

		input: `
			var obj = {
				[a()] () {
						// code goes here
					}
			};`,

		output: `
			var obj = {};
			obj[a()] = function () {
						// code goes here
					};`
	},

	{
		description:
			'does not require space before parens of computed method (#82)',

		input: `
			var obj = {
				[a]() {
					// code goes here
				}
			};`,

		output: `
			var obj = {};
			obj[a] = function () {
					// code goes here
				};`
	},

	{
		description:
			'supports computed shorthand function with object spread in body (#135)',

		options: {
			objectAssign: 'Object.assign'
		},
		input: `
			let a = {
				[foo] (x, y) {
					return {
						...{abc: '123'}
					};
				},
			};
		`,
		output: `
			var a = {};
			a[foo] = function (x, y) {
					return Object.assign({}, {abc: '123'});
				};
		`
	},

	{
		description:
			'object literal with computed property within arrow expression (#126)',

		input: `
			foo => bar({[x - y]: obj});
		`,
		output: `
<<<<<<< HEAD
			!function(foo) {
				var obj$1;

				return bar(( obj$1 = {}, obj$1[x - y] = obj, obj$1 ));
			};
		`
	},

	{
		description: 'Supports nested computed properties (#51)',

		input: `
			(function () { return { [key]: { [key]: val } } })
		`,
		output: `
			(function () {
			var obj, obj$1;
 return ( obj$1 = {}, obj$1[key] = ( obj = {}, obj[key] = val, obj ), obj$1 ) })
=======
			(function(foo) { return bar(( _obj = {}, _obj[x - y] = obj, _obj ))
				var _obj;; });
>>>>>>> fix tests
		`
	},

	{
		description: 'Puts helper variables in correct scope',

		input: `
			((x) => {var obj = 2; console.log([{[x]: 1}, obj]);})(3);
		`,
		output: `
			(function (x) {
			var obj$1;
var obj = 2; console.log([( obj$1 = {}, obj$1[x] = 1, obj$1 ), obj]);})(3);
		`
	}
];
