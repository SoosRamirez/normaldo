module.exports = {
    secret: require('crypto').randomBytes(48).toString('hex')
}