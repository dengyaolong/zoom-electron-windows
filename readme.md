# Require
use electron ia32
```
npm i electron --arch=ia32 
```

use node 6.10.3
```
nvm install 6.10.3 ia32
nvm use 6.10.3 ia32
```

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
