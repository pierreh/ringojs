/**
 * @fileOverview A collection of file related utilities.
 */

export ('resolve', 'resolveRelative', 'createTempFile');

/**
 * Resolve an arbitrary number of path elements relative to each other.
 * This is an adapted version of the file module's resolve function that always
 * and strictly uses forward slashes as file separators. This makes it
 * usable for resolving module ids, resource paths, and URI paths.
 * Originally adapted for helma/file from narwhal's file module.
 */
function resolve() {
    var root = '';
    var elements = [];
    var leaf = '';
    var path;
    var SEPARATOR = '/';
    var SEPARATOR_RE = /\//;
    for (var i = 0; i < arguments.length; i++) {
        path = String(arguments[i]);
        if (path.trim() == '') {
            continue;
        }
        var parts = path.split(SEPARATOR_RE);
        if (path[0] == '/') {
            // path is absolute, throw away everyting we have so far
            root = parts.shift() + SEPARATOR;
            elements = [];
        }
        leaf = parts.pop();
        if (leaf == '.' || leaf == '..') {
            parts.push(leaf);
            leaf = '';
        }
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];
            if (part == '..') {
                if (elements.length > 0 && elements.peek() != '..') {
                    elements.pop();
                } else if (!root) {
                    elements.push(part);
                }
            } else if (part != '' && part != '.') {
                elements.push(part);
            }
        }
    }
    path = elements.join(SEPARATOR);
    if (path.length > 0) {
        leaf = SEPARATOR + leaf;
    }
    return root + path + leaf;
}

/**
 * Resolve path fragment child relative to parent but only
 * if child is a a relative path according to the Securable Modules
 * spec, i.e. starts with "." or "..". Otherwise, the child path
 * is returned unchanged.
 *
 * @param {String} parent the parent path
 * @param {String} child the child path
 */
function resolveRelative(parent, child) {
    return child.startsWith(".") ?
           resolve(parent, child) : child;
}

/**
 * Create a new empty temporary file in the default directory for temporary files.
 * @param {String} prefix the prefix of the temporary file; must be at least three characters long
 * @param {String} suffix the suffix of the temporary file; may be null
 * @returns {File} the temporary file
 */
function createTempFile(prefix, suffix) {
   return java.io.File
       .createTempFile(prefix, suffix || null)
       .getPath();
}
