const crypto = require('crypto');

function hashPwd(pwd) {
    return crypto.createHmac('sha256', "secret!")
        .update(pwd)
        .digest('hex');
}

module.exports = {hashPwd};