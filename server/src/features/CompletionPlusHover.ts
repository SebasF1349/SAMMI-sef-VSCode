import { CompletionItem, MarkupContent } from "vscode-html-languageservice";

export interface CompletionPlusHover extends CompletionItem {
	documentation: MarkupContent;
}
