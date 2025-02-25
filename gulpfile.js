const gulp = require('gulp');

// tasks
require('./gulp/dev.js');
require('./gulp/docs.js');

gulp.task(
    'default',
    gulp.series(
        'clean:dev',
        gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'files:dev', 'js:dev', 'svgSprite:dev'),
        gulp.parallel('server:dev', 'watch:dev')
    )
);

gulp.task(
    'docs',
    gulp.series(
        'clean:docs',
        gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'fonts:docs', 'files:docs', 'js:docs', 'svgSprite:docs'),
        gulp.parallel('server:docs', 'watch:docs')
    )
);