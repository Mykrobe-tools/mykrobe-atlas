# Coding standards

Coding standards to follow when working on the app, to ensure consistency and quality.

## JavaScript

### Use relative import paths

Webpack allows references to imported files to be interpreted from the root of the project. However, this can cause issues with the jest testing framework, and so it is best to always use relative paths to files that are being imported.

```
// bad
import * as MetadataActions from 'actions/MetadataActions';

// good
import * as MetadataActions from '../../actions/MetadataActions';
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


### Flow and ESLint

[Flow](https://flowtype.org/) is used to enforce and check types.

[ESLint](http://eslint.org/) is used to enforce consistency and code conventions.

Installing a flow linter and eslint in your code editor will assist in catching issues before they are committed to source control.


## CSS

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
