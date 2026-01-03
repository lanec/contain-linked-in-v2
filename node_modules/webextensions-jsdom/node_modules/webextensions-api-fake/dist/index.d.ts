import { BrowserMock } from 'webextensions-api-mock';
import { BrowserFake, WebExtensionsApiFakeOptions } from './types';
export declare class WebExtensionsApiFake {
    private apis;
    constructor(options?: {});
    createBrowser(): BrowserMock;
    fakeApi(browser: BrowserFake): void;
}
declare const _default: (options?: WebExtensionsApiFakeOptions) => BrowserFake;
export default _default;
export * from './types';
