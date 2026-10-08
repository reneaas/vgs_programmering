# FBD SVG math renderer

An isolated MathJax 3.2.1 TeX/SVG bundle, loaded only for downloads. Each
formula contains its own glyph paths (`fontCache: 'none'`), so exported SVGs
need neither HTML foreignObject support nor fonts. It does not configure or
replace the page's MathJax instance. License: Apache-2.0 (see LICENSE).

Rebuild from this directory using Node.js:

```sh
npm install --prefix /tmp/fbd-math-build mathjax-full@3.2.1 esbuild@0.28.2
NODE_PATH=/tmp/fbd-math-build/node_modules /tmp/fbd-math-build/node_modules/.bin/esbuild entry.js --bundle --minify --format=iife --global-name=MunchFbdMathSvg '--define:PACKAGE_VERSION="3.2.1"' --outfile=tex-svg.min.js
```

`entry.js` records the included TeX packages. The version define avoids
MathJax's Node-only runtime package lookup in the browser build.
