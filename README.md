# Instructions
- 上传项目文件到FTP站点
- Upload project file to FTP site
## Install
```sh
npm install site-ftp --save-dev
```
- create a file `ftp.js`
```javascript
const { SiteFtp } = require('site-ftp');
SiteFtp.connect({
    "host": "localhost",
    "port": 21,
    "username": "anonymous",
    "password": "anonymous@",
    "type": "ftp",
    "from": ["dist/**"],
    "to": "/public_html/",
    "rm": true
});
```
- run node
```sh
node ftp.js
```
- console `√ Finished!`
```log
i {"host":"","port":21,"username":"","password":"","type":"ftp","from":["dist/**","src"],"to":"/public_html/","rm":true}
i Connecting...
i Deleting the ftp folder`/public_html/`
√ Successfully deleted the ftp folder`/public_html/`
i Uploading...
√ Finished!
```
## Default Options
```json
{
    "host": "localhost",
    "port": 21,
    "username": "anonymous",
    "password": "anonymous@",
    "type": "ftp",
    "from": ["dist/**"],
    "to": "/public_html/",
    "rm": true
}
```
## TypeScript Options
```typescript
export declare namespace SiteFtp {
    interface SiteFtpOptions {
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        type?: string;
        from?: Array<string>;
        to?: string;
        rm?: boolean | string;
    }
    export function connect(options: SiteFtpOptions): void;
    export {};
}
```
