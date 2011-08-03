/**
 * VERSION: 0.1
 * AUTHOR: Maksim Ryzhikov
 * Plugin to interact with firebug.
 * Based on plugin firebug for vimperator
 */

var FirebugPentadactyl = function () {
	var fbContentBox = document.getElementById('fbContentBox'),
	fb = Firebug,
	fbCommandLine = fb.CommandLine;
	return {
		_initialize: function () {
			var self = this;
			if (!this.initialized) {
				document.getElementById('fbCommandEditor').addEventListener('blur', function (event) {
					self.console_run();
				},
				true);
				this.initialized = true;
			}
			return this;
		},
		_exec: function (args) {
			var self = this;
			args.forEach(function (cmd) {
				self[cmd.replace('-', '_')]();
			});
		},
		initialized: false,
		open: function () {
			if (fbContentBox.collapsed) {
				fb.toggleBar(true, 'console');
			}
			setTimeout(function () {
				var browser = fb.chrome.getCurrentBrowser();
				browser.chrome.getSelectedPanel().document.defaultView.focus();
			},
			100);
		},
		off: function () {
			fb.closeFirebug(true);
		},
		close: function () {
			if (!fbContentBox.collapsed) {
				fb.toggleBar();
			}
		},
		toggle: function () {
			fb.toggleBar();
		},
		console_run: function () {
			if (!fbContentBox.collapsed) {
				fbCommandLine.enter(fb.currentContext);
			}
		},
		console_clear: function () {
			if (!fbContentBox.collapsed) {
				fb.Console.clear();
			}
		},
		console_focus: function () {
			if (fbContentBox.collapsed) {
				this.open();
			}
			fb.chrome.switchToPanel(fb.currentContext, "console");
			var cmLine = fbCommandLine.getSingleRowCommandLine(),
			cmEditor = fbCommandLine.getCommandEditor(),
			commandLine = fb.commandEditor ? cmEditor: cmLine;

			setTimeout(function () {
				commandLine.select();
			},
			100);
		}
	};
};

var fbp = (new FirebugPentadactyl())._initialize();

group.commands.add(['firebug', 'fbp'], 'Control firebug from within pentadactyl.', function (args) {
	fbp._exec(args);
},
{
	count: true,
	argCount: '*',
	completer: function (context) {
		var cmds = [],
		cmd;
		for (cmd in fbp) {
			if (fbp.hasOwnProperty(cmd) && cmd.indexOf('_') !== 0) {
				cmds.push([cmd.replace('_', '-'), '']);
			}
		}
		context.completions = cmds;
	}
});
