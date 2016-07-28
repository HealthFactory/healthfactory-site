'use strict';

var sftp = require('gulp-sftp');
var changed = require('gulp-changed');
var path = require('path');

module.exports = function (gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;
  var entries = config.entries;

  var user = '4249580';
  var sshKey = '/Users/sebmade/.ssh/hhgandi_rsa';
  var vhost = args.production ? 'healthfactory.io' : 'test.healthfactory.io';

  gulp.task('deploy', function () {
    return gulp.src(path.join(taskTarget, '**/*'))
      .pipe(changed('.'+taskTarget))
      .pipe(gulp.dest('.'.taskTarget))
      .pipe(sftp({
        host: 'sftp.dc0.gpaas.net',
        user: user,
        key: sshKey,
        remotePath: 'vhosts/' + vhost + '/htdocs'
      }));
  });

};
