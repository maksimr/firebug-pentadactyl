#firebug-pentadactyl
#version: 0.1.3
#author: Maksim Ryzhikov
#Set ‘extensions.firebug.enableOrion’ preference (in about:config) to false for highlighting off

"use strict"

global = window
fb = global.Firebug
chrome = fb.chrome
cmd = fb.CommandLine

#firebug object
firebug = {
  info:
    version: '0.1.3'

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
    inspect: "toggle the firebug element inspector"
    behave: "use Behave.js for console (like auto-pairs)"

  #global action with firebug
  open: ()-> fb.toggleBar(true,'console') if not chrome.isOpen()
  close: ()-> fb.toggleBar() if chrome.isOpen()
  toggle: ()-> fb.toggleBar()
  disable: ()-> fb.closeFirebug(true)
  inspect: ()->
    fb.toggleBar(true) unless fb.currentContext
    fb.Inspector.toggleInspecting(fb.currentContext)
  behave: ()->
    if !@_editor && cmd && dactyl.plugins && dactyl.plugins.Behave
      @_editor = new dactyl.plugins.Behave({
        textarea: cmd.getCommandEditor().editor.textBox
      })

  #console
  console: ()->
    @open() if not chrome.isOpen()
    chrome.switchToPanel(fb.currentContext, "console")
    cmLine = cmd.getSingleRowCommandLine()
    cmEditor = cmd.getCommandEditor()

    if fb.commandEditor
      if cmEditor.focus then cmEditor.focus() else cmEditor.select()
    else
      cmLine.select()

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
  #initialize
  _initialize: () ->
    fb = global.Firebug
    chrome = fb.chrome
    cmd = fb.CommandLine

    @behave()
}

#declare in pentadactyl
group.commands.add ['firebug', 'fbpc'], "firebug-pentadactyl (version #{firebug.info.version})", (args) ->
  #Firebug may load after pentadactyl
  #I think so.
  unless chrome then firebug._initialize()

  firebug[command].apply firebug, args[index+1..] for command, index in args when firebug[command]
,{
  completer: (context)-> context.completions = ([name,firebug.info[name]] for name of firebug when name isnt 'info' or name.indexOf('_'))
}

group.options.add ["fbliverun"], "run script on blur firebug console","boolean",false,
  setter: (value)->
    unless cmd then firebug._initialize()

    cmEditor = cmd.getCommandEditor()

    if value then cmEditor.editor.addEventListener('blur', firebug.run)
    else if not value then cmEditor.editor.removeEventListener('blur', firebug.run)
