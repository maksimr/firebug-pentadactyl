(function() {
  "use strict";
  var fb, firebug;
  fb = Firebug;
  firebug = {
    info: {
      version: '0.1.1',
      open: "open firebug window",
      close: "minimize firebug window",
      toggle: "toggle firebug window",
      disable: "exit from firebug",
      console: "open console and set focus",
      multiline: "multiline console",
      "toggle-console": "toggle between one-line and multiline console",
      clear: "clear console output window",
      run: "run script that was entered in console editor",
      'tab': "focuses the specified firebug tab (console, html, css, script, dom, net, etc)",
      '>': "focuses the next firebug tab(right)",
      '<': "focuses the next firebug tab(left)",
      '#': "focuses the prev firebug tab"
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
    multiline: function() {
      if (fb.chrome.isOpen()) {
        return fb.CommandLine.toggleMultiLine(true);
      }
    },
    "toggle-console": function() {
      if (fb.chrome.isOpen()) {
        return fb.CommandLine.toggleMultiLine();
      }
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
    },
    'tab': function(panelName) {
      if (panelName == null) {
        panelName = "console";
      }
      if (fb.chrome.isOpen()) {
        return fb.chrome.navigate(null, panelName);
      }
    },
    '>': function() {
      if (fb.chrome.isOpen()) {
        return fb.chrome.gotoSiblingTab(true);
      }
    },
    '<': function() {
      if (fb.chrome.isOpen()) {
        return fb.chrome.gotoSiblingTab();
      }
    },
    '#': function() {
      if (fb.chrome.isOpen()) {
        return fb.chrome.gotoPreviousTab();
      }
    }
  };
  group.commands.add(['firebug', 'fbpc'], "firebug-pentadactyl (version " + firebug.info.version + ")", function(args) {
    var command, index, _len, _results;
    _results = [];
    for (index = 0, _len = args.length; index < _len; index++) {
      command = args[index];
      if (firebug[command]) {
        _results.push(firebug[command].apply(firebug, args.slice(index + 1)));
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
          if (name !== 'info' || name.indexOf('_')) {
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
        return group.events.listen(fb.CommandLine.getCommandEditor(), 'blur', firebug.run, true);
      } else if (!value) {
        return group.events.unlisten(fb.CommandLine.getCommandEditor(), 'blur', firebug.run, true);
      }
    }
  });
}).call(this);
