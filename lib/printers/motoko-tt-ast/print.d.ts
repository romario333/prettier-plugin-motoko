import { TokenTree } from './../../parsers/motoko-tt-parse/parse';
import type { AstPath, Doc, ParserOptions } from 'prettier';
export declare type Space = ('nil' | 'space' | 'line' | 'softline' | 'hardline' | 'wrap' | 'softwrap' | 'keep' | 'keep-space') | Space[];
export declare function parseSpace(input: Space, a: TokenTree, b: TokenTree, leftMap: Map<TokenTree, TokenTree>, rightMap: Map<TokenTree, TokenTree>): Doc;
export default function print(path: AstPath<any>, options: ParserOptions<any>, print: (path: AstPath<any>) => Doc, args?: unknown): Doc;
//# sourceMappingURL=print.d.ts.map