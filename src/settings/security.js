import crypto from 'crypto-js';

const security = {
    encryption: (data, key) => {
        const encrypted = crypto.AES.encrypt(JSON.stringify(data), key).toString();
        return encrypted;
    },

    decryption: (data, key) => {
        const bytes = crypto.AES.decrypt(data, key);
        const decrypted = JSON.parse(bytes.toString(crypto.enc.Utf8));
        return decrypted;
    },
}

export default security;