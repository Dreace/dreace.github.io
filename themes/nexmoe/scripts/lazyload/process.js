'use strict';

function lazyProcess(htmlContent) {
    const cdn = this.config.imgCDN && this.config.imgCDN.enable ? this.config.imgCDN.url : '';
    return htmlContent.replace(/<img\b[^>]*>/gi, (tag) => {
        if (cdn) tag = tag.replace(/\bsrc="(.*?)"/i, (_, src) => `src="${cdn + src}"`);
        if (!/\bloading=/i.test(tag)) tag = tag.replace(/\s*\/?>$/, ' loading="lazy">');
        if (!/\bdecoding=/i.test(tag)) tag = tag.replace(/\s*\/?>$/, ' decoding="async">');
        return tag;
    });
}

module.exports.processPost = function (data) {
    data.content = lazyProcess.call(this, data.content);
    return data;
};

module.exports.processSite = function (htmlContent) {
    return lazyProcess.call(this, htmlContent);
};
