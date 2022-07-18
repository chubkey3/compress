import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'

function compress(file, dest){
  imagemin([file], {
    destination: dest,
    plugins: [imageminWebp({quality: process.env.QUALITY || 75})]
  })

  console.log(`Converted  ${file.split(path.sep).at(-1)}  to webp.`)
}


function search(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          search(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

search(process.env.TARGET || path.join(process.cwd(), 'images'), function(err, results) {
  if (err) throw err;
  for (let i = 0; i<Object.keys(results).length; i++){
    compress(results[i], path.join((process.env.DEST || path.join(process.cwd(), 'compressed') ), path.relative(process.env.TARGET || path.join(process.cwd(), 'images'), results[i]).split(path.sep).slice(0, -1).join('/')))
  }
});