'use strict'
const loadPkg = require('load-pkg-config')
const execSync = require('child_process').execSync
const _ = require('lodash')
const gitlog = require('gitlog');


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
          /(<title>)/i, metaTags.join('') + '$&')
      }
      callback(null, htmlPluginData)
    }

    // webpack 4
    if (compiler.hooks) {
      let tapped = 0
      compiler.hooks.compilation.tap('AuthorWebpackPlugin', function (cmpp) {
        compiler.hooks.compilation.tap('HtmlWebpackPluginHooks', function () {
          if (!tapped++) {
            cmpp.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
              'author-webpack-plugin',
              addMetaToHtml
            )
          }
        })
      })
    } else {
      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', addMetaToHtml)
      })
    }

  }
  getMetaTags() {
    if (this.options.author === 'Anonymous'){
      throw new Error('[Author WebPack Plugin error]: author option is required  either in package.json or plugin options')
    }
    if (this.options.group === 'xxfe') {
      throw new Error('[Author WebPack Plugin error]: group option is required  either in repository fileds of package.json or plugin options')
    }
    return [`<meta name="author" content="author=${this.options.author} group=${this.options.group}" >`]
  }
}

function guessAuthor(compilerDir) {
  let authorName, groupName
  let { author, repository} = loadPkg(".", compilerDir)

  // 尝试从commit提交记录获得author
  if (!author){
    const options = {
      repo: compilerDir,
      number: 1,
      fields: ['authorName']
    };
    let commits = gitlog(options);
    console.log('commits', commits)
    if (commits.length > 0){
      author = commits[0].authorName
    }
  }

  authorName = author ? author : 'Anonymous'

  // 从git repo中获得代码所属group
  if (repository && repository.url) {
    const repo = repository.url
    const reg = repository.type === 'git' ? new RegExp(/\:(.+)\//) : new RegExp(/\/+.*\/(.+)\//)
    groupName = repo.match(reg)[1]
  }

  // 尝试从git remote 获得group
  if (!groupName) {
    const stdout = execSync('git remote -v').toString()
    groupName = stdout.match(/:(.*)\//)[1]
  }
  groupName = groupName ? groupName : 'xxfe'

  return {
    author: authorName,
    group: groupName
  }
}

module.exports = AuthorWebpackPlugin
