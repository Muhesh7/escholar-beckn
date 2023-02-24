const { confirm, onConfirm } = require('./confirm')
const { select, onSelect } = require('./select')
const { status, onStatus } = require('./status')
const { search, onSearch } = require('./search')
const { init, onInit } = require('./init')

const Controllers = {
    confirm, onConfirm,
    select, onSelect,
    status, onStatus,
    search, onSearch,
    init, onInit
}

module.exports = Controllers
