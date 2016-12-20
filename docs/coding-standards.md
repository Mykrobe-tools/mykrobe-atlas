# Coding standards

Coding standards to follow when working on the app, to ensure consistency and quality.

## JavaScript

Follow the [standardjs.com](http://standardjs.com) conventions, unless otherwise outlined below.

Check the `rules` block of the `.eslintrc` config file in the project root to see which options differ from the stadardjs documentation:


### Semi-colons

Use semi-colons.

_eslint rule: `semi: "always"`_

```
// bad
const lorem = 'ipsum'

// good
const lorem = 'ipsum';
```

### Space before function parenthesis

No space between function name and function parenthesis.

_eslint rule: `space-before-function-paren: "never"`_

```
// bad
function withSpace (x) {
    // ...
}

// good
function withoutSpace(x) {
	// ...
}
```

### "stroustrup" style braces

Put `else` statements on a new line.

_eslint rule: `brace-style: "stroustrup"`_

```
// bad
if (foo) {
  bar();
} else {
  baz();
}

// good
if (foo) {
  bar();
}
else {
  baz();
}
```

### Avoid bind

Avoid using `bind` to pass the context of `this` to a component. Instead a reference can be passed via arrow functions.

```
// bad
<Component onClick={onClick.bind(this)} />

// good
<Component onClick={(event) => {onClick(event)}} />
```

### Use destructuring

Use destructuring to avoid long object chains.

```
// bad
<Component
	name={this.props.name}
	onClick={(event) => this.props.onClick(event)} />

// good
const {name, onClick} = this.props;
<Component
	name={name}
	onClick={(event) => onClick(event)} />
```

### Use relative import paths

Webpack allows references to imported files to be interpreted from the root of the project. However, this can cause issues with the jest testing framework, and so it is best to always use relative paths to files that are being imported.

```
// bad
import * as MetadataActions from 'actions/MetadataActions';

// good
import * as MetadataActions from '../../actions/MetadataActions';
```

## CSS

Follow the [stylelint standard](https://github.com/stylelint/stylelint-config-standard) conventions, unless otherwise outlined below.

### Use composes

Use `composes` to import styles from other classes, rather than adding multiple class names to an element.

```
// bad - html
<div className={[class1, class2].join(' ')} />

// bad - css
.class1 { ... }
.class2 { ... }

// good - html
<div className={class1} />

// good - css
.class1 { composes: class2; }
.class2 { ... }
```

### CSS Modules

This app uses [css-modules](https://github.com/css-modules/css-modules).

All `.css` file extensions will use css-modules unless it has `.global.css`.

If you need global styles, stylesheets with `.global.css` will not go through the css-modules loader. e.g. `app.global.css`


## Flow and Linting

[Flow](https://flowtype.org/) is used to enforce and check types.

To run flow:

```
$ npm run flow
```

[ESLint](http://eslint.org/) is used to enforce consistency and code conventions in JavaScript.

To run eslint:

```
$ npm run lint:js
```

[Stylelint](https://stylelint.io/) is used to enforce consistency and code conventions in CSS.

To run eslint:

```
$ npm run lint:css
```

Installing a flow linter, eslint and stylelint in your code editor will assist in catching issues before they are committed to source control.
