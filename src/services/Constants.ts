import { Utils } from 'src/services';

/*----------------------------------------文件服务器地址----------------------------------------*/

export const FILE_OFFLINE_SERVE_URL = 'http://zhongneng.me/';      // 线下文件
// export const FILE_ONLINE_SERVE_URL = 'http://mall.rossai.cn/';    // 线上文件
export const FILE_ONLINE_SERVE_URL = 'http://qiniu.zhonglianxf.com/'; // 七牛图片地址

/*----------------------------------------后台Api地址----------------------------------------*/

export const APP_VERSION_SERVE_URL = 'http://zhongneng.me/mallapi/'; // 线下测试环境
export const APP_ONLINE_SERVE_URL = 'http://mall.rossai.cn/mallapi/'; // 线上真实环境

// export const IS_DEBUG = true; // 是否开发(调试)模式
export const IS_DEBUG = false; // 是否开发(调试)模式

export const LOGIN_PWD = true; // 是否启用密码登陆,调试时使用，勿删

export const DEFAULT_AVATAR = 'assets/default_goods_image_240.png'; // 用户默认头像
export const DEFAULT_GOODS = 'assets/default_goods_image_240.png'; // 默认商品图
export const DEFAULT_GOODS_IMG = 'assets/default_goods_image_240.png'; // 默认商品图
export const DEFAULT_NUM = '0'; // 默认数量
export const DEFAULT_VAL = '无'; // 默认值
export const PAGE_SIZE = 5; // 默认分页大小
export const IMAGE_SIZE = 1024; // 拍照/从相册选择照片压缩大小
export const QUALITY_SIZE = 94; // 图像压缩质量，范围为0 - 100
export const REQUEST_TIMEOUT = 20000; // 请求超时时间,单位为毫秒

export const DOWNLOAD_QRCODE = 'assets/download_qr_code.png'; // 默认下载app二维码
// export const DOWNLOAD_URL = 'http://www.gdsplx.com/apps/app1202.apk'; // 默认下载地址
export const DOWNLOAD_URL = 'http://qiniu.zhonglianxf.com/zn1105.apk'; // 默认下载地址
// export const DOWNLOAD_URL = Utils.localStorageGetItem('appUrl'); // 默认下载地址

export const FUNDEBUG_API_KEY = '1b2d6aca0444d09d2ce2635f15587281054590d96b65ccaa15b5cd0a1d4c3ae1'; // 去https:// fundebug.com/申请key

export const USE_TITLE = true; //
// export const USE_TITLE = false; //

// code push 部署key
export const CODE_PUSH_DEPLOYMENT_KEY = {
  'android': {
    'Production': 'i0LgJRugiIfjVYTgmXs9go45Xc7g26690215-d954-4697-a879-90e0c4612b59',
    'Staging': 'WY29_Zyq_hg0eB3TSTGaKRSKPE6k26690215-d954-4697-a879-90e0c4612b59'
  },
  'ios': {
    'Production': 'kn3VJ28z0hB_zQYnW-KnblldnBzN26690215-d954-4697-a879-90e0c4612b59',
    'Staging': 'SRoxClVMoed8SgwIRxeVCPWx26Fk26690215-d954-4697-a879-90e0c4612b59'
  }
};
// 存储本地信息  key
export const APP_CONFIG = {
  USER_KEY: '_user',
};

//批发区价格比例
//零售价
export const RETAIL_PRICE = 10/19; //
//批发价
export const TRADE_PRICE = 4.5/19; //
