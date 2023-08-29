import { Space } from './print';
import { Token, TokenTree, GroupType } from '../../parsers/motoko-tt-parse/parse';
declare type Pattern = Token['token_type'] | TokenTree['token_tree_type'] | GroupType | ((tt: TokenTree) => boolean) | {
    main: Pattern;
    left?: Pattern;
    right?: Pattern;
    groups?: GroupType[];
} | '_';
interface SpaceConfig {
    rules: [Pattern, Pattern, Space][];
}
export declare function doesTokenTreeMatchPattern(pattern: Pattern, trees: TokenTree[], index: number, group: GroupType): boolean;
declare const spaceConfig: SpaceConfig;
export default spaceConfig;
//# sourceMappingURL=spaceConfig.d.ts.map