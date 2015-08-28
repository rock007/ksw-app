module.exports = function(grunt) {
   
   var path = require('path');

    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        concat: {
              domop: {
                  src: ['output/**/*.js'],
                  dest: 'realease/ksw-h5.js'
              }
          },
          uglify: {
              my_target: {
                files: {
                  'realease/all_in_one.min.js': ['realease/all_in_one.js']
                }
              }
          },
          typescript: {
            base: {
                 src: ['src/typescripts/*.ts'],
                 dest: 'output/ts',
                 options: {
                     module: 'amd',
                     sourcemap: true,
                     declaration: false
                 }
             }
        },
         connect: {
            server: {
              options: {
                port: 8000,
                keepalive: true,
                base: ''
              }
            }
      },
      react: {
          dynamic_mappings: {
            files: [
            {
              expand: true,
              cwd: 'src/jsx',
              src: ['*.jsx'],
              dest: 'output',
              ext: '.js'
            }
          ]
      }
   },
   webpack: {

    abc:{
cache: true,
      entry: './src/jsx/index.jsx',
      output: {
        filename: 'bundle.js'
      },
      module: {
      loaders: [
        {test: /\.jsx/, loader: 'jsx-loader'}
        ]
      },
    resolve: {
      alias: {
        'fakeData.js': path.join(__dirname, 'src/fakeData.js')
      }
    },
    externals: {
        'react': 'React',
        'react/addons': 'React'
    },
    watch: false, // use webpacks watcher
    // You need to keep the grunt process alive

    keepalive: false, // don't finish the grunt task
    // Use this in combination with the watch option

    inline: false  // embed the webpack-dev-server runtime into the bundle
    // Defaults to false

  }
    }    
   });

      // 载入concat和uglify插件，分别对于合并和压缩
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      //
      grunt.loadNpmTasks('grunt-typescript');
      grunt.loadNpmTasks('grunt-contrib-connect');

      //react
      grunt.loadNpmTasks('grunt-react');

      grunt.loadNpmTasks('grunt-webpack');

      // 注册任务 ,'concat','uglify'
      grunt.registerTask('default', ['typescript:base','react','concat']);

      grunt.registerTask('compile', ['typescript:base','react','webpack']);
      
      grunt.registerTask('run', ['webpack','connect']);

      grunt.registerTask('package', ['webpack']);
      
  };