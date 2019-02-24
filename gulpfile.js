'use strict';

// 패키지 변수
const pkg = require("./package.json");

// gulp
const gulp = require("gulp");

// devDependencies에 있는 모든 플러그인을 $ 변수에 로딩합니다
const $ = require("gulp-load-plugins")({
    pattern: ["*"],
    scope: ["devDependencies"]
});

const onError = (err) => console.log(err);

const banner = [
    "/**",
    " * @project        <%= pkg.name %>",
    " * @author         <%= pkg.author %>",
    " * @build          " + $.moment().format("llll") + " ET",
    " * @release        " + $.gitRevSync.long() + " [" + $.gitRevSync.branch() + "]",
    " * @copyright      Copyright (c) " + $.moment().format("YYYY") + ", <%= pkg.copyright %>",
    " *",
    " */",
    ""
].join("\n");

// 기본 작업
gulp.task("default", ["css", "js-combine", "html"], () => {
    $.livereload.listen();
    gulp.watch([pkg.paths.src.scss + "**/*.scss"], ["css"]);
    gulp.watch([pkg.paths.src.css + "**/*.css"], ["css"]);
    gulp.watch([pkg.paths.src.js + "**/*.js"], ["js-combine"]);
    gulp.watch([pkg.paths.src.html + "**/*.{html,htm,twig}"], ["html"]);
    // gulp.watch([pkg.paths.templates + "**/*.{html,htm,twig}"], () => {
    //     gulp.src(pkg.paths.templates)
    //         .pipe($.plumber({errorHandler: onError}))
    //         .pipe($.livereload());
    // });
});

// scss = paths를 포함한 build 폴더로 scss를 빌드하고 소스맵을 만듭니다
gulp.task("scss", () => {
    $.fancyLog("-> Compiling scss");
    return gulp.src(pkg.paths.src.scss + pkg.vars.scssName)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass({
                includePaths: pkg.paths.scss
            })
            .on("error", $.sass.logError))
        .pipe($.cached("sass_compile"))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write("./"))
        .pipe($.size({gzip: true, showFiles: true}))
        .pipe(gulp.dest(pkg.paths.build.css));
});

// css 작업 - 배포용 CSS를 public css 폴더로 하나로 합치고 최소화하고 여기에 배너를 추가합니다
gulp.task("css", ["scss"], () => {
    $.fancyLog("-> Building css");
    return gulp.src(pkg.globs.distCss)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.newer({dest: pkg.paths.dist.css + pkg.vars.siteCssName}))
        .pipe($.print())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat(pkg.vars.siteCssName))
        .pipe($.cssnano({
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }))
        .pipe($.header(banner, {pkg: pkg}))
        .pipe($.sourcemaps.write("./"))
        .pipe($.size({gzip: true, showFiles: true}))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter("**/*.css"))
        .pipe($.livereload());
});

// 바벨 js 작업 - 자바스크립트를 빌드 폴더로 트랜스파일 합니다
gulp.task("js-babel", () => {
    $.fancyLog("-> Transpiling Javascript via Babel...");
    return gulp.src(pkg.globs.babelJs)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.newer({dest: pkg.paths.build.js}))
        .pipe($.babel())
        .pipe($.size({gzip: true, showFiles: true}))
        .pipe(gulp.dest(pkg.paths.build.js));
});

// js 작업 - public js 폴더로 배포 자바스크립트를 최소화하고 여기에 배너를 추가합니다
// gulp.task("js", ["js-inline", "js-babel"], () => {
gulp.task("js", () => {
    $.fancyLog("-> Building js");
    return gulp.src(pkg.paths.src.js + "**/*.js")
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.if(["**/*.js", "!**/*.min.js"],
            $.newer({dest: pkg.paths.dist.js, ext: ".min.js"})
        ))
        .pipe($.if(["**/*.js", "!**/*.min.js"],
            $.uglify()
        ))
        .pipe($.if(["**/*.js", "!**/*.min.js"],
            $.rename({suffix: ".min"})
        ))
        .pipe($.size({gzip: true, showFiles: true}))
        .pipe(gulp.dest(pkg.paths.build.js))
});

gulp.task("js-combine", ["js-babel", "js"], () => {
  $.fancyLog("-> Combining js");
  return gulp.src([
            pkg.paths.build.js + "app/*.min.js",
            pkg.paths.build.js + "controllers/*.min.js",
            pkg.paths.build.js + "directives/*.min.js",
            pkg.paths.build.js + "services/*.min.js",
            pkg.paths.build.js + "factories/*.min.js"
       ])
       .pipe($.plumber({errorHandler: onError}))
       .pipe($.newer({dest: pkg.paths.dist.js + pkg.vars.siteJsName}))
       .pipe($.concat(pkg.vars.siteJsName))
       .pipe($.size({gzip: true, showFiles: true}))
       .pipe($.header(banner, {pkg: pkg}))
       .pipe(gulp.dest(pkg.paths.dist.js))
       .pipe($.filter("**/*.js"))
       .pipe($.livereload());

});

// imagemin 태스크
gulp.task("imagemin", () => {
    return gulp.src(pkg.paths.img + "**/*.{png,jpg,jpeg,gif,svg}")
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 7,
            svgoPlugins: [{removeViewBox: false}],
            verbose: true,
            use: []
        }))
        .pipe(gulp.dest(pkg.paths.img));
});

gulp.task('html', function() {
  $.fancyLog("-> Minify html");
  return gulp.src(pkg.paths.src.html + pkg.vars.htmlName)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe($.print())
    .pipe(gulp.dest(pkg.paths.dist.html))
    .pipe($.filter("**/*.html"))
    .pipe($.livereload());
});

// fontello 생성 태스크
gulp.task("generate-fontello", () => {
    return gulp.src(pkg.paths.src.fontello + "config.json")
        .pipe($.fontello())
        .pipe($.print())
        .pipe(gulp.dest(pkg.paths.build.fontello))
});

// 서체 복사 태스크
gulp.task("fonts", ["generate-fontello"], () => {
    return gulp.src(pkg.globs.fonts)
        .pipe(gulp.dest(pkg.paths.dist.fonts));
});

// 프로덕션 빌드
// gulp.task("build", ["default", "imagemin", "fonts"]);
gulp.task("build", ["default", "imagemin"]);
