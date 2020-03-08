const { EasyFTP: EasyFTP, Spinner: Spinner } = require("./lib/common");

interface EasyFtpOptions {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    type?: string | 'ftp' | 'sftp';
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

const SiteFtp = {
    connect: function (options: SiteFtpOptions) {
        Spinner.start();
        if (options !== null && typeof options === "object") {
            privateMember['config'] = Object.assign(privateMember['config'], options);
        }
        Spinner.info(JSON.stringify(options));
        Spinner.info('Connecting...');
        EasyFTP.connect(<EasyFtpOptions>{
            host: privateMember['config']["host"],
            port: privateMember['config']["port"],
            username: privateMember['config']["username"],
            password: privateMember['config']["password"],
            type: privateMember['config']["type"],
        });
        privateMember["rm"]().then(() => {
            Spinner.info('Uploading...');
            EasyFTP.upload(privateMember['config']["from"], privateMember['config']["to"], (upload_err) => {
                if (upload_err) {
                    Spinner.fail(upload_err);
                } else {
                    Spinner.succeed('Finished!');
                }
                Spinner.stop();
                EasyFTP.close();
            });
        }).catch((rm_err) => {
            Spinner.fail(rm_err);
            Spinner.stop();
            EasyFTP.close();
        });
    }
};
const privateMember = {
    config: <SiteFtpOptions>{
        host: 'localhost',
        port: 21,
        username: 'anonymous',
        password: 'anonymous@',
        type: 'ftp',
        from: ['dist/**'],
        to: '/public_html/',
        rm: true
    },
    rm: function () {
        return new Promise((resolve, reject) => {
            if (privateMember['config']["rm"]) {
                const dir = typeof privateMember['config']["rm"] === "string" ? privateMember['config']["rm"] : privateMember['config']["to"];
                if (!dir) {
                    Spinner.fail('`rm` or `to` configuration error!');
                    Spinner.stop();
                    EasyFTP.close();
                    reject();
                    return;
                }
                Spinner.info('Deleting the ftp folder`' + dir + '`');
                EasyFTP.rm(dir, (rm_err) => {
                    if (rm_err) {
                        Spinner.fail(rm_err);
                        Spinner.stop();
                        EasyFTP.close();
                        reject(rm_err);
                    } else {
                        Spinner.info('Successfully deleted the ftp folder`' + dir + '`');
                        resolve();
                    }
                });
            } else {
                Spinner.info('Skip deleting the ftp folder');
                resolve();
            }
        });
    }
};

module.exports.SiteFtp = SiteFtp;
module.exports = SiteFtp;
