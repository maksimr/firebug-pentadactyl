(function() {
  "use strict";
  var chrome, cmd, fb, firebug;
  var __slice = Array.prototype.slice;
  fb = Firebug;
  chrome = fb.chrome;
  cmd = fb.CommandLine;
  firebug = {
    info: {
      version: '0.1.2',
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
      '#': "focuses the prev firebug tab",
      '/': "search"
    },
    open: function() {
      if (!chrome.isOpen()) {
        return fb.toggleBar(true, 'console');
      }
    },
    close: function() {
      if (chrome.isOpen()) {
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
      if (!chrome.isOpen()) {
        this.open();
      }
      chrome.switchToPanel(fb.currentContext, "console");
      cmLine = cmd.getSingleRowCommandLine();
      cmEditor = cmd.getCommandEditor();
      return (fb.commandEditor ? cmEditor : cmLine).select();
    },
    multiline: function() {
      if (chrome.isOpen()) {
        return cmd.toggleMultiLine(true);
      }
    },
    "toggle-console": function() {
      if (chrome.isOpen()) {
        return cmd.toggleMultiLine();
      }
    },
    clear: function() {
      if (chrome.isOpen()) {
        return fb.Console.clear();
      }
    },
    run: function() {
      if (chrome.isOpen()) {
        return cmd.enter(fb.currentContext);
      }
    },
    'tab': function(panelName) {
      if (panelName == null) {
        panelName = "console";
      }
      if (chrome.isOpen()) {
        return chrome.navigate(null, panelName);
      }
    },
    '>': function() {
      if (chrome.isOpen()) {
        return chrome.gotoSiblingTab(true);
      }
    },
    '<': function() {
      if (chrome.isOpen()) {
        return chrome.gotoSiblingTab();
      }
    },
    '#': function() {
      if (chrome.isOpen()) {
        return chrome.gotoPreviousTab();
      }
    },
    '/': function() {
      var text;
      text = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (chrome.isOpen()) {
        fb.Search.focus(fb.currentContext);
        return fb.Search.search(text.join(' '), fb.currentContext);
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
        return group.events.listen(cmd.getCommandEditor(), 'blur', firebug.run, true);
      } else if (!value) {
        return group.events.unlisten(cmd.getCommandEditor(), 'blur', firebug.run, true);
      }
    }
  });
}).call(this);
