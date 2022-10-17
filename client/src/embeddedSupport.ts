import { Position, TextDocument } from "vscode";
import { getWord } from "./utils/getWord";

export function fileRegion(document: TextDocument, position: Position, completion = false) {
	const word = getWord(document, position, completion);

	if (word.substring(0, 6) !== "SAMMI.") {
		if (isInsideJSRegion(document.getText(), document.offsetAt(position))) {
			return "js";
		}
		if (isInsideHTMLRegion(document.getText(), document.offsetAt(position))) {
			return "html";
		}
	}

	return "SAMMI";
}

function isInsideJSRegion(documentText: string, offset: number) {
	if (documentText.lastIndexOf("[insert_command]", offset) != -1 && documentText.indexOf("[insert_over]", offset) != -1) {
		return true;
	}
	return false;
}

function isInsideHTMLRegion(documentText: string, offset: number) {
	if (documentText.lastIndexOf("[insert_external]", offset) != -1 && documentText.indexOf("[insert_command]", offset) != -1) {
		return true;
	}
	return false;
}

export function getVirtualContent(contentType: "js" | "html", documentText: string): string {
	let content;
	switch (contentType) {
		case "js":
			content = getJSVirtualContent(documentText);
			break;
		case "html":
			content = getHTMLVirtualContent(documentText);
			break;
	}
	return content;
}

function getJSVirtualContent(documentText: string): string {
	let isScript = false;
	const content = documentText
		.replaceAll("\r", "")
		.split("\n")
		.map((line) => {
			if (line === "[insert_command]") {
				isScript = true;
			}
			if (line === "[insert_over]") {
				isScript = false;
			}
			if (isScript === false || line === "[insert_script]" || line === "[insert_hook]" || line === "[insert_command]") {
				return " ".repeat(line.length);
			} else {
				return line;
			}
		})
		.join("\n");

	return content;
}

function getHTMLVirtualContent(documentText: string): string {
	let isScript = false;
	const content = documentText
		.replaceAll("\r", "")
		.split("\n")
		.map((line) => {
			if (line === "[insert_external]") {
				isScript = true;
			}
			if (line === "[insert_command]") {
				isScript = false;
			}
			if (isScript === false || line === "[insert_external]") {
				return " ".repeat(line.length);
			} else {
				return line;
			}
		})
		.join("\n");

	return content;
}
