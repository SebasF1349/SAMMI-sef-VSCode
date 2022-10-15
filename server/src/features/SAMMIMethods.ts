import { MarkupKind } from "vscode-html-languageservice";
import { CompletionItemKind } from "vscode-languageserver/node";
import { CompletionPlusHover } from "./CompletionPlusHover";

const SAMMIMethodsCompletionHover: CompletionPlusHover[] = [
	{
		label: "getVariable",
		kind: CompletionItemKind.Function,
		data: 1,
		detail: "SAMMI.getVariable(name, buttonId = 'global')",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Get a variable\n\r*@arg* `name` - name of the variable\n\r*@arg* `buttonId` - button id to save the variable, global variable by default.",
		},
	},
	{
		label: "setVariable",
		kind: CompletionItemKind.Function,
		data: 2,
		detail: "SAMMI.setVariable(name, value, buttonId = 'global')",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Set a variable\n\r*@arg* `name` - name of the variable\n\r*@arg* `value` - value to save in the variable\n\r*@arg* `buttonId` - button id to save the variable, global variable by default.",
		},
	},
	{
		label: "deleteVariable",
		kind: CompletionItemKind.Function,
		data: 3,
		detail: "SAMMI.deleteVariable(name, buttonId = 'global')",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Delete a variable\n\r*@arg* `name` - name of the variable\n\r*@arg* `buttonId` - button id to save the variable, global variable by default.",
		},
	},
	{
		label: "insertArray",
		kind: CompletionItemKind.Function,
		data: 4,
		detail: "SAMMI.insertArray(arrayName, index, value, buttonId = 'global')",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Inserts an item to a specified index in an array, shifting the other items\n\r*@arg* `arrayName` - name of the array\n\r*@arg* `index` - index to insert the new item at\n\r*@arg* `value` - item value\n\r*@arg* `buttonId` - button id to save the array, global variable by default.",
		},
	},
	{
		label: "deleteArray",
		kind: CompletionItemKind.Function,
		data: 5,
		detail: "SAMMI.deleteArray(arrayName, slot, buttonId = 'global')",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Deletes an item in a specified index in an array, shifting the other items\n\r*@arg* `arrayName` - name of the array\n\r*@arg* `index` - index to insert the new item at\n\r*@arg* `buttonId` - button id to save the array, global variable by default.",
		},
	},
	{
		label: "extCommand",
		kind: CompletionItemKind.Function,
		data: 6,
		detail: "SAMMI.extCommand(name, color = 3355443, height = 52, boxes)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Send an extension command (to create extension boxes) to SAMMI\n\r*@arg* `name` - name of the extension command\n\r*@arg* `color` - box color, accepts dec colors\n\r*@arg* `height` - height of the box in pixels, you can use 52 for regular box or 80 for resizable box\n\r*@arg* `boxes` - an object containing box objects (its key is box variable and value is an array of box params)\n\r-*@arg* `boxVariable: [boxName, boxType, defaultValue, (optional)sizeModifier, (optional)selectOptions]`\n\r--*@arg* `boxVariable` - variable to save the box value under\n\r--*@arg* `boxName` - name of the box shown in the user interface\n\r--*@arg* `boxType` - number from 0 to 23\n\r--*@arg* `defaultValue` - default value of the variable\n\r--*@arg* `sizeModifier?` - horizontal box size, 1 is normal\n\r--*@arg* `selectOptions[]?` - array of options for the user to select (when using Select box type)",
		},
	},
	{
		label: "triggerExt",
		kind: CompletionItemKind.Function,
		data: 7,
		detail: "SAMMI.triggerExt(trigger, pullData)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Triggers an Extension Trigger\n\r*@arg* `trigger` - name of the trigger\n\r*@arg* `data` - object containing all trigger pull data (can contain objects, arrays etc.)",
		},
	},
	{
		label: "triggerButton",
		kind: CompletionItemKind.Function,
		data: 8,
		detail: "SAMMI.triggerButton(id)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Triggers a button\n\r*@arg* `id` - button ID to trigger",
		},
	},
	{
		label: "modifyButton",
		kind: CompletionItemKind.Function,
		data: 9,
		detail: "SAMMI.modifyButton(id, color, text, image, border)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Modifies a button appearance temporarily\n\rLeave parameters empty to reset button back to default values\n\r*@arg* `id` - button ID to modify\n\r*@arg* `color` - decimal button color (BGR)\n\r*@arg* `text` - button text\n\r*@arg* `image` - button image file name\n\r*@arg* `border` - border size, 0-7",
		},
	},
	{
		label: "popUp",
		kind: CompletionItemKind.Function,
		data: 10,
		detail: "SAMMI.popUp(message)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Send a popup message to SAMMI\n\r*@arg* `message` - message to show",
		},
	},
	{
		label: "alert",
		kind: CompletionItemKind.Function,
		data: 11,
		detail: "SAMMI.alert(message)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Send an alert message to SAMMI\n\r*@arg* `message` - message to show",
		},
	},
	{
		label: "notification",
		kind: CompletionItemKind.Function,
		data: 11,
		detail: "SAMMI.notification(message)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Sends a notification (tray icon bubble) message to SAMMI\n\r*@arg* `message` - message to show",
		},
	},
	{
		label: "getDeckList",
		insertText: "getDeckList()",
		kind: CompletionItemKind.Function,
		data: 12,
		detail: "SAMMI.getDeckList()",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Request an array of all decks\n\rReplies with an array ['Deck1 Name','Unique ID',crc32,'Deck2 Name','Unique ID',crc32,...]",
		},
	},
	{
		label: "getDeck",
		kind: CompletionItemKind.Function,
		data: 13,
		detail: "SAMMI.getDeck(id)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Request a deck params\n\r*@arg* `id` - id of the specified deck (retrieved from getDeckList command)",
		},
	},
	{
		label: "getImage",
		kind: CompletionItemKind.Function,
		data: 14,
		detail: "SAMMI.getImage(fileName)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Retrieve an image in base64\n\r*@arg* `fileName` - image file without the path",
		},
	},
	{
		label: "getSum",
		kind: CompletionItemKind.Function,
		data: 15,
		detail: "SAMMI.getSum(fileName)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Retrieves CRC32 of a file\n\r*@arg* `fileName` - image file without the path",
		},
	},
	{
		label: "stayInformed",
		kind: CompletionItemKind.Function,
		data: 16,
		detail: "SAMMI.stayInformed(enabled)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Receive or stop receiving all deck and button updates\n\r*@arg* `enabled<boolean>` - true to start, false to stop",
		},
	},
	{
		label: "getActiveButtons",
		insertText: "getActiveButtons()",
		kind: CompletionItemKind.Function,
		data: 17,
		detail: "SAMMI.getActiveButtons()",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Retrieves all currently active buttons",
		},
	},
	{
		label: "getModifiedButtons",
		insertText: "getModifiedButtons()",
		kind: CompletionItemKind.Function,
		data: 18,
		detail: "SAMMI.getModifiedButtons()",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Retrieves all currently modified buttons",
		},
	},
	{
		label: "getTwitchList",
		insertText: "getTwitchList()",
		kind: CompletionItemKind.Function,
		data: 19,
		detail: "SAMMI.getTwitchList()",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Retrieves information for all linked Twitch accounts, including username, id, token etc.",
		},
	},
	{
		label: "trigger",
		kind: CompletionItemKind.Function,
		data: 20,
		detail: "SAMMI.trigger(type, data)",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Simulate a Trigger\n\r*@arg* `type` - trigger number\n\r*@arg* `data` - data object required for the trigger",
		},
	},
	{
		label: "close",
		insertText: "close()",
		kind: CompletionItemKind.Function,
		data: 21,
		detail: "SAMMI.close()",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Closes SAMMI connection to Bridge",
		},
	},
	{
		label: "generateMessage",
		insertText: "generateMessage()",
		kind: CompletionItemKind.Function,
		data: 22,
		detail: "SAMMI.generateMessage()",
		documentation: {
			kind: MarkupKind.Markdown,
			value: "Generates a random message (used for test triggers)",
		},
	},
];

export { SAMMIMethodsCompletionHover };
