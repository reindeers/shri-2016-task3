var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
  //  uglify = require('gulp-uglify'),
  //  useref = require('gulp-useref'),
  //  cssnano = require('gulp-cssnano'),
  //  gulpIf = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    csscomb = require('gulp-csscomb');

var browserSync = require('browser-sync').create();

/*gulp.task('minify', function () {
    gulp.src('app/js/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});*/

gulp.task('stylus', function(){
  return gulp.src('app/styl/*.styl')
    .pipe(stylus()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('csscomb', function() {
  return gulp.src('app/css/*.css')
    .pipe(csscomb())
    .pipe(gulp.dest('app/css'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

/*gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('build'))
});*/

//gulp.task('fonts', function() {
//  return gulp.src('app/fonts/**/*')
//  .pipe(gulp.dest('build/fonts'))
//});

gulp.task('autoprefixer', function () {
    return gulp.src('app/css/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css'));
});

gulp.task('babel', function () {
    return gulp.src('app/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build/js'));
});


gulp.task('eslint', function() {
    return gulp.src(['app/js/*.js','!node_modules/**'])
        .pipe(eslint({
          "env": {
             "es6": false
            },
            "ecmaFeatures": {
             "arrowFunctions": true,
             "blockBindings": true,
             "classes": true,
             "defaultParams": true,
             "destructuring": true,
             "forOf": true,
             "generators": false,
             "modules": true,
             "objectLiteralComputedProperties": true,
             "objectLiteralDuplicateProperties": false,
             "objectLiteralShorthandMethods": true,
             "objectLiteralShorthandProperties": true,
             "restParams": true,
             "spread": true,
             "superInFunctions": true,
             "templateStrings": true,
             "jsx": true
            },
            "rules": {
             // require braces in arrow function body
             "arrow-body-style": [2, "as-needed"],
             // require parens in arrow function arguments
             "arrow-parens": 0,
             // require space before/after arrow function's arrow
             "arrow-spacing": [2, { "before": true, "after": true }],
             // verify super() callings in constructors
             "constructor-super": 0,
             // enforce the spacing around the * in generator functions
             "generator-star-spacing": 0,
             // disallow arrow functions where a condition is expected
             "no-arrow-condition": 0,
             // disallow modifying variables of class declarations
             "no-class-assign": 0,
             // disallow modifying variables that are declared using const
             "no-const-assign": 2,
             // disallow duplicate name in class members
             "no-dupe-class-members": 0,
             // disallow to use this/super before super() calling in constructors.
             "no-this-before-super": 0,
             // require let or const instead of var
             "no-var": 2,
             // require method and property shorthand syntax for object literals
             "object-shorthand": [2, "always"],
             // suggest using arrow functions as callbacks
             "prefer-arrow-callback": 2,
             // suggest using of const declaration for variables that are never modified after declared
             "prefer-const": 2,
             // suggest using Reflect methods where applicable
             "prefer-reflect": 0,
             // suggest using the spread operator instead of .apply()
             "prefer-spread": 0,
             // suggest using template literals instead of strings concatenation
             "prefer-template": 2,
             // disallow generator functions that do not have yield
             "require-yield": 0,
             // Enforces getter/setter pairs in objects
            "accessor-pairs": 0,
            // treat var statements as if they were block scoped
            "block-scoped-var": 2,
            // specify the maximum cyclomatic complexity allowed in a program
            "complexity": [0, 11],
            // require return statements to either always or never specify values
            "consistent-return": 2,
            // specify curly brace conventions for all control statements
            "curly": [2, "multi-line"],
            // require default case in switch statements
            "default-case": 2,
            // enforces consistent newlines before or after dots
            "dot-location": 0,
            // encourages use of dot notation whenever possible
            "dot-notation": [2, { "allowKeywords": true}],
            // require the use of === and !==
            "eqeqeq": 2,
            // make sure for-in loops have an if statement
            "guard-for-in": 2,
            // disallow the use of alert, confirm, and prompt
            "no-alert": 1,
            // disallow use of arguments.caller or arguments.callee
            "no-caller": 2,
            // disallow lexical declarations in case clauses
            "no-case-declarations": 2,
            // disallow division operators explicitly at beginning of regular expression
            "no-div-regex": 0,
            // disallow else after a return in an if
            "no-else-return": 2,
            // disallow use of empty destructuring patterns
            "no-empty-pattern": 0,
            // disallow comparisons to null without a type-checking operator
            "no-eq-null": 0,
            // disallow use of eval()
            "no-eval": 2,
            // disallow adding to native types
            "no-extend-native": 2,
            // disallow unnecessary function binding
            "no-extra-bind": 2,
            // disallow fallthrough of case statements
            "no-fallthrough": 2,
            // disallow the use of leading or trailing decimal points in numeric literals
            "no-floating-decimal": 2,
            // disallow the type conversions with shorter notations
            "no-implicit-coercion": 0,
            // disallow use of eval()-like methods
            "no-implied-eval": 2,
            // disallow this keywords outside of classes or class-like objects
            "no-invalid-this": 0,
            // disallow usage of __iterator__ property
            "no-iterator": 2,
            // disallow use of labeled statements
            "no-labels": [2, {"allowLoop": true, "allowSwitch": true}],
            // disallow unnecessary nested blocks
            "no-lone-blocks": 2,
            // disallow creation of functions within loops
            "no-loop-func": 2,
            // disallow the use of magic numbers
            "no-magic-numbers": 0,
            // disallow use of multiple spaces
            "no-multi-spaces": 2,
            // disallow use of multiline strings
            "no-multi-str": 2,
            // disallow reassignments of native objects
            "no-native-reassign": 2,
            // disallow use of new operator for Function object
            "no-new-func": 2,
            // disallows creating new instances of String,Number, and Boolean
            "no-new-wrappers": 2,
            // disallow use of new operator when not part of the assignment or comparison
            "no-new": 2,
            // disallow use of octal escape sequences in string literals, such as
            // var foo = "Copyright \251";
            "no-octal-escape": 2,
            // disallow use of (old style) octal literals
            "no-octal": 2,
            // disallow reassignment of function parameters
            "no-param-reassign": [2, { "props": true }],
            // disallow use of process.env
            "no-process-env": 0,
            // disallow usage of __proto__ property
            "no-proto": 2,
            // disallow declaring the same variable more then once
            "no-redeclare": 2,
            // disallow use of assignment in return statement
            "no-return-assign": 2,
            // disallow use of `javascript:` urls.
            "no-script-url": 2,
            // disallow comparisons where both sides are exactly the same
            "no-self-compare": 2,
            // disallow use of comma operator
            "no-sequences": 2,
            // restrict what can be thrown as an exception
            "no-throw-literal": 2,
            // disallow usage of expressions in statement position
            "no-unused-expressions": 2,
            // disallow unnecessary .call() and .apply()
            "no-useless-call": 0,
            // disallow unnecessary concatenation of literals or template literals
            "no-useless-concat": 0,
            // disallow use of void operator
            "no-void": 0,
            // disallow usage of configurable warning terms in comments: e.g. todo
            "no-warning-comments": [0, { "terms": ["todo", "fixme", "xxx"], "location": "start" }],
            // disallow use of the with statement
            "no-with": 2,
            // require use of the second argument for parseInt()
            "radix": 2,
            // requires to declare all vars on top of their containing scope
            "vars-on-top": 2,
            // require immediate function invocation to be wrapped in parentheses
            "wrap-iife": [2, "outside"],
            // require or disallow Yoda conditions
            "yoda": 2
            }
        }))
        .pipe(eslint.result(function result() {
        // Called for each ESLint result.
        console.log('ESLint result:' + result.filePath);
        //console.log('# Messages:'+ result.messages.length);
        console.log('# Warnings:'+ result.warningCount);
        console.log('# Errors:'+ result.errorCount);
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task('default', ['browserSync', 'stylus', 'csscomb', 'autoprefixer', 'eslint', 'babel'], function(){
  gulp.watch('app/styl/*.styl', ['stylus']);
  gulp.watch('app/css/*.css', ['csscomb', 'autoprefixer', browserSync.reload]);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', ['eslint', 'babel', browserSync.reload]);
});

//gulp.task('build', [`stylus`, `useref`, `fonts`, `autoprefixer`], function (){
//  console.log('Building files'); //run-sequence, source-maps,  gulp-changed
//});

//gulp.task('default', ['stylus','browserSync', 'watch', 'autoprefixer'],function () {
//});


/*
uglify
concat*/
