import path from "path";
import fs from "fs";

export default function search(dir: string, done: (err: NodeJS.ErrnoException | null, results?: string[]) => void) {
    var results: string[] = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(_err, stat) {
          if (stat && stat.isDirectory()) {
            search(file, function(_err, res) {
              if (res) {
                results = results.concat(res);
                if (!--pending) done(null, results);
              }              
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };