import parseSize from "./parseSize"

export type PrintOutputArgs = (
    inputDir: string,
    outputDir: string,
    completedFiles: number,
    beforeSize: number,
    afterSize: number
) => void

const printOutput: PrintOutputArgs = (inputDir, outputDir, completedFiles, beforeSize, afterSize) => {
    const line = '-'.repeat(process.stdout.columns)
    console.log(line)
    console.log('InputDir:', inputDir)
    console.log('OutputDir:', outputDir)
    console.log('Total Files:', completedFiles)
    console.log('Total Reduction:', "\x1b[31m" + parseSize(beforeSize) + "\x1b[0m", '->', "\x1b[32m" + parseSize(afterSize) + "\x1b[0m")
}

export default printOutput;