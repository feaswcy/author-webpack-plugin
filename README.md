Author Webpack Plugin
> 给html打上带有author的meta 标签

# 使用
在webpack的配置文件中，引入
```javascript
 const AuthorWebpackPlugin = require('@didi/author-webpack-plugin')
```
在插件中使用

```javascript
plugins : [
    ...
    new AuthorWebpackPlugin()
]
```

# 注意事项
为了更好统一页面的作者信息，author plugin对作者信息进行了`强约束`，使用该插件配合必须添加作者的信息，添加作者信息的方式有:
1. 在项目`package.json`里添加author的选项
2. 在webpack配置里传入option: {author: 'xxx'}

> 如果从以上都没有获得，那么会从`git log`与 `git remote` 相关信息中猜测 author 与 group，猜测仍没有结果时将会直接报错


# Change Log
# 0.0.1

+ init

# 0.0.2

+ 增加强校验author
+ 修改插入meta的位置

+ 0.0.4

+ 增加从commit自动获取author
+ 增加从repository获得group名称，没有时从git remote中获取