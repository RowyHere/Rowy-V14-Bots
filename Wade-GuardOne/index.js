const client = require('./Handlers/clientHandler')
const Wade = require('./Handlers/loaderHandler')
require('./Handlers/functionHandler')

Wade.connect()
Wade.fetchCommands()
Wade.fetchEvents()