var path      = require("path");
var nunjucks  = require("nunjucks");
var fs        = require("fs-extra");
var sourceDir = path.join(__dirname, 'templates');
var env       = nunjucks.configure(sourceDir, { autoescape: false });

var ignores   = ['xcuserdata', 'Pods', 'Podfile.lock'];

function sourceFiles(src) {
  var files  = fs.readdirSync(src);
  var result = [];

  files.forEach(function (filename) {
      var stat   = fs.lstatSync(src + '/' + filename);
      var ignore = false;

      ignores.forEach(function(ignoredFile) {
        if (ignoredFile === filename) {
          ignore = true;
        }
      });

      if (!ignore && stat.isDirectory()) {
          var children = sourceFiles(src + '/' + filename);
          if (children && children.length > 0) {
            result = result.concat(children);
          }
      } else if (!ignore){
          result.push(src + '/' + filename);
      }
  });

  return result;
}

function generateTarget (src, context) {
  var fullDir   = path.join(sourceDir, src);
  var files     = sourceFiles(fullDir);
  var targetDir = path.join(process.cwd(), context.appName);

  if (fs.existsSync(targetDir)) {
    fs.removeSync(targetDir);
  }

  files.forEach(function(file) {
    var relativeFile = file.substring(fullDir.length + 1);
    generateTargetFile(src, relativeFile, targetDir, context)
  });

  return targetDir;
}

function generateTargetFile (src, file, targetDir, context) {
  var ext        = path.extname(file);
  var content    = nunjucks.render(src + "/" + file, context);
  content        = content.replace(/entree/g, context.appName);
  var targetFile = file.replace(/entree/g, context.appName);
  var target     = path.join(targetDir, targetFile);
  var destDir    = path.dirname(target);

  fs.mkdirsSync(destDir);
  fs.writeFileSync(target, content);
}

module.exports = {
  generateTarget: function(src, context) {
    return generateTarget(src, context);
  }
}
