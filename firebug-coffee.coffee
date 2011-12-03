#firebug-pentadactyl
#version: 0.1.2
#author: Maksim Ryzhikov

"use strict"

fb = Firebug

#firebug object
firebug = {
  info:
    version: '0.1.1'

    open: "open firebug window"
    close: "minimize firebug window"
    toggle: "toggle firebug window"
    disable: "exit from firebug"

    console: "open console and set focus"
    multiline: "multiline console"
    "toggle-console": "toggle between one-line and multiline console"
    clear: "clear console output window"
    run: "run script that was entered in console editor"

    'tab': "focuses the specified firebug tab (console, html, css, script, dom, net, etc)"
    '>': "focuses the next firebug tab(right)"
    '<': "focuses the next firebug tab(left)"
    '#': "focuses the prev firebug tab"

  #global action with firebug
  open: ()-> fb.toggleBar(true,'console') if not fb.chrome.isOpen()
  close: ()-> fb.toggleBar() if fb.chrome.isOpen()
  toggle: ()-> fb.toggleBar()
  disable: ()-> fb.closeFirebug(true)

  #console
  console: ()->
    @open() if not fb.chrome.isOpen()
    fb.chrome.switchToPanel(fb.currentContext, "console")
    cmLine = fb.CommandLine.getSingleRowCommandLine()
    cmEditor = fb.CommandLine.getCommandEditor()

    (if fb.commandEditor then cmEditor else cmLine).select()
  multiline: ()-> fb.CommandLine.toggleMultiLine(true) if fb.chrome.isOpen()
  "toggle-console": () -> fb.CommandLine.toggleMultiLine() if fb.chrome.isOpen()

  #action with console editor
  clear: ()-> fb.Console.clear() if fb.chrome.isOpen()
  run: () -> fb.CommandLine.enter(fb.currentContext) if fb.chrome.isOpen()

  #navigation
  'tab': (panelName = "console") -> fb.chrome.navigate(null,panelName) if fb.chrome.isOpen()
  '>': () -> fb.chrome.gotoSiblingTab(true) if fb.chrome.isOpen()
  '<': () -> fb.chrome.gotoSiblingTab() if fb.chrome.isOpen()
  '#': () -> fb.chrome.gotoPreviousTab() if fb.chrome.isOpen()
}

#declare in pentadactyl
group.commands.add ['firebug', 'fbpc'], "firebug-pentadactyl (version #{firebug.info.version})", (args) ->
  firebug[command].apply firebug, args[index+1..] for command, index in args when firebug[command]
,{
  completer: (context)-> context.completions = ([name,firebug.info[name]] for name of firebug when name isnt 'info' or name.indexOf('_'))
}

group.options.add ["fbliverun"], "run script on blur firebug console","boolean",false,
  setter: (value)->
    if value then group.events.listen(fb.CommandLine.getCommandEditor(),'blur', firebug.run,true)
    else if not value then group.events.unlisten(fb.CommandLine.getCommandEditor(),'blur', firebug.run,true)
