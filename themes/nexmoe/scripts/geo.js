'use strict';

const cheerio = require('cheerio');

function text(value) {
  return cheerio.load(String(value || '')).text().replace(/\s+/g, ' ').trim();
}

hexo.extend.helper.register('geo_metadata', function () {
  const page = this.page;
  const config = this.config;
  const base = config.url.replace(/\/$/, '') + '/';
  const canonical = new URL(this.url_for(page.path || '').replace(/index\.html$/, '').replace(/\.html$/, ''), base).href;
  const language = String(page.lang || page.language || config.language || 'zh-CN').replace(/_/g, '-');
  let heading = page.title || config.title;
  if (this.is_archive()) heading = '文章归档' + (page.year ? '：' + page.year + (page.month ? '/' + page.month : '') : '');
  if (this.is_category()) heading = '分类：' + page.category;
  if (this.is_tag()) heading = '标签：' + page.tag;
  const pagination = page.current > 1 ? ' - 第 ' + page.current + ' 页' : '';
  const title = (heading === config.title ? heading : heading + ' - ' + config.title) + pagination;
  const description = text(page.description || page.excerpt || (this.is_post() || this.is_page() ? page.content : '') || (heading === config.title ? config.description : heading + '，' + config.title + '的文章列表。')).slice(0, 200);
  const noindex = page.noindex === true || /\bnoindex\b/i.test(String(page.robots || ''));
  const person = { '@type': 'Person', '@id': base + '#author', name: config.author, url: base };
  const graph = [person,
    { '@type': 'WebSite', '@id': base + '#website', url: base, name: config.title, description: config.description, inLanguage: config.language.replace(/_/g, '-'), publisher: { '@id': person['@id'] } },
    { '@type': page.posts ? 'CollectionPage' : 'WebPage', '@id': canonical + '#webpage', url: canonical, name: title, description, inLanguage: language, isPartOf: { '@id': base + '#website' } }
  ];
  if (this.is_post() && !noindex) {
    const article = { '@type': 'BlogPosting', '@id': canonical + '#article', headline: page.title, description, url: canonical, inLanguage: language, author: { '@id': person['@id'] }, mainEntityOfPage: { '@id': canonical + '#webpage' } };
    if (page.date && page.date.isValid()) article.datePublished = page.date.toISOString();
    const image = cheerio.load(page.content || '').root().find('img[src]').first().attr('src');
    if (image && !/^data:/i.test(image)) article.image = new URL(image, base).href;
    graph[2].mainEntity = { '@id': article['@id'] };
    graph.push(article);
  }
  return { title, heading, description, canonical, language, noindex, json: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') };
});
