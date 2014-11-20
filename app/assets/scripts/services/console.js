(function (window) {
  'use strict';

  var spawn = require('win-spawn');
  var psTree = require('ps-tree');
  var _ = require('lodash');
  var ansi = require('ansi-html-stream');
  var angular = window.angular;

  angular

    .module('app.services.console', [
      'app.services.main'
    ])

    .factory('ConsoleService', function ($rootScope, AppService) {

      // Private members
      var log = '';
      var cwd = AppService.homeDir;

      // Service
      var service = {

        // State
        processing: false,

        // Running child processes
        processes: {},

        // Get or set log
        log: function (string) {
          // Get
          if (typeof string === 'undefined') {
            return log;
          }
          // Set
          else {
            log += string;
            return this;
          }
        },

        // Push log
        push: function (buffer) {
          var string = String(buffer);
          log += string;
        },

        // Execute command with stdin
        executeStdin: function (input, options) {
          var inputArray = input.trim().split(/\s+/);
          var command = inputArray.shift();
          var args = inputArray;
          options = options || {};
          options.cwd = options.cwd || cwd;
          return service.execute(command, args, options);
        },

        // Execute command
        execute: function (command, args, options) {
          var orgCommand = command;
          var orgArgs = _.cloneDeep(args);
          var child = spawn(command, args, options);
          var stream = ansi();
          console.log('command: ' + orgCommand);
          console.log('args: ' + orgArgs);
          console.log('cwd: ' + options.cwd);
          service.pushProcess(child);
          service.push('\n<span style="color:#fff">&gt;&gt; ' + orgCommand + ' ' + orgArgs.join(' ') + '</span>\n');
          child.stdout.pipe(stream);
          child.stderr.pipe(stream);
          stream.on('data', function (data) {
            service.push(data);
            $rootScope.$apply();
          });
          child.stdout.on('data', function (data) {
            console.log('stdout:\n' + data);
          });
          child.stderr.on('data', function (data) {
            console.log('stderr:\n' + data);
          });
          child.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            $rootScope.$apply();
          });
          return child;
        },

        // Register process
        pushProcess: function (child) {
          var pid = child.pid;
          service.processes[pid] = child;
          service.processing = true;
          child.on('exit', function () {
            delete service.processes[pid];
            if (_.isEmpty(service.processes)) {
              service.processing = false;
              $rootScope.$apply();
            }
          });
        },

        // Kill process tree
        killProcessTree: function (child) {
          if (AppService.isWin) {
            spawn('taskkill', ['/pid', child.pid, '/t', '/f']);
          }
          else {
            psTree(child.pid, function (err, children) {
              spawn('kill', ['-INT'].concat(children.map(function (p) { return p.PID; })));
            });
          }
        },

        // Kill all child processes and trees
        killAll: function () {
          _.forOwn(service.processes, function (child) {
            service.killProcessTree(child);
          });
        }

      };
      return service;

    });

}(window));
