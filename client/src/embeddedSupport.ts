import { Position, TextDocument } from "vscode";
import { getWord } from "./utils/getWord";

export function isInsideJSRegion(documentText: string, offset: number) {
	if (
		documentText.slice(0, offset).indexOf("[insert_script]") != -1 &&
		documentText.slice(offset, documentText.length).indexOf("[insert_over]") != -1
	) {
		return true;
	}
	return false;
}

export function getJSVirtualContent(documentText: string): string {
	let script = false;
	const content = documentText
		.replaceAll("\r", "")
		.split("\n")
		.map((line) => {
			if (line === "[insert_script]") {
				script = true;
			}
			if (line === "[insert_over]") {
				script = false;
			}
			if (script === false || line === "[insert_script]") {
				return " ".repeat(line.length);
			} else {
				return line;
			}
		})
		.join("\n");

	return content;
}

export function isSAMMIFunction(document: TextDocument, position: Position, completion = false) {
	const word = getWord(document, position, completion);

	if (word.substring(0, 6) === "SAMMI.") {
		return true;
	}

	if (!isInsideJSRegion(document.getText(), document.offsetAt(position))) {
		return true;
	}

	return false;
}
