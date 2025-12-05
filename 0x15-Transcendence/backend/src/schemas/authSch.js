
const registerSch = {
	body: {
		type: 'object',
		properties: {
			name: {type: 'string', minLength: 1},
			username: {type: 'string', minLength: 1},
			email: {type: 'string', minLength: 3, format: 'email'},
			password: {type: 'string', minLength: 8},
			confirm_password: {type: 'string', minLength: 8}
		},
		required: ['name', 'username', 'email', 'password', 'confirm_password']
	}
}

const loginSch = {
	body: {
		type: 'object',
		properties: {
			email: {type: 'string', minLength: 3, format: 'email'},
			password: {type: 'string', minLength: 8}
		},
		required: ['email', 'password']
	}
}


const forgotSch = {
	body: {
		type: 'object',
		properties: {
			email: {type: 'string', minLength: 3, format: 'email'},
		},
		required: ['email']
	}
}

const restSch = {
	body: {
		type: 'object',
		properties: {
			new_password: {type: 'string', minLength: 8},
			confirm_password: {type: 'string', minLength: 8}
		},
		required: ['new_password', 'confirm_password']
	}
}

module.exports = {registerSch, loginSch, forgotSch, restSch}