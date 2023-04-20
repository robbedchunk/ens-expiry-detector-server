let parameters = {
	canRun: true
}

const set = (name, value) => parameters[name] = value
const get = (name) => parameters[name]

module.exports = { set, get }