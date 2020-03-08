const EasyFtp = require('easy-ftp');

interface EasyFTP {
    connect: Function;
    rm: Function;
    upload: Function;
    close: Function;
}

module.exports.EasyFTP = <EasyFTP>new EasyFtp();
module.exports.Spinner = require("ora")();
