module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        shell: {
            dist: {
                command: '6to5 src/js --out-dir .tmp/js'
            }
        },

        browserify: {
            dist: {
                files: {
                    'dist/main.js': ['.tmp/js/main.js'],
                },
                options: {
                    transform: ['6to5-browserify']
                }
            }
        },

        sass: {
            options: {
                sourcemap: 'none'
            },
            dist: {
                files: {
                    'dist/main.css': 'src/sass/main.scss'
                }
            }
        },

        copy: {
            dist: {
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            css: {
                files: 'src/**/*.scss',
                tasks: ['sass']
            },
            html: {
                files: 'src/**/*.html',
                tasks: ['copy']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['shell', 'browserify']
            }
        }

    });

    grunt.registerTask('default', ['shell', 'browserify', 'sass', 'copy', 'watch']);

};
