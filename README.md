A language server to create **SAMMI extensions** - Syntax Highlight, Snippets, Hover and Autocompletion for SAMMI helpers, JavaScript and HTML plus a nice icon.

**Create SAMMI Extensions with ease.**

_**SAMMI** is a fully customizable Stream Deck that lets your Twitch and YouTube Live audience control and interact with your stream._

More info in the [SAMMI Website](https://sammi.solutions/docs/)

![Example of usage](/images/showOff.gif)

> **Warning**
>
> This extension is still in Beta phase, please open an issue in the GitHub Repository if you encounter any bug or has any suggestion that's not in the roadmap.

---

## Features

### SAMMI

-   Syntax Highlight
-   `SAMMItemplate` Snippet
-   Hover
-   Autocompletion
-   Diagnostics
-   Highlight for SAMMI Sections

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
-   Uninstall Extension
-   Extract Extension

## Roadmap

-   Improve SAMMI Helpers Hover
-   Improve SAMMI diagnostics
-   Add JS diagnostics (this will need a rework or a VSCode API update)
-   Install decks

---

## Commands

> **Note**
>
> To use any of the commands it's recommended (but not obligatory) to add your bridge file path in the settings.json (see Configuration section).

### Install Extension

-   **The extension to install MUST be open in the active tab**.
-   Open the Command Palette (Ctrl + Shift + p) and select `SAMMI: Install Extension`.
-   A prompt will open to specify the bridge to install.
-   If the extension and bridge are correctly formatted, the former will be installed (previously uninstalling any older version).
-   A `[bridgeFileName]_backup.html` will be created in case the installation process go wrong.

> **Note**
>
> For the moment, this command will not install any deck.

### Uninstall Extension

-   Open the Command Palette (Ctrl + Shift + p) and select `SAMMI: Uninstall Extension`.
-   Prompts will guide to specify the bridge to uninstall from and the extension to remove.
-   If the extension was previously correctly installed it will proceed.
-   A `[bridgeFileName]_backup.html` will be created in case the installation process go wrong.

### Extract Extension

-   Open the Command Palette (Ctrl + Shift + p) and select `SAMMI: Extract Extension`.
-   Prompts will guide to specify the bridge to extract from and the extension to extract.
-   The extension content **will be saved to your clipboard**.

---

## Configuration

### Add Bridge(s)

Your main Bridge can be added directly from the UI or use the property "SAMMI.bridge.mainPath" settings.json. This Bridge will be called `main`. Extra Bridges can be used too, with the property "SAMMI.bridge.extraPaths" as shown below.

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

Bridges names will then show in the commands prompts when necessary, along with an option to add a new bridge (**which WON'T be saved in the settings.json file**)

![Select Bridge](/images/SelectBridge.png)

### Highlight Extension Sections

Extension sections "titles" (`[extension_name]`, `[extension_info]`, and so on) are highlighted by default with the `hoverHighlightBackground` color of your theme, to quickly find each section. You can turn it off or change its color from settings.json or the UI.

```json
"SAMMI.highlight.active": false,
"SAMMI.highlight.color": "#123456"
```

---

SAMMI Icon: Copyright (C) SAMMI 2022. All rights reserved.
