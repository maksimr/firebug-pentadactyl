firebug-pentadactyl.js
============

This scrip allow run some firebug's commands through
pentadactyl's console

Available commands
------------------

* Global actions
  * `open`: 'open firebug window'
  * `close`: 'minimize firebug window'
  * `toggle`: 'toggle firebug window'
  * `disable`: 'exit from firebug'

* Console actions
  * `console`: 'focuses the firebug console'
  * `multiline`: 'open the multiline firebug console editor'
  * `toggle-console`: 'toggle between the one-line and multiline firebug console editor'
  * `clear`: 'clear console output window'
  * `run`: 'run script that was entered in console editor'

* Navigation
  * `tab`: 'focuses the specified firebug tab (console, html, stylesheet, script, dom, net, etc)'
  * `tab-side`: 'focuses the specified firebug side tab (css, computed, layout, dom, domSide, watch)'
  * `>`: 'focuses the next right firebug tab'
  * `<`: 'focuses the next left firebug tab'
  * `#`: 'focuses the prev firebug tab'
  * `/`: 'search'

You also may use any combinations of commands:

```vim
  "examples
  :firebug clear run console
  :firebug tab html
  :firebug tab console run toggle-console
```



Installation
------------

Before Installation this file you must have installed firebug plugin for Firefox
Then download this file and put it in pentadactyl's plugin folder


Example configuration .pentadactylrc
-------------

```vim
  ".pentadactylrc
  map -modes=n,v C :firebug<Space>disable<Space><Return>
  map -modes=n,v ;kk :firebug<Space>console<Return>
  map -modes=n,v ;kr :firebug<Space>run<Return>
  map -modes=n,v ;kc :firebug<Space>clear<Return>

  "run script on blur firebug console
  set fbliverun
```

(version: 0.1.2) maksimr
