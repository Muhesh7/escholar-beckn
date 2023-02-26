const { confirm } = require('./dsep/confirm')
const { select } = require('./dsep/select')
const { status } = require('./dsep/status')
const { search } = require('./dsep/search')
const { init } = require('./dsep/init')
const { register } = require('./auth/register');
const { login, user, logout } = require('./auth/login');

const Controllers = {
    confirm,
    select,
    status,
    search,
    init,
    register,
    user,
    login, 
    logout
}

module.exports = Controllers
