# Front-End Boilerplate
Netcore Front-End Boilerplate to quickly start off a new project.

Based on: **yarn**, **webpack** and **gulp**.

Vendor libraries included by default: **bootstrap**, **jquery**, **vue.js**, **lodash**, **axios**

## Requirements
| Engine        | Version       |
| ------------- |:-------------:|
| node          | ≥6            |

## Setup
### Environmental setup
1. Install [NodeJS](https://nodejs.org/en/)
  * on some systems "npm" needs to be installed separately - [see this](https://docs.npmjs.com/getting-started/installing-node) if you're having trouble getting through next steps
2. Install [gulp](https://gulpjs.com)
3. Install [yarn](https://yarnpkg.com/en/docs/install)

### Project setup
1. `git clone https://github.com/netcore/frontend-base.git <project name>`
2. `cd <project name>`
3. `yarn` or `yarn install`
4. (optional) delete all `.placeholder` files

### Starting the development
`gulp dev` to start a local server and watch for changes

### Production
`gulp prod` to get project templates and assets ready for production

_this task may take longer to finish because of image processing tasks_

## For frontend developers:

### Editor
* Tab size: 4
* Indent using spaces: no (false)
* Language-specific changes:
  * JavaScript language version: ECMAScript 6 ([WebStorm example](https://i.imgur.com/rB1DYqi.png))

### Assets
#### Installing new packages
1. `yarn add <package name>` in your terminal/cmd
2. `import '<package name>'` in **bootstrap.js** 

### HTML
* For template rendering we use nunjucks: ([Nunjucks](https://mozilla.github.io/nunjucks/))
* Overview of the templating features: ([Templating](https://mozilla.github.io/nunjucks/templating.html))

### SVG
* Usage
  * `{% include "resources/assets/svg/icons/logo.svg" %}`

### SASS/SCSS
#### Variables
* All variables must be inside `base/_variables.scss`
* For color naming we use [Name That Color](http://chir.ag/projects/name-that-color/#6195ED). for example, that color would be defined as "cornflower-blue"
* When defining similar variables it is best if it is defined in a SASS map. [read more about those here](https://webdesign.tutsplus.com/tutorials/an-introduction-to-sass-maps-usage-and-examples--cms-22184)

#### File structure
* All component-like partials must be inside the `components/` directory (e.g. buttons, forms, header, footer etc.)
* All sub-directory files must have a `_` prefix added to them (e.g. `buttons.scss` -> `_buttons.scss`)
* Page-specific edits must be inside the `pages/` directory

### JS
* Technologies
  * use [ES2015](https://babeljs.io/learn-es2015/) (ES6) standards
* File structure
  * files must be logically split between 2 (or more) directories - `utils/` and `classes/`

### Fonts
#### Installation
1. Download the fonts from [fonts.google.com](https://fonts.google.com/)
2. Go to [transfonter.org](https://transfonter.org/)
3. Upload all fonts
4. Put in the following settings:
  * Family support: **ON**
  * Add local() rule: **ON** _(doesn't really matter)_
  * Autohint font: **OFF**
  * Base64 encode: **OFF**
  * Formats: **TTF**, **SVG**, **WOFF**, **WOFF2**
  * Subsets: **set the same as you chose before downloading the font from Google Fonts** ([example](https://i.imgur.com/2lIfhif.png))
5. Convert and download the fonts
6. Place the downloaded fonts inside the `resources/_assets/fonts/<font family name in lowercase>/`
7. If the font files have a prefix "subset-", please remove it

**Comment:** this is done because some of our clients may have their access to Google's CDN blocked - thus not allowing them to see the custom font.

#### Usage
* Open and update `resources/_assets/sass/base/_fonts.scss` to match your font files
* Directories/files with "\_" prefix are ignored

### Validation
 * Validation works only if you add class `.form-submit` to your submit button and class `.validate` to your `<form>` element
 * For error messages, you will need to add `data-error` attribute to your `<input>`, `<select>`, `<textarea>` elements
 * Validation works only to elements with the `required` attribute
 * Attempting to submit, you will see `.has-error` classes applied to `.form-group` elements

### Favicons
* Use [Real Favicon Generator](https://realfavicongenerator.net/) to generate favicons for web use

### Thanks
* [HTML5Boilerplate](https://html5boilerplate.com/)
* [Real Favicon Generator](https://realfavicongenerator.net/)
* [SASS @font-face mixin](https://gist.github.com/jonathantneal/d0460e5c2d5d7f9bc5e6)
