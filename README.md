# mendix 前端组件开发模板库

## 使用指南

-   克隆代码（注意摘取子模块）

```cmd
git clone --recurse-submodules https://github.com/engalar/mendix-pluggable-widget-template.git
```

-   用`Vscode`打开

```cmd
code mendix-pluggable-widget-template
```

-   全局安装一些必须要的 npm 包（一台机器只须执行一次，之后无需再次执行）

```cmd
npm run m
```

-   安装项目本地依赖 npm 包

```cmd
npm run x
```

-   初始化测试项目（用来测试本前端组件的 mendix 应用项目）

```cmd
npm run testProject
```

-   修改 package.json 文件的`name`和`widgetName`字段，然后再执行

```cmd
npm run r
npm run u
```
