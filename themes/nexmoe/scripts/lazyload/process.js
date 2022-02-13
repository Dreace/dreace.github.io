'use strict';

function lazyProcess(htmlContent) {
    let loadingImage = this.config.lazyload.loadingImg
    let CNDUrl = this.config.imgCDN && this.config.imgCDN.enable ? this.config.imgCDN.url : '';
    return htmlContent.replace(/<img(\s*?)src="(.*?)"(.*?)>/gi, (str, beforeClassStr, srcStr, afterClassStr) => {
        if (/data-src/gi.test(str)) {
            return str;
        }
        str = str.replace(/alt>/gi, ">");
        if (/class="(.*?)"/gi.test(str)) {
            str = str.replace(/class="(.*?)"/gi, (classStrAll, classStr) => {
                return classStrAll.replace(classStr, `${classStr} lazyload`);
            })
            return str.replace(`src="${srcStr}"`, `src="${loadingImage}" data-src="${CNDUrl + srcStr}"`);
        }
        return str.replace(`src="${srcStr}"`, `class="lazyload" src="${loadingImage}" data-src="${CNDUrl + srcStr}"`);
    });
}

module.exports.processPost = function (data) {
    data.content = lazyProcess.call(this, data.content);
    return data;
};

module.exports.processSite = function (htmlContent) {
    return lazyProcess.call(this, htmlContent);
};
