// imports/requires
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  envify = require('gulp-envify'),
  clean = require('gulp-clean'),
  version = require('gulp-version-number'),
  args = require('yargs').argv,
  gulpIf = require('gulp-if'),
  gulpCopy = require('gulp-copy'),
  htmlmin = require('gulp-htmlmin'),
  eslint = require('gulp-eslint'),
  autoprefixer = require('gulp-autoprefixer'),
  ngAnnotate = require('gulp-ng-annotate'),
  templateCache = require('gulp-angular-templatecache'),
  historyAPIFallback = require('connect-history-api-fallback'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  gUtil = require('gulp-util'),
  env = args.env,
  brfs = require('brfs'),
  babel = require('gulp-babel'),
  bulkify = require('bulkify'),
  appModule = 'App';

// variable
var appPath = 'app/**/**/*';
var cssCollection = appPath + '.scss';
var jsCollection = ['app/js/**/**/*.js'];


var htmlCollection = 'app/views/**/**/*.html';
var indexPath = 'app/index.html';

// externalJs
var externalJs = []

// externalCSS
var externalCSS = [];

function handler(error) {
  gUtil.log(error.message);
}
//task to compile, concat, cleanSCSS
gulp.task('sass', function () {
  return gulp.src(cssCollection)
    .pipe(sass())
    .on('error', handler)
    .pipe(concat('app.css'))
    .pipe(cleanCSS())
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function () {
  return browserify({
      entries: ["app/app.js"],
      debug: false,
      cache: {},
      packageCache: {},
      fullPaths: false
    })
    .transform(babelify, {
      "presets": ["es2015"]
    })
    .transform(brfs, {})
    .transform(bulkify, {})
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('build-external-js', function () {
  return gulp.src(externalJs)
    .pipe(concat('external.js'))
    .pipe(uglify())
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-external-css', function () {
  return gulp.src(externalCSS)
    .pipe(concat('external.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/'))
});

gulp.task('html', function () {
  return gulp.src(htmlCollection)
    .pipe(version({
      'append': {
        'value': '%MDS%',
        'key': '_v',
        'cover': 1,
        'to': ['js', 'css']

      }
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true
    }))
    .on('error', handler)
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('indexPath', function () {
  return gulp.src(indexPath)
    .pipe(version({
      'append': {
        'value': '%MDS%',
        'key': '_v',
        'cover': 1,
        'to': ['js', 'css']

      }
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true
    }))
    .on('error', handler)
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('dist/'))
});

// gulp.task('templateCache', function () {
//   return gulp.src('dist/views/**/**/*.html')
//     .pipe(templateCache())
//     .pipe(gulp.dest('dist/'));
// });

gulp.task('images', function () {
  return gulp.src('app/assets/images/**/*.+(png|jpg|gif|svg|ico|jpeg)')
    .pipe(cache(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: true
        }]
      })
    ])))
    .on('error', handler)
    .pipe(gulp.dest('dist/assets/images'))
});

gulp.task('fonts', function () {
  return gulp.src('app/assets/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'))
});

// copy locales to dist
gulp.task('copy-locale', function () {
  return gulp.src('app/locale/**/*.json')
    .pipe(gulp.dest('dist/locale'));
})

//browsersync config for live reload
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'dist',
      middleware: [historyAPIFallback()]
    }
  });
});

gulp.task('clean-dist', function () {
  return gulp.src('dist', {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('lint', function () {
  return gulp.src(jsCollection).pipe(eslint({
      configFile: '.eslintrc'
    }))
    .pipe(eslint.format())
    .pipe(eslint.results(function (results) {
      // Called once for all ESLint results.
      console.log(`Total Warnings: ${results.warningCount}`);
      console.log(`Total Errors: ${results.errorCount}`);
    }))
  // Brick on failure to be super strict
  //.pipe(eslint.failOnError());
});

gulp.task('watch-template', function () {
  runSequence('html', 'scripts');
})
gulp.task('build', function () {
  runSequence('lint', 'clean-dist', 'run-asyncTasks');
});

gulp.task('build-dev', function () {
  runSequence('lint', 'clean-dist', 'run-asyncTasks', 'browserSync');
});

gulp.task('run-asyncTasks', ['sass', 'indexPath', 'images', 'fonts', 'build-external-js', 'build-external-css', 'copy-locale'], function () {
  runSequence('html', 'scripts');
});

//task to watch dev changes, run this task to start the app
gulp.task('dev', ['build-dev'], function () {
  gulp.watch(cssCollection, ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch(htmlCollection, ['watch-template']);
  gulp.watch(jsCollection, ['scripts']);
  gulp.watch(indexPath, ['indexPath']);
});

// run this task in staging environment
gulp.task('staging', ['build'], function () {
  console.log('Build Successful');
});

// run this task in prod environment
gulp.task('prod', ['build'], function () {
  console.log('Build Successful');
});
