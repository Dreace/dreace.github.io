'use strict';
if (!hexo.config.lazyload || !hexo.config.lazyload.enable) {
    return;
}
if (hexo.config.lazyload.onlypost) {
    hexo.extend.filter.register('after_post_render', require('./process').processPost);
} else {
    hexo.extend.filter.register('after_render:html', require('./process').processSite);
}
