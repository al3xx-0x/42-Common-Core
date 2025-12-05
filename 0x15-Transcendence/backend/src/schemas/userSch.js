
const imageSch = {
	params: {
		type: 'object',
		properties: {
			img: {type: 'string', minLength: 1}
		},
		required: ['img']
	}
}

module.exports = {imageSch};
