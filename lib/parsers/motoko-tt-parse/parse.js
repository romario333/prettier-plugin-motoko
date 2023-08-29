"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wasm_1 = __importDefault(require("../../wasm"));
const preprocess_1 = __importDefault(require("./preprocess"));
function parse(text, parsers, options) {
    if (arguments.length === 2) {
        options = parsers;
        parsers = {};
    }
    text = (0, preprocess_1.default)(text, options);
    const tt = wasm_1.default.parse_token_tree(text.trim());
    // console.log(tt);
    return tt;
}
exports.default = parse;
//# sourceMappingURL=parse.js.map