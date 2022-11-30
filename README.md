A language server to create **SAMMI extensions** - Syntax Highlight, Snippets, Hover and Autocompletion for SAMMI helpers, JavaScript and HTML plus a nice icon.

**Create SAMMI Extensions with ease.**

_**SAMMI** is a fully customizable Stream Deck that lets your Twitch and YouTube Live audience control and interact with your stream._

More info in the [SAMMI Website](https://sammi.solutions/docs/)

<img src="/images/showOff.gif" alt="Example of usage" style="display: block; margin: 0 auto" />

> **Warning**
> This extension is still in Beta phase, please open an issue in the GitHub Repository if you encounter any bug or has any suggestion that's not in the roadmap.

---

## Features

### SAMMI Helpers

-   Syntax Highlight
-   `SAMMItemplate` Snippet
-   Hover
-   Autocompletion

### JavaScript

_(in insert_command, insert_hook and insert_script sections)_

-   Syntax Highlight
-   Snippets
-   Hover
-   Autocompletion

### HTML

_(only in insert_external section)_

-   Syntax Highlight
-   Hover
-   Autocompletion

### Commands

-   Install Extension

## Roadmap

-   Improve SAMMI Helpers Hover
-   Add SAMMI diagnostics
-   Add JS diagnostics (this will need a rework)
-   Add commands
    -   Extract Extension from Bridge

---

## Commands

### Install Extension

To install an extension from VSCode it's recommended (but not obligatory) to add your bridge file path in the settings.json.

Your main Bridge can be added directly from the UI or use the property "SAMMI.bridge.mainPath". This Bridge will be called `main`. Extra Bridges can be used too, with the property "SAMMI.bridge.extraPaths" as shown below.

```json
"SAMMI.bridge.mainPath": "D:\\SAMMI\\bridge\\bridge.html",
"SAMMI.bridge.extraPaths": [
	{
		"name": "Secondary Bridge",
		"path": "D:\\SAMMI\\bridge\\bridge-testing.html"
	},
	{
		"name": "Another Bridge",
		"path": "D:\\SAMMI\\bridge\\bridge-testing2.html"
	}
]
```

To install an extension, **you need to have your extension open in the active tab** (check it's saved), open the Command Palette (Ctrl + Shift + p) and select `SAMMI: Install Extension`. A prompt will open to specify the bridge to install. It will show the bridges you previously saved and an option to add a new bridge in case you want to select a new one.

<img src="/images/InstallExtension_SelectBridge.png" alt="Select Bridge" style="display: block; margin: 0 auto" />

If the extension and bridge are correctly formatted, the former will be installed (previously uninstalling any older version). A `[bridgeFileName]_backup.html` will be created in case the installation process go wrong.

For the moment, this command will not install any deck.

---

SAMMI Icon: Copyright (C) SAMMI 2022. All rights reserved.
