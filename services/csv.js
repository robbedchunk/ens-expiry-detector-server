const Record = require("../models/Record")
const Papa = require('papaparse')

const exportAllDomains = async () => {
	const data = await Record.find({}, {_id: 0, _v: 0}).lean().exec()

	const csv = Papa.unparse(data, {
		header: true,
		quotes: true,
		delimiter: ',',
		newline: '\n'
		});

	return csv
}

module.exports = {
	exportAllDomains
}