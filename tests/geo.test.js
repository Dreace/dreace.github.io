'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const moment = require('moment');
const images = require('../themes/nexmoe/scripts/lazyload/process');

let metadata;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../themes/nexmoe/scripts/geo.js'), 'utf8'), {
  require, URL,
  hexo: { extend: { helper: { register: (name, helper) => { metadata = helper; } } } }
});

function context(page, overrides) {
  return Object.assign({
    config: { url: 'https://blog.dreace.top', title: 'Blog', author: 'Dreace', language: 'zh-CN', description: 'Site summary' },
    page, url_for: value => '/' + value,
    is_archive: () => false, is_category: () => false, is_tag: () => false,
    is_post: () => true, is_page: () => false
  }, overrides);
}

const post = {
  title: 'Example </script><script>unexpected</script>', path: '2020/example/index.html',
  content: '<p>Article summary</p><img src="/images/photo.png">', lang: 'en',
  date: moment.utc('2020-01-02'), updated: moment.utc('2026-10-25')
};
const result = metadata.call(context(post));
const graph = JSON.parse(result.json)['@graph'];
const article = graph.find(node => node['@type'] === 'BlogPosting');
assert.strictEqual(result.canonical, 'https://blog.dreace.top/2020/example/');
assert.strictEqual(result.description, 'Article summary');
assert.strictEqual(result.language, 'en');
assert.strictEqual(graph.find(node => node['@type'] === 'WebSite').inLanguage, 'zh-CN');
assert.strictEqual(article.headline, post.title);
assert.strictEqual(article.datePublished, '2020-01-02T00:00:00.000Z');
assert.strictEqual(article.image, 'https://blog.dreace.top/images/photo.png');
// Rebuilding must not turn a filesystem timestamp into a content update.
assert.strictEqual(Object.prototype.hasOwnProperty.call(article, 'dateModified'), false);
assert.strictEqual(result.json.includes('</script>'), false);

for (const exclusion of [{ noindex: true }, { robots: 'noindex, follow' }]) {
  const privatePage = metadata.call(context(Object.assign({}, post, exclusion)));
  assert.strictEqual(privatePage.noindex, true);
  assert.deepStrictEqual(JSON.parse(privatePage.json)['@graph'].map(node => node['@type']), ['Person', 'WebSite', 'WebPage']);
}
const archive = metadata.call(context({ path: 'archives/2020/page/2/index.html', year: 2020, current: 2 }, { is_archive: () => true, is_post: () => false }));
assert.strictEqual(archive.title, '文章归档：2020 - Blog - 第 2 页');
const friends = metadata.call(context({ title: '友情链接', path: 'friends.html' }, { is_post: () => false, is_page: () => true }));
assert.strictEqual(friends.canonical, 'https://blog.dreace.top/friends');

const markup = '<img src="/images/photo.png" alt="示例" width="100"><img src="https://example.org/photo.jpg" loading="eager" decoding="sync">';
const processed = images.processSite.call({ config: {} }, markup);
assert.strictEqual(processed, '<img src="/images/photo.png" alt="示例" width="100" loading="lazy" decoding="async"><img src="https://example.org/photo.jpg" loading="eager" decoding="sync">');
assert.strictEqual(images.processSite.call({ config: {} }, processed), processed);
assert.strictEqual(images.processPost.call({ config: {} }, { content: markup }).content, processed);
console.log('GEO logic tests passed');
