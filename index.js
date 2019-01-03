'use strict';
const loadPkg = require('load-pkg-config')
var _ = require('lodash');

class AuthorWebpackPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    let self = this
    let { author, group } = guessAuthor(compiler.options.context)
    this.options = _.extend({
        author: author,
        group: group
      }, this.options)
    
    var addMetaToHtml = function (htmlPluginData, callback) {
      if (htmlPluginData.plugin.options.meta !== false) {
        let metaTags = self.getMetaTags()
        htmlPluginData.html = htmlPluginData.html.replace(
          /(<title>)/i, metaTags.join('') + '$&');
      }
      callback(null, htmlPluginData);
    };

    // webpack 4
    if (compiler.hooks) {
      var tapped = 0;
      compiler.hooks.compilation.tap('AuthorWebpackPlugin', function (cmpp) {
        compiler.hooks.compilation.tap('HtmlWebpackPluginHooks', function () {
          if (!tapped++) {
            cmpp.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
              'author-webpack-plugin',
              addMetaToHtml
            );
          }
        });
      });
    } else {
      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', addMetaToHtml);
      });
    }

  }
  getMetaTags() {
    if (this.options.author === 'Anonymous'){
      throw new Error('[Author WebPack Plugin error]: author option is required  either in package.json or plugin options')
    }
    return [`<meta name="author" content="author=${this.options.author} group=${this.options.group}" >`]
  }
}

function guessAuthor(compilerDir) {
  let authorName, groupName = 'didife'
  const { author, repository} = loadPkg(".", compilerDir)

  authorName = author ? author : 'Anonymous'

  if (repository && repository.type === 'git'){
    const repo =  repository.url
    groupName = repo.match(/\:(.+)\//)[1]
  }

  return {
    author: authorName,
    group: groupName
  }
}

module.exports = AuthorWebpackPlugin
