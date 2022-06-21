//"postinstall": "patch-package"
执行该命令 会将koa2-swagger-ui修改的 覆盖node_modules里面的文件

npm i -S patch-package安装patch-package
直接在node_modules下修改需要修改的包源码
执行npx patch-package 包名, patch-package会将当前node_modules下的源码与原始源码进行git diff，并在项目根目录下生成一个patch补丁文件
后续只要执行npx patch-package命令，就会把项目patches目录下的补丁应用到node_modules的对应包中，这个执行时机一般可以设置为postinstall这个勾子


//新的swagger地址 /api-docs