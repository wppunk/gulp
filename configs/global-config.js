const config_name_index = process.argv.indexOf("--config");
const config_name = (config_name_index > 0) ? 'config-' + process.argv[config_name_index + 1] + '.js' : 'config-default.js';
const config = require('./' + config_name);
// Style related.
const styleSRC = config.themeDir + 'src/scss/style.scss';
const styleDestination = config.themeDir + 'assets/css/';
const styleWatchFiles = config.themeDir + 'src/scss/**/*.scss';

// JS Vendor related.
const jsCustomFile = 'custom.js';
const jsVendorFile = 'vendor.js';
const jsCustomSRC = config.themeDir + 'src/js/*.js';
const jsVendorSRC = config.themeDir + 'src/js/lib/*.js';
const jsDestination = config.themeDir + 'assets/js/';
const jsWatchCustomFiles = config.themeDir + 'src/js/*.js';
const jsWatchVendorFiles = config.themeDir + 'src/js/lib/*.js';

// Fonts related.
const fontsSRC = config.themeDir + 'src/fonts/**/**';
const fontsDestination = config.themeDir + 'assets/fonts/';
const fontsWatchFiles = fontsSRC;

// Images related.
const imagesSRC = config.themeDir + 'src/images/**/*.{png,jpg,gif,svg}';
const imagesDestination = config.themeDir + 'assets/img/';
const imagesWatchFiles = imagesSRC;

// PHP related
const phpWatchFiles = config.themeDir + '**/*.php';

// Browsers lists
const browserList = [
    'last 2 version',
    '> 1%',
    'ie >= 11',
    'last 1 Android versions',
    'last 1 ChromeAndroid versions',
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'last 2 iOS versions',
    'last 2 Edge versions',
    'last 2 Opera versions'
];

module.exports = {
    isDev: config.isDev,
    projectURL: config.projectURL,
    themeDir: config.themeDir,
    styleSRC,
    styleDestination,
    styleWatchFiles,
    jsVendorFile,
    jsCustomFile,
    jsVendorSRC,
    jsCustomSRC,
    jsDestination,
    jsWatchCustomFiles,
    jsWatchVendorFiles,
    fontsSRC,
    fontsDestination,
    fontsWatchFiles,
    imagesSRC,
    imagesDestination,
    imagesWatchFiles,
    phpWatchFiles,
    browserList
};