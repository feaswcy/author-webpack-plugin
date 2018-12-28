'use strict';
const loadPkg = require('load-pkg-config')
var _ = require('lodash');

class AuthorWebpackPlugin {
  constructor(options) {
    this.options = _.extend({
      group: 'didife',
      author: 'anonymous'
    }, options);
  }
  apply(compiler) {
    let self = this
    let { author, group } = guessAuthor(compiler.options.context)
    this.options = _.extend(this.options, {
      author: author,
      group: group
    })
    if (!self.options.author && !self.options.maintainer) {
      console.warn('Add Author Or Maintainer Option In Package.json To Use With AuthorWebpackPlugin')
    }
    var addMetaToHtml = function (htmlPluginData, callback) {
      if (htmlPluginData.plugin.options.meta !== false) {
        let metaTags = self.getMetaTags()
        htmlPluginData.html = htmlPluginData.html.replace(
          /(<\/head>)/i, metaTags.join('') + '$&');
      }
      console.log('htmlPluginData.html', htmlPluginData.html)
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
    if (this.options.author === false) {
      return [];
    }
    return [`<meta name="author" content="author=${this.options.author} group=${this.options.group}" >`]
  }
}

function guessAuthor(compilerDir) {
  console.log('compilerDir', compilerDir)
  const {
    name,
    author
  } = loadPkg("..", compilerDir)
  const group = 'didife'
  debugger
  return { author, group }
}

module.exports = AuthorWebpackPlugin
