import { Diagnostic, Range } from "vscode-html-languageservice";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DiagnosticSeverity } from "vscode-languageserver/node";

type SAMMIHelper = {
	name: string;
	args: number[];
};

const SAMMIHelpers: SAMMIHelper[] = [
	{
		name: "getVariable",
		args: [1, 2],
	},
	{
		name: "setVariable",
		args: [2, 3],
	},
	{
		name: "deleteVariable",
		args: [1, 2],
	},
	{
		name: "insertArray",
		args: [3, 4],
	},
	{
		name: "deleteArray",
		args: [2, 3],
	},
	{
		name: "extCommand",
		args: [2, 3, 4, 5],
	},
	{
		name: "triggerExt",
		args: [2],
	},
	{
		name: "triggerButton",
		args: [1],
	},
	{
		name: "modifyButton",
		args: [0, 5],
	},
	{
		name: "popUp",
		args: [1],
	},
	{
		name: "alert",
		args: [1],
	},
	{
		name: "notification",
		args: [1],
	},
	{
		name: "getDeckList",
		args: [0],
	},
	{
		name: "getDeck",
		args: [1],
	},
	{
		name: "getDeckStatus",
		args: [1],
	},
	{
		name: "changeDeckStatus",
		args: [2],
	},
	{
		name: "getImage",
		args: [1],
	},
	{
		name: "getSum",
		args: [1],
	},
	{
		name: "stayInformed",
		args: [1],
	},
	{
		name: "getActiveButtons",
		args: [0],
	},
	{
		name: "getModifiedButtons",
		args: [0],
	},
	{
		name: "getTwitchList",
		args: [0],
	},
	{
		name: "trigger",
		args: [2],
	},
	{
		name: "close",
		args: [0],
	},
	{
		name: "generateMessage",
		args: [0],
	},
];

export function sammiDiagnostics(document: TextDocument) {
	const fullText = document.getText();
	const diagnostics: Diagnostic[] = [];
	for (let i = 0; i < SAMMIHelpers.length; i++) {
		let helper = fullText.indexOf("SAMMI." + SAMMIHelpers[i].name + "(");
		while (helper !== -1) {
			const argsStart = fullText.indexOf("(", helper) + 1;
			const possibleArgText = fullText.slice(argsStart);
			const args = countArgs(possibleArgText);
			let argsNumber = args.commasCount + 1;
			const argsLength = args.argsLength;
			if (argsLength === 0) argsNumber = 0;
			if (!SAMMIHelpers[i].args.includes(argsNumber)) {
				diagnostics.push(
					Diagnostic.create(
						Range.create(document.positionAt(argsStart), document.positionAt(argsStart + argsLength)),
						`Incorrect number of arguments`,
						DiagnosticSeverity.Error
					)
				);
			}
			helper = fullText.indexOf("SAMMI." + SAMMIHelpers[i].name, helper + 1);
		}
	}
	return diagnostics;
}

function countArgs(text: string) {
	const wrappers = new Map([
		["{", "}"],
		["[", "]"],
		["(", ")"],
	]);
	const stringsWrappers = [`"`, "`", "'"];
	const layers: string[] = [];
	let commasCount = 0;
	let endArgs = text.length - 1;
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const layersDepth = layers.length;
		if (layersDepth !== 0) {
			if (stringsWrappers.includes(layers[layersDepth - 1])) {
				if (char === layers[layersDepth - 1]) {
					layers.pop();
				}
				continue;
			} else if (char === wrappers.get(layers[layersDepth - 1])) {
				layers.pop();
				continue;
			}
		} else {
			if (char === ",") {
				commasCount++;
			} else if (char === ")") {
				endArgs = i;
				break;
			}
		}
		if (stringsWrappers.includes(char) || wrappers.has(char)) {
			layers.push(char);
		}
	}
	const argsLength = text.slice(0, endArgs).trim().length;
	return { commasCount, argsLength };
}
