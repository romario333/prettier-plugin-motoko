"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withoutLineBreaks = exports.getToken = exports.getTokenText = exports.getTokenTreeText = void 0;
/// Get the unmodified source text from a TokenTree
function getTokenTreeText(tree) {
    if (tree.token_tree_type === 'Group') {
        const [trees, _, pair] = tree.data;
        const results = trees.map((tt) => getTokenTreeText(tt));
        return (pair
            ? [
                getTokenText(pair[0][0]),
                ...results,
                getTokenText(pair[1][0]),
            ]
            : results).join('');
    }
    if (tree.token_tree_type === 'Token') {
        return getTokenText(tree.data[0]);
    }
    throw new Error(`Unexpected token tree: ${JSON.stringify(tree)}`);
}
exports.getTokenTreeText = getTokenTreeText;
/// Get the unmodified source text from a Token
function getTokenText(token) {
    if (Array.isArray(token.data)) {
        return token.data[0];
    }
    else {
        return token.data;
    }
}
exports.getTokenText = getTokenText;
/// Unwrap a single Token from a TokenTree
function getToken(tree) {
    if (tree && tree.token_tree_type === 'Token') {
        return tree.data[0];
    }
}
exports.getToken = getToken;
/// Remove all line breaks from a Doc
function withoutLineBreaks(doc) {
    if (Array.isArray(doc)) {
        return doc.map((d) => withoutLineBreaks(d));
    }
    if (typeof doc === 'object') {
        switch (doc.type) {
            case 'align':
            case 'group':
            case 'indent':
            case 'line-suffix':
                return withoutLineBreaks(doc.contents);
            case 'fill':
                return withoutLineBreaks(doc.parts);
            case 'line':
                return doc.soft ? [] : ' ';
            case 'if-break':
                return withoutLineBreaks(doc.flatContents);
            case 'break-parent':
            case 'line-suffix-boundary': // TODO test
                return [];
        }
    }
    return doc || [];
}
exports.withoutLineBreaks = withoutLineBreaks;
//# sourceMappingURL=utils.js.map