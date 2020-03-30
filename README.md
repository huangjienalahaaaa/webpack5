# 1.关于 tag

tag v1.0:第一部分,学习相关配置
tag v2.0:第二部分,开发环境相关配置
tag v3.0:第二部分,生产环境相关配置以及开发环境的优化
tag v4.0:第二部分,生产环境优化


# 2.安装开发环境所需依赖:

npm install XXXXXX -D

# 3.webpack 性能优化:

> webpack 性能优化分为:
>
> - 开发环境性能优化
> - 生产环境性能优化

## 1. 开发环境性能优化:

- 优化 webpack 的打包构建速度
- 优化代码调试功能(因为我们是开发环境,这里出错了,得告诉我们源代码在哪里,得告诉我们这些错误出现在哪里.这里呢我们会使用浏览器的技术 source-map 来做一个代码调试的优化):

### source-map

> 1. source-map 是一种技术,是一种提供 源代码到构建后代码 的映射技术:比如说构建后代码出错了,那么我们可以通过映射关系,追踪到源代码的错误

> 2. source-map 的配置 devtool:'source-map'只是最基本的配置,source-map 大概还有一下这些参数:
>
> [ inline- | hidden- | eval- ][nosources-][cheap-[module-]]source-map
> 那么这些值有什么区别呢?

> - 1. souce-map:外联.在浏览器的 source 中提示的是"错误代码的准确信息和源代码的错误位置"
>
> * 2. inline-source-map:内联.且值生成一个内联 source-map.在浏览器的 source 中提示的是"错误代码的准确信息和源代码的错误位置"
>      > 1. 内联和外联的区别:
>      >
>      > > 1.外联在 build/js/下生成了 build.js.map 文件.而内联是将内联代码直接放在 build/js/下 build.js 文件中  
>      > > 2.内联构建速度更快  
>      > > 3.内联会让代码体积变大,所以在生产环境下,是不使用内联的
>      >
>      > 2. cheap 和 module 的区别:
>      >
>      > > 1.moduleh 会将 loader 的 source-map 加入.而 cheap 不会
>
> - 3. hidden-source-map:外联.在浏览器的 source 中提示的是"错误代码的错误原因,但是没有错误位置,不能追踪到源代码的错误,只能提示到构建后代码的错误位置"
> - 4. eval-source-map:内联.且每一个文件都生成 source-map,都在 eval()函数中.在浏览器的 source 中提示的是"错误代码的准确信息和源代码的错误位置"
>
> * 5. nosources-souce-map:外联,在浏览器的 source 中提示的是"错误代码的准确信息,但是没有任何源代码的信息"
> * 6. cheap-souce-map:外联,只能精确到行,其他的是可以精确到行和列的.在浏览器的 source 中提示的是"错误代码的准确信息和源代码的错误位置"

> 3. 以上可是 souce-map 提供么 6 个值,我们到底如何选择呢?
>
> - 1.对于开发环境:因为要求"打包构建速度快,调试更友好":
>
>   > 1.速度快:eval>inlibe>cheap>...
>   > 所以最好的方案是:eval-cheap-source-map,其次是 eval-source-map
>   >
>   > 2.调试更友好:eval>inlibe>cheap>...
>   > 所以最好的方案是:source-map,其次是 cheap-module-source-map,其次是 cheap-source-map
>
> 以上对于开发环境,得出的结论:最好的就是 eval-source-map 或者是 eval-cheap-module-source-map.而且 vue 和 react 的脚手架,source-map 默认使用的是 eval-source-map
>
> - 1.对于生产环境:因为要考虑"源代码要不要隐藏?调试要不要更友好?"
>   对照上面的开发环境的方式,推出结论:source-map (全部隐藏)或者是 cheap-source-map(只隐藏源代码.会提示构建后代码错误信息)

## 2. 生产环境性能优化:

- 优化 webpack 的打包构建速度
- 优化代码运行的性能
