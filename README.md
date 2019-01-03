Author Webpack Plugin
> 给html打上带有author的meta 标签

# 使用
在webpack的配置文件中，引入
```javascript
 const AuthorWebpackPlugin = require('@didi/author-webpack-plugin')
```
在插件中使用

```javascirpt
plugins : [
    ...
    new AuthorWebpackPlugin()
]
```

# 注意事项
为了更好统一页面的作者信息，author plugin对作者信息进行了`强约束`，使用该插件配合必须添加作者的信息，添加作者信息的方式有：
1. 在项目`package.json`里添加author的选项
2. 在webpack配置里传入option: {author: 'xxx'}

# 0.0.1

+ init

# 0.0.2

+ 增加强校验author
+ 修改插入meta的位置