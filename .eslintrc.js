/**@type {import('eslint').Linter.Config} */
// eslint-disable-next-line no-undef
module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	rules: {
		semi: [2, "always"],
		"@typescript-eslint/no-unused-vars": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/explicit-module-boundary-types": 0,
		"@typescript-eslint/no-non-null-assertion": 0,
		//https://twitter.com/flybayer/status/1580825094774878208
		"no-cond-assign": "error",
		"no-constant-condition": "error",
		"no-unreachable": "error",
		"no-unused-expressions": "error",
		"no-constant-binary-expression": "error",
		"no-sequences": "error",
	},
};
