export namespace SiteFtp {
    const EasyFtp = require('easy-ftp');
    const EasyFTP: EasyFTP = new EasyFtp();
    const Spinner = require("ora")();

    interface EasyFTP {
        connect: Function;
        rm: Function;
        upload: Function;
        close: Function;
        exist: Function;
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

    interface EasyFtpOptions {
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        type?: string | 'ftp' | 'sftp';
    }


    let defaultConfig: SiteFtpOptions = {
        host: 'localhost',
        port: 21,
        username: 'anonymous',
        password: 'anonymous@',
        type: 'ftp',
        from: ['dist/**'],
        to: '/public_html/',
        rm: true
    };

    function exist(dir: string) {
        return new Promise((resolve, reject) => {
            EasyFTP.exist(dir, (exist: boolean) => {
                if (exist) {
                    resolve(exist);
                } else {
                    reject(exist);
                }
            });
        });
    }

    function rm() {
        return new Promise((resolve, reject) => {
            if (defaultConfig["rm"]) {
                const dir = <string>(typeof defaultConfig["rm"] === "string" ? defaultConfig["rm"] : defaultConfig["to"]);
                if (!dir) {
                    Spinner.fail('`rm` or `to` configuration error!');
                    Spinner.stop();
                    EasyFTP.close();
                    reject();
                    return;
                }
                exist(dir).then(() => {
                    Spinner.info('Deleting the ftp folder`' + dir + '`');
                    EasyFTP.rm(dir, (rm_err: string) => {
                        if (rm_err) {
                            Spinner.fail('fail:' + rm_err);
                            Spinner.stop();
                            EasyFTP.close();
                            reject(rm_err);
                        } else {
                            Spinner.succeed('Successfully deleted the ftp folder`' + dir + '`');
                            resolve();
                        }
                    });
                }, () => {
                    Spinner.warn('Directory not found, skipping delete directory:' + dir);
                    resolve();
                });
            } else {
                Spinner.succeed('Skip deleting the ftp folder');
                resolve();
            }
        });
    }

    export function connect(options: SiteFtpOptions) {
        Spinner.start();
        if (options !== null && typeof options === "object") {
            defaultConfig = Object.assign(defaultConfig, options);
        }
        Spinner.info(JSON.stringify(options));
        Spinner.info('Connecting...');
        EasyFTP.connect(<EasyFtpOptions>{
            host: defaultConfig["host"],
            port: defaultConfig["port"],
            username: defaultConfig["username"],
            password: defaultConfig["password"],
            type: defaultConfig["type"],
        });
        rm().then(() => {
            Spinner.info('Uploading...');
            EasyFTP.upload(defaultConfig["from"], defaultConfig["to"], (upload_err: string) => {
                if (upload_err) {
                    Spinner.fail(upload_err);
                } else {
                    Spinner.succeed('Finished!');
                }
                Spinner.stop();
                EasyFTP.close();
            });
        }, (rm_err) => {
            Spinner.fail(rm_err);
            Spinner.stop();
            EasyFTP.close();
        });
    }
}
