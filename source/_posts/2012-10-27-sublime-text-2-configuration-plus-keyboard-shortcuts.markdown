---
layout: post
title: "Sublime Text 2: Configuration + Keyboard shortcuts"
date: 2012-10-27 18:38
comments: true
categories: tools
---

I recently did a talk at my local JavaScript meetup ([Async in Brighton][async]) about [Sublime Text 2][sublimeText] and Chrome Dev Tools. Afterwards, I had a few requests to post about which plugins I use, and my preferences. I also plan on posting the video of the talk, but in the meantime here are my top tips:

##My Sublime Text 2 Plugins:

Remember, the first step is to install [Will Bond's package control][packageControl]. Once you've done that, just open up the command palette (Cmd + Shift + P or Ctrl + Shift + P) and type 'install', followed by enter. This will bring up a filterable list of all available packages.

###[Sublime Linter][sublimeLinter]

An essential plugin, Sublime Linter saves you from future runtime headaches by pointing out missing semicolons, mis-spelled variable names etc. Works for JavaScript, CSS, and plenty more besides.

###[Git][git]

Very full featured Git plugin for ST2, great integration of standard commands such as diff, status, log etc., but as an added bonus it takes your selection into account when using features such as 'Blame' and 'Add Hunk'.

###[Github Gists][gists]

Nice little plugin for creating a Github Gist from your selection, public or private. You can also select and copy a gist to the clipboard ready for use.

###[Zen Coding][zenCoding]

Adds in support for Zen Coding, a way of creating huge chunks of HTML quickly and easily using CSS selector 'haikus'. The Github readme is a bit sparse, but remember you can just type 'zen' into the Sublime Text 2 command palette once the plugin is installed, and it'll show you all the available commands. For more information on Zen Coding, check out [this overview at Smashing Magazine][smashMagZen].

###[Automatic Backups][automaticBackups]

One of the earliest plugins, it simply stores a copy of your file each time you save to a backup folder on your disk. You can step back through history through previous revisions of the file simply and easily, or merge two versions together. These days most of us use Git or some other form of version control, but Automatic Backups is still a nice safety net to have around.

###[Sidebar Enhancements][sidebarEnhancements]

Adds a few extras to the default Sublime Text 2 sidebar, which is pretty basic straight out the box; notably more control over file management (duplicate etc.), as well as more advanced features such as advanced copy options and opening a file in the browser.

###[Tag][tag]

Small plugin that just gives a helping hand when writing HTML/XML, with features such as linting, formatting and auto-closing on forward slash.

###[Missing Palette Commands][paletteCommands]

Even smaller plugin which simply adds in some commands to the command palette. If you find something missing from there, just add it into the Missing.sublime-commands JSON file yourself!

##My Sublime Text 2 Preferences

I generally find the Sublime Text 2 default preferences to be pretty sensible, but there are some nice features turned off by default so it's definitely worth taking a gander at the settings file (just type 'prefd' into the command palette) to see what's on offer. Below is my preferences file for reference; 'Vintage' mode is off at the moment but I plan on using it more once my Vim-fu improves.

``` javascript My Sublime Text 2 Preferences
{
    // Show folders in the side bar in bold
    "bold_folder_labels": true,

    // Word list to use for spell checking
    "dictionary": "Packages/Language - English/en_GB.dic",

    // Set to true to draw a border around the visible rectangle on the minimap.
    // The color of the border will be determined by the "minimapBorder" key in
    // the color scheme
    "draw_minimap_border": true,

    "font_size": 14.0,

    // List any packages to ignore here. When removing entries from this list,
    // a restart may be required if the package contains plugins.
    "ignored_packages": ["Vintage"],

    // Set to true to insert spaces when tab is pressed
    "translate_tabs_to_spaces": true,

    // Set to true to removing trailing white space on save
    "trim_trailing_white_space_on_save": true
}
```

##Favourite Keyboard Shortcuts

During my presentation, I wanted to show off as many features as possible in the time available, so I used keyboard shortcuts where I could. I had a few questions about what the shortcut was for certain features, so I thought I'd include them in full here.

###Layout

Switch between multicolumn layouts:
_Cmd + Alt + [1-4]_

Show grid layout:
_Cmd + Alt + 5_

Switch between multirow layouts:
_Cmd + Alt + Shift + [1-3]_

Move focus to panel:
_Ctrl + [1-4]_

Move file to panel:
_Ctrl + Shift + [1-4]_

Distraction Free Editing:
_Cmd + Ctrl + Shift + F_

###Autocompletes

Show 'Go To' autocomplete:
_Cmd + P_

From within 'Go To' autocomplete:
'@' = function
':' = line number

Show Command Palette:
_Cmd + Shift + P_

###Editing

Code folding:
_Cmd + Alt + []_

Move line up/down:
_Cmd + Ctrl + up/down_

Indent:
_Cmd + []_

Sort Lines:
_Ctrl + F5_

Join Lines:
_Cmd + J_

###Selecting

Select Word:
_Cmd + D_

Select Line:
_Cmd + L_

Select Scope:
_Cmd + Shift + Space_

Select Brackets:
_Ctrl + Shift + M_

###Multi-selecting

Select next occurrence:
_Cmd + D_

Skip occurrence:
_Cmd + K_

Undo selection:
_Cmd + U_

Select block:
_Alt + mouse drag_

Add previous/next line:
_Ctrl + Shift + up/down_

Add cursor:
_Cmd + mouse click_

[async]: http://asyncjs.com/
[sublimeText]: http://www.sublimetext.com/2
[packageControl]: http://wbond.net/sublime_packages/package_control/installation
[sublimeLinter]: https://github.com/SublimeLinter/SublimeLinter
[git]: https://github.com/kemayo/sublime-text-2-git
[gists]: https://github.com/bgreenlee/sublime-github
[zenCoding]: https://github.com/sublimator/ZenCoding
[smashMagZen]: http://coding.smashingmagazine.com/2009/11/21/zen-coding-a-new-way-to-write-html-code/
[automaticBackups]: https://github.com/joelpt/sublimetext-automatic-backups
[sidebarEnhancements]: https://github.com/titoBouzout/SideBarEnhancements
[tag]: https://github.com/SublimeText/Tag
[paletteCommands]: https://github.com/fjl/Sublime-Missing-Palette-Commands