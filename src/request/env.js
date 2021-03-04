/**
 * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
 */

// 基础服务
let baseUrl = '';

// wms底图
let wmsUrl = 'http://geoserver.iwhere.com/geoserver/global/wms?service=WMS';

// google离线
let offlineUrl = "http://10.3.11.216:8080/arcgis/arcgis/{z}/{x}/{y}.png"

if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://10.68.1.58:32006/HubeiVideo';
} else if (process.env.NODE_ENV == 'production') {
    baseUrl = 'http://10.91.2.50:32006/HubeiVideo';
}


export {
    baseUrl,
    wmsUrl,
    offlineUrl
}