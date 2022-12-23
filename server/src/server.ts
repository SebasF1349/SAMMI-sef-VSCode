import { MarkupKind } from "vscode-html-languageservice";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	CompletionItem,
	createConnection,
	Hover,
	InitializeParams,
	InitializeResult,
	MarkupContent,
	ProposedFeatures,
	TextDocumentPositionParams,
	TextDocuments,
	TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { extensionSectionsCompletionHover } from "./features/extensionSections";
import { SAMMIMethodsCompletionHover } from "./features/SAMMIMethods";
import { getWord } from "./utils/getWord";
import { sammiDiagnostics } from "./utils/SAMMIHelpersDiagnostics";

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((_params: InitializeParams) => {
	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			completionProvider: {
				resolveProvider: false,
				triggerCharacters: ["."],
			},
			hoverProvider: true,
		},
	};

	return result;
});

function validate(document: TextDocument): void {
	const diagnostics = sammiDiagnostics(document);
	connection.sendDiagnostics({
		uri: document.uri,
		version: document.version,
		diagnostics: diagnostics,
	});
}

documents.onDidOpen((event) => {
	validate(event.document);
});

let timeoutID: NodeJS.Timeout;

documents.onDidChangeContent((event) => {
	clearTimeout(timeoutID);
	timeoutID = setTimeout(() => {
		validate(event.document);
	}, 1000);
});

connection.onCompletion(({ textDocument, position }: TextDocumentPositionParams): CompletionItem[] | undefined => {
	const document = documents.get(textDocument.uri);

	if (!document) {
		return;
	}

	const prefix = getWord(document, position);

	if (prefix.word === "SAMMI.") {
		return SAMMIMethodsCompletionHover;
	}
	return;
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return item;
});

connection.onHover(({ textDocument, position }): Hover | undefined => {
	const document = documents.get(textDocument.uri) || TextDocument.create("", "sef", 1, "");
	// eslint-disable-next-line prefer-const
	let { word, isMethod } = getWord(document, position);
	let hover = "";
	let hoverList;

	if (word.slice(0, 6) === "SAMMI.") {
		hoverList = SAMMIMethodsCompletionHover;
		if (isMethod) {
			word = word.slice(6);
		} else {
			word = "SAMMI";
		}
	} else {
		hoverList = extensionSectionsCompletionHover;
	}

	if (word === "SAMMI") {
		hover = "```JavaScript\nSAMMI.helperfunction()\n```\n\rProvides helpers to send and receive data with the SAMMI websocket libreary.";
	} else {
		for (const methodHover of hoverList) {
			if (word === methodHover.label) {
				hover = "```JavaScript\n" + methodHover.detail + "\n```\n\r" + methodHover.documentation.value;
			}
		}
	}

	const content: MarkupContent = {
		kind: MarkupKind.Markdown,
		value: hover,
	};

	return {
		contents: content,
	};
});

documents.listen(connection);

connection.listen();
