# nextjs-example

```nextjs服务端渲染的空壳项目,集成常用的框架,如redux和less,方便快速初始化一个项目```

Most of the times the default Next server will be enough but sometimes you want to run your own server to customize routes or other kind of the app behavior. Next provides a [Custom server and routing](https://github.com/zeit/next.js#custom-server-and-routing) so you can customize as much as you want.

Because the Next.js server is just a node.js module you can combine it with any other part of the node.js ecosystem. in this case we are using express to build a custom router on top of Next.

The example shows a server that serves the component living in `pages/a.js` when the route `/b` is requested and `pages/b.js` when the route `/a` is accessed. This is obviously a non-standard routing strategy. You can see how this custom routing is being made inside `server.js`.

## Functions

nextjs + react + redux + express + less

### Install

```bash
npm install
npm run start
# or
yarn
yarn start
```

## 关联链接

[快速打包web页面到移动端app](https://github.com/zhoushoujian/cordova-template)  

[快速打包web页面到电脑应用程序](https://github.com/zhoushoujian/electron-template)  

[express + mongodb + redis + jwt + typescript项目模板](https://github.com/zhoushoujian/typescript-express-templates)  

[React + Redux + typescript项目模板](https://github.com/zhoushoujian/typescript-react-templates)  

[taro小程序项目模板](https://github.com/zhoushoujian/taro)
