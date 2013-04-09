module.exports = (grunt) ->
	grunt.loadNpmTasks 'grunt-cafe-mocha'
	grunt.loadNpmTasks 'grunt-zip'

	grunt.registerTask 'default', ['test']
	grunt.registerTask 'dist', ['test', 'zip:dist']
	grunt.registerTask 'test', ['cafemocha']

	grunt.initConfig
		cafemocha:
			json: ['test/json-test.js']
			eventdispatcher: ['test/event-dispatcher-test.js']

		zip:
			dist:
				dest: 'dist.zip'
				src: [
					'manifest.json'
					'views/**/*.*'
					'lib/**/*.js'
					'scripts/**/*.js'
					'images/**/*.png'
				]
