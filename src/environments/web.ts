import { setWasm } from './../wasm';
import * as wasm from '../../wasm/pkg/bundler/wasm';

// @ts-ignore
wasm.default.then(w => {
    setWasm(w);
})


export * from '..';
