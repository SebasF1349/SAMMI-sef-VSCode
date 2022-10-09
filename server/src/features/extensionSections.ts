import { MarkupKind } from "vscode-html-languageservice";
import { CompletionItemKind } from "vscode-languageserver/node";
import { CompletionPlusHover } from "./CompletionPlusHover";

const extensionSectionsCompletionHover: CompletionPlusHover[] = [
	{
		label: "extension_name",
		insertText: "[extension_name]",
		kind: CompletionItemKind.Function,
		data: 23,
		detail: "Name of the Extension",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "The name of the extension and how it will be displayed to users as the extension name in the Bridge and SAMMI Core.  Alphanumeric characters and spaces are supported.",
		},
	},
	{
		label: "extension_info",
		insertText: "[extension_info]",
		kind: CompletionItemKind.Function,
		data: 24,
		detail: "Author name information",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Can be left empty, it is not used by the bridge or SAMMI Core.",
		},
	},
	{
		label: "extension_version",
		insertText: "[extension_version]",
		kind: CompletionItemKind.Function,
		data: 25,
		detail: "Version number",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Can only contain numbers (can use Semantic Versioning: MAJOR.MINOR.PATCH). Needed for extension updates from the Bridge.",
		},
	},
	{
		label: "insert_external",
		insertText: "[insert_external]",
		kind: CompletionItemKind.Function,
		data: 26,
		detail: "Extension tab content in Bridge",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Supports HTML format text content. Can be left empty.",
		},
	},
	{
		label: "insert_command",
		insertText: "[insert_command]",
		kind: CompletionItemKind.Function,
		data: 27,
		detail: "Defines command/s",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Defines the command or set of commands for the button editor in the SAMMI Core application with SAMMI.extCommand helper function.\n\rAn extension can add more than one SAMMI.extCommand block to create multiple button commands in the SAMMI Core.",
		},
	},
	{
		label: "insert_hook",
		insertText: "[insert_hook]",
		kind: CompletionItemKind.Function,
		data: 28,
		detail: "Hooks command with JS functions",
		documentation: {
			kind: MarkupKind.Markdown,
			value: 'Include a JavaScript case statement, or hook, for each SAMMI.extCommand block defined in the [insert_command] section. Case matching values (aka hook names) must match the button command names from the [insert_command] section exactly.\n\rThe case statement code block should contain the JavaScript function to call defined in the [insert_script] section of the extension.\n\rAll function parameters used must include the object prefix of "SAMMIJSON." (without the quotes) and parameter names that align with boxVariable values in the order defined within the SAMMI.extCommand blocks of the [insert_command] section.',
		},
	},
	{
		label: "insert_script",
		insertText: "[insert_script]",
		kind: CompletionItemKind.Function,
		data: 29,
		detail: "Extension behavior code",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Standard JavaScript function definitions. Extension code can use the SAMMI websocket library to send and receive data to the receiver.",
		},
	},
	{
		label: "insert_over",
		insertText: "[insert_over]",
		kind: CompletionItemKind.Function,
		data: 30,
		detail: "Deck to install",
		documentation: {
			kind: MarkupKind.Markdown,
			value: 'This section allows the extension to install a new deck into the SAMMI Core. Add these keys to your exported deck json if you want SAMMI to perform additional checks when user tries to install the extension:\n\r*@key* `"sammi_version":"2.00.0"` - Check if SAMMI version is working fine\n\r*@key* `"bridge":true` - Check if the Bridge is connected\n\r*@key* `"obswebsocket":"4.9.1"` - Check if OBS Main is connect and correct version\n\r*@key* `"donot_include_deck":false` - Check if the deck should be created. If the deck does not exists it doesnt matter, this is if you want an optionnal deck or hidden deck\n\r*@key* `"extension_triggers":["TRG1","TRG",...]` - These are all the Extension triggers that should happen. Trigger pull data will include "path" for the path of where the extension was.\n\r*@key* `"required_extension":["Extension name","Another extension name",...]` Check if all required extensions are installed before installing the extension',
		},
	},
];

export { extensionSectionsCompletionHover };
