This script crawls the project dir, looking for `.styl` files, then generates them into native css, with namespaced classnames, and exposes the `<styles>` jsx component and classname dictionary, via a `styles.js` in the same directory.

Signatures of source `.styl` files are kept, so that only changes are processed.
