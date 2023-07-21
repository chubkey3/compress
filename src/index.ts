import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import CompressFn from './types/CompressFn';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';


const compressFn: CompressFn = async (files) => {

  let compressed: File[] = [];

  for (const file of files) {
    let arrayBuffer = await file.arrayBuffer()

    let buffer = Buffer.alloc(arrayBuffer.byteLength)      
    let view = new Uint8Array(arrayBuffer)

    for (let i = 0; i<buffer.length; i++) {
      buffer[i] = view[i]
    }

    let compressedBuffer = await imagemin.buffer(buffer, {plugins: [
      imageminMozjpeg(),
      imageminPngquant(),
      imageminGifsicle(),
      imageminSvgo()
    ]})

    let compressedFile = new File([compressedBuffer], file.name, {lastModified: file.lastModified, type: file.type})

    compressed.push(compressedFile)
  }    

  return compressed

}

export default compressFn;