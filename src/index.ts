#!/usr/bin/env node
import imagemin, { Plugin } from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import fs from 'fs';
import path from 'path';
import { parseSize, printOutput, search } from './lib';
import CompressOptions from './types/CompressOptions';


let beforeSize = 0;
let afterSize = 0;

let completedFiles = 0;
let totalFiles = 0;

let inputDir = "";
let outputDir = "";


function compress(file: string, dest: string, options: CompressOptions) {
  let plugins: Plugin[] = [];

  if (options.webp) {
    plugins.push(imageminWebp({quality: options.quality}))

  } else if (options.lossy) {
    plugins.push(imageminMozjpeg({quality: options.quality}))
    plugins.push(imageminPngquant({quality: [options.quality/100, 1]}))
    
  } else {
    plugins.push(imageminJpegtran())
    plugins.push(imageminOptipng())
  }

  if (file.indexOf(" ") >= 0) {
    fs.readFile(file, async (_err, data) => {
        
      const processedBuf = await imagemin.buffer(data, {plugins: plugins})          
  
      fs.writeFile(path.join(process.cwd(), dest, file.split(path.sep).at(-1) || ""), processedBuf, () => {
  
        const stats = fs.statSync(file);
  
        beforeSize = beforeSize + stats.size;
        afterSize = afterSize + processedBuf.byteLength;
        completedFiles = completedFiles + 1;
  
        console.log(file.split(path.sep).at(-1), ':', "\x1b[31m" + parseSize(stats.size) + "\x1b[0m", '->', "\x1b[32m" + parseSize(processedBuf.byteLength) + "\x1b[0m");
  
        if (completedFiles === totalFiles) {
            printOutput(inputDir, outputDir, completedFiles, beforeSize, afterSize);
        }
  
      })
    })
  } else {
    imagemin([file], {
      destination: dest,
      plugins: plugins  
    }).then((result) => {
      const stats = fs.statSync(file) 
  
      beforeSize = beforeSize + stats.size;
      afterSize = afterSize + result[0].data.byteLength;
  
      completedFiles = completedFiles + 1;
  
      console.log(file.split('/').at(-1), ':', "\x1b[31m" + parseSize(stats.size) + "\x1b[0m", '->', "\x1b[32m" + parseSize(result[0].data.byteLength) + "\x1b[0m") 
  
      if (completedFiles === totalFiles) {
        printOutput(inputDir, outputDir, completedFiles, beforeSize, afterSize)
      }
    })
  }      
}


const main = async (args: string[]) => {

  if (args.indexOf('--help') > -1) {
    console.log('Usage: compress <inputDir> [outputDir]')
    console.log('Compresses images in input directory while perserving file structure. Can optionally be used to convert png/jpeg formats to webp.')
    console.log()
    console.log('Options: ')
    console.log('--quality | Used to specify a quality of output images when using lossy compression')
    console.log('e.g --quality=75 for 75% max conversion quality')
    console.log()
    console.log('--webp | Specify if files should be converted & compressed to webp instead of png/jpeg')
    console.log('e.g --webp=true for webp conversion')
    console.log()
    console.log('--lossy | Used to direct the converter to use lossy or loseless compression. Lossy compression is on by default and generates higher savings of filesize.')
    console.log('e.g --lossy=false for loseless compression')
    console.log()

  } else if (args.length <= 3) {
        console.log('compress: must provide an input and output path to compress')
        console.log('run `compress --help` for usage information')

    } else {

        //io directories
        inputDir = args.at(-2) || "";
        outputDir = args.at(-1) || "";

        //options
        let quality = 75;
        let webp = false;
        let lossy = true;

        //iterate through args
        for (const arg of args.slice(2, args.length - 2)) {
            let cmd = arg.split('=')[0];
            let value = arg.split('=')[1];

            switch(cmd) {
                case '--quality':
                    quality = parseInt(value);
                    break;

                case '--webp':
                    webp = true;
                    break;

                case '--lossy':
                    lossy = (value === 'true') 
                    break;
                default:
                    console.log("Invalid arguement `" + arg + "`")
                    return;
            }
        }

        let options = {
            lossy: lossy,
            webp: webp,
            quality: quality
        }

        fs.rmSync(outputDir, { force: true, recursive: true });
        fs.mkdirSync(outputDir);

        let isFile = fs.lstatSync(inputDir).isFile();

        if (isFile) {
          compress(inputDir, path.join(outputDir, inputDir.split(path.sep).slice(0, -1).join('/')), options)

        } else {
          search(inputDir, function(err, results) {
            if (err || !results) {
                console.log('No such file/directory', inputDir);
                return;
            }
            
            totalFiles = Object.keys(results).length
          
            for (let i = 0; i<Object.keys(results).length; i++){
              if (results[i].endsWith('.png') || results[i].endsWith('.jpg') || results[i].endsWith('jpeg')) {
                compress(results[i], path.join(outputDir, path.relative(path.join(process.cwd(), inputDir), results[i]).split(path.sep).slice(0, -1).join('/')), options)
              }              
            }    
          })
        }        
    } 
}

main(process.argv)

export default main;