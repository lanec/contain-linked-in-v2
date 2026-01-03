"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    const mozExtProtocol = 'moz-extension:';
    return {
        fakeApi(browser) {
            const runtime = {
                getURL(path) {
                    if (!path) {
                        return `${mozExtProtocol}//fake/`;
                    }
                    if (path.startsWith('//')) {
                        return `${mozExtProtocol}${path}`;
                    }
                    if (path.startsWith('/')) {
                        return `${mozExtProtocol}//fake${path}`;
                    }
                    return `${mozExtProtocol}//fake/${path}`;
                },
                async getBrowserInfo() {
                    return {
                        name: 'Firefox',
                        vendor: 'Mozilla',
                        version: '51.0',
                        buildID: '20161018004015',
                    };
                },
            };
            browser.runtime.getURL.callsFake(runtime.getURL);
            browser.runtime._getURL = runtime.getURL;
            browser.runtime.getBrowserInfo.callsFake(runtime.getBrowserInfo);
            browser.runtime._getBrowserInfo = runtime.getBrowserInfo;
        },
    };
};
