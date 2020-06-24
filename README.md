Promise是一种API规范。

# promise规范
https://github.com/promises-aplus

# promise规范测试
* 首先安装测试用例：`npm install promises-aplus-tests -g`
* 其次使用cli的方式进行测试（也可以使用编程的方式进行测试）`promises-aplus-tests my-promise.js`
* `my-promise.js`导出一个`deferred`函数。


自己从头实现一个promise规范，测试驱动开发，一边测试一边更改，直到通过了全部测试用例。这是一个非常艰难的过程。    


# 文件说明
* adehun是一个简单的promise实现
* standard.js是js标准库中的promise实现
* standard2.js是js标准库中的promise实现，它是另一种封装方式
* main.ts是我写的promise实现
