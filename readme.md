# AsyncQuest

[![Bower version]

## Step

```
    npm i asyncquest
```

## Options

| param | default | desc |
|  ----  | ----  | ---- |
| method | post | 默认为post |
| url | '' | 可通过全局配置，前侧加#则忽略配置url |
| beforeSend | function | 发送器回调，无返回参数终止请求 |
| data | Object | 请求参数 |

##

```
asyncquest({
    url: '/user',
    data: {
        ...
    }
    beforeSend(param){
       ...
       注！不返回则终止请求
       return param
    }
}).then(e=>{
    ...
}).catch(err=>{
    ...
})
```

## 全局配置

| param | default | desc |
|  ----  | ----  | ---- |
| baseUrl | post | 默认为post |
| commonParam | 无 | 全局参数，所有post自动添加 |
| Content-Type | 无 | 请求头 |

##

```
asyncquest.defaults.baseURL = '../INDEX/';
asyncquest.defaults['Content-Type'] = 'application/json';
asyncquest.defaults.commonParam = {
    IS_BACK: 1
};
```


## DESC

- 发送前回调，无返回参数终止发送,返回失败状态，生命周期， 拦截器-beforeSend-发送
- 添加默认参数，通过全局设置，后续所有post请求加上该参数
- 全局配置header
- baseUrl {
    - 全局配置，本地不写url，则自动带入为url
    - 全局配置，本地写入url，则自动加前缀
}
- url {
    - 前面加# 则重新设置当前url，无视baseUrl
    - 不加# baseUrl 加在前面
}



