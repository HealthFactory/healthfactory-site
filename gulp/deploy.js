'use strict';

var path = require('path');
var SSH = require('gulp-ssh');

module.exports = function (gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;
  var entries = config.entries;

  var user = '4249580';
  var sshKey = '/Users/sebmade/.ssh/hhgandi_rsa';
  var vhost = (args.production && !args.undertest) ? 'healthfactory.io' : 'test.healthfactory.io';

  gulp.task('deploy', function() {
    return gulp.start('sftp');
  })

  gulp.task('ssh', function () {
    var config = {host: 'git.dc0.gpaas.net', user: user, privateKey: require('fs').readFileSync(sshKey)};
    var s = new SSH({ignoreErrors: false, sshConfig: config});
    return s.exec(['deploy '+vhost+'.git gh-pages'], {filePath: 'commands.log'})
      .pipe(gulp.dest('logs'))
      .on('end', function() {
        s.close();
      });
  });

  gulp.task('push', function () {
    return gulp.src([path.join('build', '/**'), '!'+path.join('build', '/htdocs/data/**')])
      .pipe(plugins.ghPages());
  });

  gulp.task('sftp', function () {
    return gulp.src([path.join(taskTarget,'/**'),  '!'+path.join(taskTarget, '\.DS_Store')], {dot: true})
      .pipe(plugins.changed('.'+taskTarget, {hasChanged: plugins.changed.compareSha1Digest}))
      .pipe(gulp.dest('.'+taskTarget))
      .pipe(plugins.sftp({
        host: 'sftp.dc0.gpaas.net',
        user: user,
        key: sshKey,
        remotePath: 'vhosts/' + vhost + '/htdocs'
      }));
  });

  gulp.task('data', function () {
    return gulp.src('data/*.pdf')
      .pipe(plugins.changed('.data', {hasChanged: plugins.changed.compareSha1Digest}))
      .pipe(gulp.dest('.data'))
      .pipe(plugins.sftp({
        host: 'sftp.dc0.gpaas.net',
        user: user,
        key: sshKey,
        remotePath: 'vhosts/healthfactory.io/htdocs/data'
      }));
  });
};
