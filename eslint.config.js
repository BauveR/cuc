import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.strict, jsxA11y.flatConfigs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Regla del proyecto: ningún archivo supera 100 líneas.
      'max-lines': ['error', { max: 100, skipBlankLines: false, skipComments: false }],
      // Seguridad: prohibir patrones de ejecución dinámica / inyección.
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-properties': [
        'error',
        { property: 'innerHTML', message: 'Usa JSX; innerHTML abre la puerta a XSS.' },
        { property: 'outerHTML', message: 'Usa JSX; outerHTML abre la puerta a XSS.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML prohibido: el contenido vive en src/content/ como datos.',
        },
      ],
    },
  },
)
