# Usage

## Install

```
npm install zoom-electron-windows --save
```

## Usage

```
var zoom = require('zoom-electron-windows')(your_appkey, your_appsecret)

// start a meeting
zoom.start({usename, password}, callback)


// join a meeting
zoom.join({meetingroom, usename}, callback)
```
