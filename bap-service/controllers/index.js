const { confirm, onConfirm } = require('./dsep/confirm')
const { select, onSelect } = require('./dsep/select')
const { status, onStatus } = require('./dsep/status')
const { search, onSearch } = require('./dsep/search')
const { init, onInit } = require('./dsep/init')
const { register } = require('./auth/register');
const { login, user, logout } = require('./auth/login');

const Controllers = {
    confirm, onConfirm,
    select, onSelect,
    status, onStatus,
    search, onSearch,
    init, onInit,
    register, user,
    login, logout
}

module.exports = Controllers
