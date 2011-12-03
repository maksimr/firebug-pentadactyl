(function() {
  "use strict";
  var fb, firebug;
  fb = Firebug;
  firebug = {
    info: {
      version: '0.1.1',
      open: 'open firebug window',
      close: 'minimize firebug window',
      toggle: 'toggle firebug window',
      disable: 'exit from firebug',
      console: 'open console and set focus',
      clear: 'clear console output window',
      run: 'run script that was entered in console editor'
    },
    open: function() {
      if (!fb.chrome.isOpen()) {
        return fb.toggleBar(true, 'console');
      }
    },
    close: function() {
      if (fb.chrome.isOpen()) {
        return fb.toggleBar();
      }
    },
    toggle: function() {
      return fb.toggleBar();
    },
    disable: function() {
      return fb.closeFirebug(true);
    },
    console: function() {
      var cmEditor, cmLine;
      if (!fb.chrome.isOpen()) {
        this.open();
      }
      fb.chrome.switchToPanel(fb.currentContext, "console");
      cmLine = fb.CommandLine.getSingleRowCommandLine();
      cmEditor = fb.CommandLine.getCommandEditor();
      return (fb.commandEditor ? cmEditor : cmLine).select();
    },
    clear: function() {
      if (fb.chrome.isOpen()) {
        return fb.Console.clear();
      }
    },
    run: function() {
      if (fb.chrome.isOpen()) {
        return fb.CommandLine.enter(fb.currentContext);
      }
    }
  };
  group.commands.add(['firebug', 'fbpc'], "firebug-pentadactyl (version " + firebug.info.version + ")", function(args) {
    var command, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      command = args[_i];
      if (firebug[command]) {
        _results.push(firebug[command]());
      }
    }
    return _results;
  }, {
    completer: function(context) {
      var name;
      return context.completions = (function() {
        var _results;
        _results = [];
        for (name in firebug) {
          if (name !== 'info') {
            _results.push([name, firebug.info[name]]);
          }
        }
        return _results;
      })();
    }
  });
  group.options.add(["fbliverun"], "run script on blur firebug console", "boolean", false, {
    setter: function(value) {
      if (value) {
        return group.events.listen(document.getElementById('fbCommandEditor'), 'blur', firebug.run);
      } else if (!value) {
        return group.events.unlisten(document.getElementById('fbCommandEditor'), 'blur', firebug.run);
      }
    }
  });
}).call(this);
