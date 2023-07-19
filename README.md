# Compress
A lightweight CLI tool for compressing image files and converting them to the webp format. Built on top of the imagemin library with added functionality such as preserving folder structure.

# Installation

```npm install -g @chubkey/compress```

# Usage

Once installed, the CLI tool can be used by typing ```compress``` into a terminal.

### Options

The library comes with a couple configuration flags used to direct the tool to your needs.

| Option | Description | Default Value | Example |
| --- | --- | --- | --- |
| --quality | Configures quality of the output when using lossy compression | 75 | --quality=80 |
| --webp | Converts files into webp format | false | --webp=true |
| --lossy | Specifies if compression should be lossy (true) or loseless (false) | true | --lossy=true |

# Examples

```compress images compressed_images```

```compress --quality=85 --webp=true images compressed_images```

```compress --lossy=false images compressed_images```

# License

This libary uses the [MIT License](https://github.com/chubkey3/react-image-uploader/blob/master/LICENSE).
