# Instructions
- 上传项目文件到FTP站点
- Upload project file to FTP site
# default options
- `host`: 'localhost',
- `port`: 21,
- `username`: 'anonymous',
- `password`: 'anonymous@',
- `type`: 'ftp',
- `from`: ['dist/**'],
- `to`: '/public_html/',
- `rm`: true
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
# ts options
```typescript
declare const EasyFtp: any;
declare const ftp: any;
declare const OraSpinner: any;
interface EasyFTP {
    connect: Function;
    rm: Function;
    upload: Function;
    close: Function;
}
interface EasyFtpOptions {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    type?: string;
}
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
declare class SiteFtp {
    private config;
    private ftp;
    private spinner;
    constructor(options?: SiteFtp);
    run(): void;
    private rm;
}
```
