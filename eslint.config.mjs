import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { fixupPluginRules } from "@eslint/compat"
// eslint.config.mjs
import js from "@eslint/js"
import pluginTs from "@typescript-eslint/eslint-plugin"
import parserTs from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import pluginPrettier from "eslint-plugin-prettier"
import pluginReact from "eslint-plugin-react"
import globals from "globals"
import tseslint from "typescript-eslint"
const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
	/**
	 * Global ignores
	 */
	{
		ignores: [
			"coverage",
			"dist",
			"node_modules",
			"analyze",
			"resource",
			"public",
			"tailwind.config.ts",
			".pnpm",
			".react-router",
			"!**/.server",
			"!**/.client",
		],
	},
	{
		settings: {
			react: {
				version: "detect",
			},
			formComponents: ["Form"],
			linkComponents: [
				{ name: "Link", linkAttribute: "to" },
				{ name: "NavLink", linkAttribute: "to" },
			],
			"import/internal-regex": "^~/",
			"import/resolver": {
				node: {
					extensions: [".ts", ".tsx"],
				},
				typescript: {
					alwaysTryTypes: true,
				},
			},
		},
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.ts", "**/*.tsx", "**/*.cjs", "**/*.mjs", "**/*.jsx"],
		languageOptions: {
			ecmaVersion: 2020,
			parser: parserTs,
			parserOptions: {
				projectService: true,
				createDefaultProgram: false,
				ecmaFeatures: {
					jsx: true,
				},
				tsconfigRootDir: __dirname,
				ecmaVersion: "latest",
				jsxPragma: "React",
				project: "./tsconfig.*?.json",
				sourceType: "module",
			},
			globals: {
				...globals.browser,
				shopify: "readonly",
			},
		},
		plugins: {
			react: pluginReact,
			"@typescript-eslint": pluginTs,
			prettier: pluginPrettier,
			import: fixupPluginRules(importPlugin),
		},
		rules: {
			...pluginReact.configs.flat.recommended.rules,
			...pluginTs.configs["eslint-recommended"].overrides?.[0].rules,
			...pluginTs.configs.strict.rules,
			"@typescript-eslint/ban-ts-comment": [
				"error",
				{
					"ts-check": false,
					"ts-expect-error": "allow-with-description",
					"ts-ignore": "allow-with-description",
					"ts-nocheck": "allow-with-description",
				},
			],

			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-empty-function": [
				"error",
				{
					allow: ["arrowFunctions", "functions", "methods"],
				},
			],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-non-null-assertion": "error",
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-floating-promises": "warn",
			"react/react-in-jsx-scope": "off",
			"@typescript-eslint/dot-notation": ["error", { allowKeywords: true }],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/no-var-requires": "error",
			"unused-imports/no-unused-vars": "off",
			"react/self-closing-comp": [
				"error",
				{
					component: true,
					html: true,
				},
			],
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-extraneous-class": "off",
			"react/jsx-boolean-value": "error",
			"prefer-template": "error",
			"jsx-quotes": ["error", "prefer-double"],
			"react/jsx-tag-spacing": "error",
			"react/prop-types": "off",
			"react/jsx-curly-brace-presence": "error",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unnecessary-condition": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
		},
	}
)
