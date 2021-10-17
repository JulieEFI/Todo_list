let preprocessor = 'sass'; // выбор препроцессора в проекте!
const { src, dest, watch, parallel, series } = require('gulp');
const scss         = require('gulp-sass'); 
const concat       = require('gulp-concat'); 	
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default; 
const autoprefixer = require('gulp-autoprefixer'); 
const imagemin     = require('gulp-imagemin'); 
const del          = require('del');
const newer = require('gulp-newer');
const cleancss = require('gulp-clean-css');
const less = require('gulp-less');

function browsersync() { 
    browserSync.init({
        server : {baseDir: 'app/' 
        },
        notify: false, 
		online: true 
    });

}

function scripts () { 
    return src([ 
       'node_modules/jquery/dist/jquery.min.js',
       'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify()) 
    .pipe(dest('app/js'))
    .pipe(browserSync.stream()) 
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('app/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
}



function styles() {
    return src('app/scss/style.scss')
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true
    }))
    .pipe(scss({outputStyle: 'expanded'}))
    .pipe(concat('style.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())

} 

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
    
	watch('app/**/' + preprocessor + '/**/*', styles);
    		
	watch('app/images/src/**/*', images);

}
function buildcopy() {
	return src([
		'app/css/**/*.min.css',
		'app/js/**/*.min.js',
		'app/images/dest/**/*',
		'app/**/*.html',
		], { base: 'app' }) 
	.pipe(dest('dist')) 
}

exports.styles = styles; 
exports.watching = watching;
exports.browsersync = browsersync; 
exports.default = scripts;
exports.images = images; 
exports.cleanDist = cleanDist;
exports.scripts = scripts;

exports.build = series(styles, scripts, images, buildcopy);
exports.default = parallel(scripts, browsersync, watching,styles); 