# Mykrobe Atlas Coding Standards

Coding standards to follow when working on the app, to ensure consistency and quality. Code is automatically formatted on commit.

## JavaScript

Follow the [standardjs.com](http://standardjs.com) conventions, unless otherwise outlined below.

Check the `rules` block of the `.eslintrc` config file in the project root to see which options differ from the standardjs documentation:


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
import * as Example from 'example/Example';

// good
import * as Example from '../../example/Example';
```

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


## Flow, linting and formatting

[Flow](https://flowtype.org/) is used to check types.

To run flow:

```
$ yarn flow
```

[ESLint](http://eslint.org/) and [Prettier](https://prettier.io/) are used to enforce consistency and code conventions in JavaScript and CSS.

To lint with eslint and prettier

```
$ yarn lint
```

To format js and css files with prettier

```
$ yarn prettier
```

Installing a flow linter, eslint and prettier with format-on-save enabled in your code editor will assist in catching issues before they are committed to source control.
