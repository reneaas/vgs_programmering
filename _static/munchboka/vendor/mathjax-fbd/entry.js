// Isolated MathJax renderer for portable FBD exports; does not touch window.MathJax.
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax-full/js/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax-full/js/input/tex/color/ColorConfiguration.js';
import 'mathjax-full/js/input/tex/cancel/CancelConfiguration.js';
import 'mathjax-full/js/input/tex/braket/BraketConfiguration.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const document = mathjax.document('', {
    InputJax: new TeX({packages: ['base', 'ams', 'boldsymbol', 'newcommand', 'color', 'cancel', 'braket']}),
    OutputJax: new SVG({fontCache: 'none'})
});

export function render(source) {
    const container = document.convert(source, {display: false});
    return adaptor.outerHTML(adaptor.firstChild(container));
}
