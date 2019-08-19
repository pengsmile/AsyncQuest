## 需求
- 新增 添加默认参数，通过全局设置，后续所有post请求加上该参数
- 新增 全局配置header头
- get请求 如有参数，自动带入url后
- baseUrl {
    - 全局配置，本地不写url，则自动带入为url
    - 全局配置，本地写入url，则自动加前缀
}
- url {
    - 前面加# 则重新设置当前url，无视baseUrl
    - 不加# baseUrl 加在前面
}
- 新增 beforeSend 发送器前 不返回参数 终止请求 周期函数  拦截器 - brforeSend - 发送前 param 参数
- 拦截器完善
