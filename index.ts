const EasyFtp = require('easy-ftp');
const ftp = new EasyFtp();
const OraSpinner = require('ora')();

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

class SiteFtp {
    private config: SiteFtpOptions = {};
    private ftp: EasyFTP = ftp;
    private spinner = OraSpinner;

    constructor(options?: SiteFtp) {
        if (options !== null && typeof options === "object") {
            this.config = Object.assign({
                host: 'localhost',
                port: 21,
                username: 'anonymous',
                password: 'anonymous@',
                type: 'ftp',
                from: ['dist/**'],
                to: '/public_html/',
                rm: true
            }, options);
        }
    }

    public run() {
        this.spinner.start();
        this.ftp.connect(<EasyFtpOptions>{
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            type: this.config.type,
        });
        this.rm().then(() => {
            this.ftp.upload(this.config.from, this.config.to, (upload_err: string) => {
                if (upload_err) {
                    this.spinner.warn(upload_err);
                } else {
                    this.spinner.succeed('Finished!');
                }
                this.spinner.stop();
                this.ftp.close();
            });
        }).catch();
    }

    private rm() {
        return new Promise((resolve, reject) => {
            if (this.config.rm) {
                const dir = typeof this.config.rm === "string" ? this.config.rm : this.config.to;
                if (!dir) {
                    this.spinner.warn('`rm` or `to` configuration error!');
                    this.ftp.close();
                    reject();
                    return;
                }
                this.ftp.rm(dir, (rm_err: string) => {
                    if (rm_err) {
                        this.spinner.warn(rm_err);
                        this.ftp.close();
                        reject(rm_err);
                    } else {
                        this.spinner.info('delete `' + dir + '` successful!');
                        resolve();
                    }
                });
            } else {
                this.spinner.info('skip rm');
                resolve();
            }
        });
    }


}

module.exports = SiteFtp;
