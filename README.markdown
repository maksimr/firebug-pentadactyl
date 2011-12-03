firebug-pentadactyl.js
============

This scrip allow run some firebug's commands through
pentadactyl's console

Available commands
------------------

* `open`: 'open firebug window'
* `close`: 'minimize firebug window'
* `toggle`: 'toggle firebug window'
* `disable`: 'exit from firebug'
* `console`: 'open console and set focus'
* `clear`: 'clear console output window'
* `run`: 'run script that was entered in console editor'


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

(version: 0.1.1) maksimr
