
//let mainUrl = 'http://localhost:7086/';  
//bharat let mainUrl = 'http://116.73.9.212:7086/';
 // bharat let mainUrl = 'http://116.73.9.212:7090/';
 
 
 //let mainUrl = 'http://13.235.113.122:7090/'
 let mainUrl = 'http://13.235.113.122:7086/'
export const Constant = {
        LOGINAPI: mainUrl + 'api/user/loginUser',
        GET_SECURITIES: mainUrl + 'api/common/getSecurity/', 
        GET_INDEXES: mainUrl + 'api/indexMaster/getAllIndex/',
        GET_NSE_TRANSACTION_DATA: mainUrl + 'api/common/getNseData',
        GET_NSE_TABLE_REPORT: mainUrl + 'api/common/getTableReport',
        GET_TB_BT_REPORT: mainUrl + 'api/common/getTopBottomReport',
        GET_CROSS_REPORT_DATA: mainUrl + 'api/common/getCrossReport',
        GET_ACTION_REPORT: mainUrl + 'api/common/getActionReport',
        HLC_HIGHER: 'HLC HIGHER',
        HLC_LOWER: 'HLC LOWER',
        GET_ALL_USER: mainUrl + 'api/user/getAll',
        GET_USER_BY_ID: mainUrl + 'api/user/getUserInfoById/',
        GET_ALL_MENU: mainUrl + 'api/menuMaster/getAll',
        UPLOAD_FILE : mainUrl + 'api/common/uploadFile',
        CHANGE_PASSWORD:  mainUrl + 'api/common/changePassword', 
        SAVE_USER:  mainUrl + 'api/user/save',
        GET_OT_REPORT: mainUrl +'api/common/getOTReport',
        TABLE_REPORT : 'TABLE_REPORT',
        GET_HAT_LAT_STATUS_4_OTR : mainUrl+ 'api/common/getHatLat4Otr',
        GET_MST_REPORT: mainUrl +'api/common/getMstReport',
        GET_DD_REPORT: mainUrl +'api/common/getDDReport',
        GET_AOC_REPORT: mainUrl +'api/common/getAocReport',
}