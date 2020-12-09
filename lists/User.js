
const {Text, Password} = require('@keystonejs/fields');

module.exports = {
    fields: {
        username: {
            type: Text,
            isRequire: true
        },
        password: {
            type:Password,
            isRequire: true
        }
    }
}