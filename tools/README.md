## Asset conversion/generation scripts

**/gallerygen/convert.sh** - Generates galleries and metadata files from images in directories located in the _in_ folder and outputs into _out_, automatically copies over updated files to the _\_site_ folder.

**/thumbgen/convert.sh** - Converts media files in the _in_ folder into thumbnails in web-friendly formats and outputs into _out_, automatically copies over updated files to the _\_site_ folder.

**/visualgen/convert.sh** - Converts media files in the _in_ folder into web-friendly formats and outputs into _out_, automatically copies over updated files to the _\_site_ folder.

**all.sh** - Runs all of the above 

**pngdesc.sh** - Changes PNG Description tEXt chunk

`./pngdesc.sh [description] [files...]`


**massren.sh** - Renames files in order of modified date in the `[prefix]_[order].[ext]` format.

`./massren.sh [prefix] [files...]`
