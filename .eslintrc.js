module.exports = {
		root: true,
		parser:  "@typescript-eslint/parser",
		"plugins": [
			"@typescript-eslint/eslint-plugin"
		],
		extends: [
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended"
		],
    env: {
        "browser": true,
        "es6": true
    },
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    parserOptions: {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    rules: {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
		},
		overrides: {
			files: ['**/*.ts'],
			parser: 'typescript-eslint-parser',
			rules: {
				'no-undef': 'off'
			}
		}
}