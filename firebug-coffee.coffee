#firebug-pentadactyl
#version: 0.1.1
#author: Maksim Ryzhikov

"use strict"

fb = Firebug

#firebug object
firebug = {
  info:
    version: '0.1.1'

    open: 'open firebug window'
    close: 'minimize firebug window'
    toggle: 'toggle firebug window'
    disable: 'exit from firebug'
    console: 'open console and set focus'
    clear: 'clear console output window'
    run: 'run script that was entered in console editor'

  open: ()-> fb.toggleBar(true,'console') if not fb.chrome.isOpen()
  close: ()-> fb.toggleBar() if fb.chrome.isOpen()
  toggle: ()-> fb.toggleBar()
  disable: ()-> fb.closeFirebug(true)

  console: ()->
    @open() if not fb.chrome.isOpen()
    fb.chrome.switchToPanel(fb.currentContext, "console")
    cmLine = fb.CommandLine.getSingleRowCommandLine()
    cmEditor = fb.CommandLine.getCommandEditor()

    (if fb.commandEditor then cmEditor else cmLine).select()

  clear: ()-> fb.Console.clear() if fb.chrome.isOpen()
  run: () -> fb.CommandLine.enter(fb.currentContext) if fb.chrome.isOpen()
}

#declare in pentadactyl
group.commands.add ['firebug', 'fbpc'], "firebug-pentadactyl (version #{firebug.info.version})", (args) ->
  firebug[command]() for command in args when firebug[command]
,{
  completer: (context)-> context.completions = ([name,firebug.info[name]] for name of firebug when name isnt 'info')
}

group.options.add ["fbliverun"], "run script on blur firebug console","boolean",false,
  setter: (value)->
    if value then group.events.listen(document.getElementById('fbCommandEditor'),'blur', firebug.run)
    else if not value then group.events.unlisten(document.getElementById('fbCommandEditor'),'blur', firebug.run)
