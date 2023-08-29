"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesTokenTreeMatchPattern = void 0;
const wasm_1 = __importDefault(require("../../wasm"));
const utils_1 = require("./utils");
function doesTokenTreeMatchPattern(pattern, trees, index, group) {
    const tt = trees[index];
    if (!tt) {
        return false;
    }
    if (pattern === '_') {
        return true;
    }
    if (typeof pattern === 'function') {
        return pattern(tt);
    }
    if (tt.token_tree_type === pattern) {
        return true;
    }
    if (typeof pattern === 'object' && pattern.main) {
        if (pattern.main &&
            !doesTokenTreeMatchPattern(pattern.main, trees, index, group)) {
            return false;
        }
        if (pattern.left &&
            !doesTokenTreeMatchPattern(pattern.left, trees, index - 1, group)) {
            return false;
        }
        if (pattern.right &&
            !doesTokenTreeMatchPattern(pattern.right, trees, index + 1, group)) {
            return false;
        }
        if (pattern.groups && !pattern.groups.some((g) => g === group)) {
            return false;
        }
        return true;
    }
    if (tt.token_tree_type === 'Token') {
        const token = tt.data[0];
        return token.token_type === pattern;
    }
    if (tt.token_tree_type === 'Group') {
        return tt.data[1] === pattern;
    }
    throw new Error(`Unexpected pattern: ${pattern}`);
}
exports.doesTokenTreeMatchPattern = doesTokenTreeMatchPattern;
const keyword = (tt) => {
    if (tt.token_tree_type === 'Token') {
        const [token] = tt.data;
        if (token.token_type === 'Ident' && wasm_1.default.is_keyword(token.data)) {
            return true;
        }
    }
    return false;
};
const token = (fn) => (tt) => {
    const token = (0, utils_1.getToken)(tt);
    return !!token && fn(token);
};
const tokenEquals = (data) => token((token) => (0, utils_1.getTokenText)(token) === data);
const tokenStartsWith = (start) => token((token) => (0, utils_1.getTokenText)(token).startsWith(start));
const tokenEndsWith = (end) => token((token) => (0, utils_1.getTokenText)(token).endsWith(end));
// match both "block comments" and "comment groups" (lexer implementation detail)
const blockComment = (tt) => tt.token_tree_type === 'Group'
    ? tt.data[1] === 'Comment'
    : (0, utils_1.getToken)(tt).token_type === 'BlockComment';
const spaceConfig = {
    // whitespace rules, prioritized from top to bottom
    rules: [
        // whitespace / comment tokens
        ['LineComment', '_', 'hardline'],
        ['MultiLine', '_', 'hardline'],
        ['_', 'MultiLine', 'hardline'],
        ['Space', '_', 'nil'],
        ['_', 'Space', 'nil'],
        ['Line', '_', 'nil'],
        ['_', 'Line', 'nil'],
        ['_', 'LineComment', 'keep-space'],
        ['_', blockComment, 'keep-space'],
        [blockComment, 'Delim', 'keep'],
        [blockComment, '_', 'keep-space'],
        ['_', tokenStartsWith(' '), 'nil'],
        [tokenEndsWith(' '), '_', 'nil'],
        // delimiters
        ['_', 'Delim', 'nil'],
        ['Delim', '_', 'line'],
        // ['Delim', 'Line', 'nil'],
        // if-then expressions
        [{ left: tokenEquals('if'), main: '_' }, 'Paren', 'space'],
        // unary operators
        [tokenEquals('+'), '_', 'keep'],
        [tokenEquals('-'), '_', 'keep'],
        [tokenEquals('^'), '_', 'keep'],
        // [tokenEquals('#'), 'Ident', 'keep'],
        // tags and concatenation
        ['_', tokenEquals('#'), 'keep-space'],
        [tokenEquals('#'), 'Ident', 'keep'],
        [tokenEquals('#'), '_', 'keep-space'],
        // 'with' keyword
        [tokenEquals('with'), '_', 'keep-space'],
        // logical and pipe operators
        [
            { main: tokenEquals('and'), groups: ['Paren', 'Square'] },
            '_',
            'keep-space',
        ],
        [
            { main: tokenEquals('or'), groups: ['Paren', 'Square'] },
            '_',
            'keep-space',
        ],
        ['_', tokenEquals('|>'), 'keep-space'],
        // soft-wrapping operators
        ['_', 'Dot', 'nil'],
        // ['_', 'Dot', 'softwrap'],
        ['Dot', '_', 'nil'],
        ['Assign', '_', 'space'],
        // prefix/postfix operators
        [{ left: tokenEquals('do'), main: tokenEquals('?') }, '_', 'space'],
        // [tokenEquals('?'), 'Curly', 'keep'],
        [tokenEquals('?'), '_', 'nil'],
        ['_', tokenEquals('!'), 'nil'],
        // space between identifier and group
        [tokenEquals('func'), 'Paren', 'nil'],
        [tokenEquals('func'), 'Angle', 'nil'],
        [keyword, 'Group', 'space'],
        ['Ident', 'Paren', 'nil'],
        ['Ident', 'Square', 'nil'],
        ['Ident', 'Angle', 'nil'],
        // space after dot
        [tokenEndsWith('.'), 'Ident', 'keep'],
        // `async*` / `await*`
        [tokenEquals('async'), tokenEquals('*'), 'nil'],
        [tokenEquals('await'), tokenEquals('*'), 'nil'],
        // groups
        ['Group', 'Paren', 'nil'],
        ['Group', 'Square', 'nil'],
        ['Angle', 'Paren', 'nil'],
        // open/close tokens
        ['Open', '_', 'nil'],
        ['_', 'Close', 'nil'],
        // identifier after float in exponential notation (fixes #74)
        [
            token((token) => token.token_type === 'Literal' &&
                /\.[a-z]/i.test(token.data[0])),
            'Ident',
            'keep',
        ],
        // misc
        [tokenEquals('@'), '_', 'keep'],
        // default
        ['_', '_', 'space'],
    ],
};
exports.default = spaceConfig;
//# sourceMappingURL=spaceConfig.js.map