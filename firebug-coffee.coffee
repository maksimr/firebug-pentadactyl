#firebug-pentadactyl
#version: 0.1.2
#author: Maksim Ryzhikov

"use strict"

fb = Firebug
chrome = fb.chrome
cmd = fb.CommandLine

#firebug object
firebug = {
  info:
    version: '0.1.2'

    open: "open firebug window"
    close: "minimize firebug window"
    toggle: "toggle firebug window"
    disable: "exit from firebug"

    console: "open console and set focus"
    multiline: "multiline console"
    "toggle-console": "toggle between one-line and multiline console"
    clear: "clear console output window"
    run: "run script that was entered in console editor"

    'tab': "focuses the specified firebug tab (console, html, stylesheet, script, dom, net, etc)"
    'tab-side': "focuses the specified firebug side tab (css, computed, layout, dom, domSide, watch)"
    '>': "focuses the next firebug tab(right)"
    '<': "focuses the next firebug tab(left)"
    '#': "focuses the prev firebug tab"

    '/': "search"

  #global action with firebug
  open: ()-> fb.toggleBar(true,'console') if not chrome.isOpen()
  close: ()-> fb.toggleBar() if chrome.isOpen()
  toggle: ()-> fb.toggleBar()
  disable: ()-> fb.closeFirebug(true)

  #console
  console: ()->
    @open() if not chrome.isOpen()
    chrome.switchToPanel(fb.currentContext, "console")
    cmLine = cmd.getSingleRowCommandLine()
    cmEditor = cmd.getCommandEditor()

    (if fb.commandEditor then cmEditor else cmLine).select()
  multiline: ()-> cmd.toggleMultiLine(true) if chrome.isOpen()
  "toggle-console": () -> cmd.toggleMultiLine() if chrome.isOpen()

  #action with console editor
  clear: ()-> fb.Console.clear() if chrome.isOpen()
  run: () -> cmd.enter(fb.currentContext) if chrome.isOpen()

  #navigation
  'tab': (panelName = "console") -> chrome.navigate(null,panelName) if chrome.isOpen()
  'tab-side': (panelName) -> chrome.selectSidePanel(panelName) if chrome.isOpen()
  '>': () -> chrome.gotoSiblingTab(true) if chrome.isOpen()
  '<': () -> chrome.gotoSiblingTab() if chrome.isOpen()
  '#': () -> chrome.gotoPreviousTab() if chrome.isOpen()
  #search
  '/': (text...) ->
    if chrome.isOpen()
      fb.Search.focus fb.currentContext
      fb.Search.search(text.join(' '), fb.currentContext)
}

#declare in pentadactyl
group.commands.add ['firebug', 'fbpc'], "firebug-pentadactyl (version #{firebug.info.version})", (args) ->
  firebug[command].apply firebug, args[index+1..] for command, index in args when firebug[command]
,{
  completer: (context)-> context.completions = ([name,firebug.info[name]] for name of firebug when name isnt 'info' or name.indexOf('_'))
}

group.options.add ["fbliverun"], "run script on blur firebug console","boolean",false,
  setter: (value)->
    if value then group.events.listen(cmd.getCommandEditor(),'blur', firebug.run,true)
    else if not value then group.events.unlisten(cmd.getCommandEditor(),'blur', firebug.run,true)
