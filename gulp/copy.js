'use strict';

var path = require('path');

module.exports = function(gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;
  var dest = path.join(taskTarget);

  function checkRobots(contents, file) {
    if (file.path.endsWith('robots.txt')) {
      if (args.production) {
        return contents.toString().replace('?', '');
      } else {
        return contents.toString().replace('?', 'Disallow: /');
      }
    }
    return contents;
  }

  // Copy
  gulp.task('copy', function() {
    return gulp.src([
      path.join(dirs.source, '**/*'),
      '!' + path.join(dirs.source, '{**/\_*,**/\_*/**}'),
      '!' + path.join(dirs.source, '**/*.njk'),
      '!' + path.join(dirs.source, 'README.md')
    ])
    .pipe(plugins.transform(checkRobots))
    .pipe(plugins.changed(dest))
    .pipe(gulp.dest(dest));
  });
};
