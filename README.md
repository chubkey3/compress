# Compress
A lightweight CLI tool for compressing image files and converting them to the webp format. Built on top of the imagemin library with added functionality such as preserving folder structure.

## Installation

```npm install -g @chubkey/compress```

## Usage

Once installed, the CLI tool can be used by typing ```compress``` into a terminal.

### Options

The library comes with a couple configuration flags used to direct the tool to your needs. Options should always come before the input/output directory.

Format: ```compress [options] <inputDir> <outputDir>```

| Option | Description |
| --- | --- |
| ```--quality=<quality>``` | Configures quality of the output when using lossy compression (default=75) |
| ```--webp``` | Enables webp conversion |
| ```--lossless``` | Use loseless over lossy compression |
## Examples

```compress images compressed_images```

```compress --quality=85 --webp images compressed_images```

```compress --lossless images compressed_images```

## License

This libary uses the [MIT License](https://github.com/chubkey3/compress/blob/master/LICENSE).
