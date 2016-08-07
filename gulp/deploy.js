'use strict';

var sftp = require('gulp-sftp');
var changed = require('gulp-changed');
var ghPages = require('gulp-gh-pages');
var path = require('path');

module.exports = function (gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;
  var entries = config.entries;

  var user = '4249580';
  var sshKey = '/Users/sebmade/.ssh/hhgandi_rsa';
  var vhost = args.production ? 'healthfactory.io' : 'test.healthfactory.io';

  gulp.task('deploy', function () {
    return gulp.src([path.join(taskTarget, '**/*'), '!'+path.join(taskTarget, 'data/')])
      .pipe(ghPages())
      .pipe(gulp.src(taskTarget+'/data/*'))
      .pipe(gulp.changed('.'+taskTarget+'/data/*'))
      .pipe(sftp({
        host: 'sftp.dc0.gpaas.net',
        user: user,
        key: sshKey,
        remotePath: 'vhosts/' + vhost + '/htdocs/data'
      }));
  });

};
