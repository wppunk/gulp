# Gulp

## Description

### Dev
- Live reload browser with BrowserSync
- Sourcemaps
- Easy change config files

### Styles
- Sass to CSS conversion
- Merging media queries
- Error handling
- Auto-prefixing
- Minification
- Sourcemaps

### JavaScript
- Concatenation
- Minification/uglification
- Separate vendor and custom JS files handling

### Images
- Minification/optimization of images
- File types: .png, .jpg, .jpeg, .gif, .svg

### Watching
- For changes in files to recompile
- File types: .css, .html, .php, .js

## Getting Started

```
npm install
gulp
```

All gulp setting in two files: `configs/global-config.js` and `configs/config-default.js`.
 
- `global-config.js` - responsible for general project settings
- `config-default.js` - responsible for quick project settings

## Many projects
You can also create your own configs and easily switch them. You must copy the `config-default` file and name it `config-keyword`.

Using the following command you can run another config

```
gulp --config keyword
```

Thus, there is no need to constantly install the gulp in the project. You can simply create configs for each new project and easily manipulate them