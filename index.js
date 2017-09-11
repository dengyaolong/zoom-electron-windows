'use strict';
const electron = require('electron');

const { app, BrowserWindow } = require('electron')
const ZOOMSDKMOD = require("./lib/zoom_sdk.js")

var mainWindow = null;
var loginWindow = null;
var startjoinWindow = null;
var waitingWindow = null;
var inmeetingWindow = null;

var zoomauth = null
var zoommeeting = null
var mymeetinguserid = 0

function meetingstatuscb(status, errorcode) {
    console.log(status, errorcode)
}

function meetinguserjoincb(useritem) {
  if (useritem.isme == 'true')
    mymeetinguserid = useritem.userid
}

function meetinguserleftcb(userid){}
function meetinghostchangecb(userid){}
function audiostatuscb(userid, status){}
function videostatuscb(userid, status){}

function start(appkey, appsecret, username, password, cb) {
    function sdkauthCB(status){
        if (ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_SUCCESS == status){
            var opts = {
                meetingstatuscb: meetingstatuscb,
                meetinguserjoincb: meetinguserjoincb,
                meetinguserleftcb: meetinguserleftcb,
                meetinghostchangecb: meetinghostchangecb,
            }

            zoommeeting = zoomsdk.GetMeeting(opts)

            zoomauth.Login(username, password, false);
        } else {
            cb(new Error('sdk auth fail'))
        }
    }
    function loginCB(status){
        switch(status)
        {
            case ZOOMSDKMOD.ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_SUCCESS:
                let res = zoommeeting.StartMeeting()
                console.log(res,'startbb')
                break;
            case ZOOMSDKMOD.ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_FAILED:
                cb(new Error('login fail'))
                break;
            default:
                break;
        }
    }
    var initOptions={
        apicallretcb: function apicallresultcb(apiName, ret){
            if ('InitSDK' == apiName && ZOOMSDKMOD.ZoomSDKError.SDKERR_SUCCESS == ret){
                var options = {
                    authcb: sdkauthCB,
                    logincb: loginCB,
                    logoutcb: null,
                }
                zoomauth = zoomsdk.GetAuth(options)
                zoomauth.SDKAuth(appkey, appsecret)
            } else if ('CleanupSDK' == apiName){
                cb(null, 'quit')
            }
        },
        threadsafemode:0,
        ostype: ZOOMSDKMOD.ZOOM_TYPE_OS_TYPE.WIN_OS,
    }

    const zoomsdk = ZOOMSDKMOD.ZoomSDK.getInstance(initOptions)
    
    zoomsdk.InitSDK({
        webdomain:'https://www.zoom.us',
        langid: ZOOMSDKMOD.ZoomSDK_LANGUAGE_ID.LANGUAGE_Chinese_Simplified,
    })
}

function join(appkey, appsecret, meetingroomOpts, cb) {
    function sdkauthCB(status){
        if (ZOOMSDKMOD.ZOOMAUTHMOD.ZoomAuthResult.AUTHRET_SUCCESS == status){
            var opts = {
                meetingstatuscb:meetingstatuscb,
                meetinguserjoincb:meetinguserjoincb,
                meetinguserleftcb:meetinguserleftcb,
                meetinghostchangecb:meetinghostchangecb,
            }
            zoommeeting = zoomsdk.GetMeeting(opts)
        } else {
            cb(new Error('sdk auth faile'))
        }
    }
    function loginCB(status){
        switch(status)
        {
            case ZOOMSDKMOD.ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_SUCCESS:
                zoommeeting.JoinMeeting(meetingroomOpts)
                break;
            case ZOOMSDKMOD.ZOOMAUTHMOD.ZoomLoginStatus.LOGIN_FAILED:
                cb(new Error('login faile'))
                break;
            default:
                break;
        }
    }
    var initOptions={
        apicallretcb: function apicallresultcb(apiName, ret){
            if ('InitSDK' == apiName && ZOOMSDKMOD.ZoomSDKError.SDKERR_SUCCESS == ret){
                var options={
                    authcb: sdkauthCB,
                    logincb: loginCB,
                    logoutcb:null,
                }
                zoomauth = zoomsdk.GetAuth(options)
                zoomauth.SDKAuth(appkey, appsecret)
            }
            else if ('CleanupSDK' == apiName){
                cb(null, 'quit')
            }
        },
        threadsafemode:0,
        ostype: ZOOMSDKMOD.ZOOM_TYPE_OS_TYPE.WIN_OS,
    }

    const zoomsdk = ZOOMSDKMOD.ZoomSDK.getInstance(initOptions)
    zoomsdk.InitSDK({
        webdomain:'https://www.zoom.us',
        langid: ZOOMSDKMOD.ZoomSDK_LANGUAGE_ID.LANGUAGE_Chinese_Simplified,
    })
}

module.exports = function(appkey, appsecret){
    return {
       start: function({username, password}, cb){
           start(appkey, appsecret, username, password, cb)
       },
       join: function(meetingOpts, cb){
           join(appkey, appsecret, meetingOpts, cb)
       }
    }
}
