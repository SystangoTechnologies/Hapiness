module.exports = {
	apps: [{
		name: 'Hapiness',
		script: 'server.js',
		instances: 1,
		exec_mode: 'cluster',
		max_memory_restart: '500M',
		restart_delay: 3000
	}]
}
