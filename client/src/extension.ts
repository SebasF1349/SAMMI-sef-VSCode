import * as path from "path";
import {
	commands,
	CompletionList,
	DecorationOptions,
	env,
	ExtensionContext,
	Hover,
	ProviderResult,
	Range,
	TextEditorDecorationType,
	ThemeColor,
	Uri,
	window,
	workspace,
} from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node";
import { fileRegion, getVirtualContent } from "./embeddedSupport";
import { extractExtension, installExtension, uninstallExtension } from "./utils/extensionCommands";
import { getBridges, getExtensionNames, readFile, saveBridge } from "./utils/extensionHelpers";

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
	let activeEditor = window.activeTextEditor;

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		if (activeEditor.document.languageId !== "sef") {
			return;
		}
		const extSections = [
			"[extension_name]",
			"[extension_info]",
			"[extension_version]",
			"[insert_external]",
			"[insert_command]",
			"[insert_hook]",
			"[insert_script]",
			"[insert_over]",
		];

		const extensionSections: DecorationOptions[] = [];
		const extensionContent = activeEditor.document.getText();

		for (let i = 0; i < extSections.length; i++) {
			const sectionPosStart = extensionContent.indexOf(extSections[i]);
			if (sectionPosStart === -1) continue;
			const sectionPosEnd = sectionPosStart + extSections[i].length;
			extensionSections.push({
				range: new Range(activeEditor.document.positionAt(sectionPosStart), activeEditor.document.positionAt(sectionPosEnd)),
			});
		}

		let bgColor: string | undefined = workspace.getConfiguration().get("SAMMI.highlight.color");
		let extensionSectionsDecoration: TextEditorDecorationType;

		if (bgColor) {
			if (!bgColor.startsWith("#")) {
				bgColor = "#" + bgColor;
			}
			extensionSectionsDecoration = window.createTextEditorDecorationType({
				backgroundColor: bgColor,
			});
		} else {
			extensionSectionsDecoration = window.createTextEditorDecorationType({
				backgroundColor: new ThemeColor("editor.hoverHighlightBackground"),
			});
		}

		activeEditor.setDecorations(extensionSectionsDecoration, extensionSections);
	}

	let timeout: NodeJS.Timer | undefined = undefined;

	function triggerUpdateDecorations(throttle = false) {
		if (!workspace.getConfiguration().get("SAMMI.highlight.active")) return;
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateDecorations, 500);
		} else {
			updateDecorations();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	window.onDidChangeActiveTextEditor(
		(editor) => {
			activeEditor = editor;
			if (editor) {
				triggerUpdateDecorations();
			}
		},
		null,
		context.subscriptions
	);

	workspace.onDidChangeTextDocument(
		(event) => {
			if (activeEditor && event.document === activeEditor.document) {
				triggerUpdateDecorations(true);
			}
		},
		null,
		context.subscriptions
	);

	context.subscriptions.push(
		commands.registerCommand("sammi.installExtension", async () => {
			const extensionPath = window.activeTextEditor?.document.uri.fsPath;
			if (extensionPath === undefined) {
				window.showInformationMessage(`There is no file open`);
				return;
			}
			const bridges = getBridges();
			const selection = await window.showQuickPick(Object.keys(bridges));
			if (selection === undefined) {
				window.showInformationMessage(`Missing Bridge Path`);
				return;
			}
			let bridgePath: string;
			if (bridges[selection] === "new") {
				const newBridge = await window.showInputBox();
				if (newBridge) {
					bridgePath = newBridge;
				} else {
					window.showInformationMessage(`Missing Bridge Path`);
					return;
				}
			} else {
				bridgePath = bridges[selection];
			}
			window.showInformationMessage(`Bridge: ${bridgePath}`);
			const bridgeContent = await readFile("Bridge", bridgePath);
			if (bridgeContent === undefined) return;
			const newBridgeContent = await installExtension(bridgeContent, extensionPath);
			if (newBridgeContent === undefined) return;
			saveBridge(bridgePath, newBridgeContent);
		}),

		commands.registerCommand("sammi.uninstallExtension", async () => {
			const extensionPath = window.activeTextEditor?.document.uri.fsPath;
			if (extensionPath === undefined) {
				window.showInformationMessage(`There is no file open`);
				return;
			}
			const bridges = getBridges();
			const bridgeSelected = await window.showQuickPick(Object.keys(bridges));
			if (bridgeSelected === undefined) {
				window.showInformationMessage(`Missing Bridge Path`);
				return;
			}
			let bridgePath: string;
			if (bridges[bridgeSelected] === "new") {
				const newBridge = await window.showInputBox();
				if (newBridge) {
					bridgePath = newBridge;
				} else {
					window.showInformationMessage(`Missing Bridge Path`);
					return;
				}
			} else {
				bridgePath = bridges[bridgeSelected];
			}
			window.showInformationMessage(`Bridge: ${bridgePath}`);
			const bridgeContent = await readFile("Bridge", bridgePath);
			if (bridgeContent === undefined) return;
			const extensionNames = await getExtensionNames(bridgeContent);
			if (extensionNames === undefined) return;
			if (extensionNames.length === 0) {
				window.showInformationMessage(`There are no extensions installed in the Bridge`);
				return;
			}
			const extensionSelected = await window.showQuickPick(extensionNames);
			if (!extensionSelected) {
				window.showInformationMessage(`No extension selected`);
				return;
			}
			const newBridgeContent = uninstallExtension(bridgeContent, extensionSelected);
			if (newBridgeContent === undefined) {
				return;
			}
			saveBridge(bridgePath, newBridgeContent);
		}),

		commands.registerCommand("sammi.extractExtension", async () => {
			const extensionPath = window.activeTextEditor?.document.uri.fsPath;
			if (extensionPath === undefined) {
				window.showInformationMessage(`There is no file open`);
				return;
			}
			const bridges = getBridges();
			const bridgeSelected = await window.showQuickPick(Object.keys(bridges));
			if (bridgeSelected === undefined) {
				window.showInformationMessage(`Missing Bridge Path`);
				return;
			}
			let bridgePath: string;
			if (bridges[bridgeSelected] === "new") {
				const newBridge = await window.showInputBox();
				if (newBridge) {
					bridgePath = newBridge;
				} else {
					window.showInformationMessage(`Missing Bridge Path`);
					return;
				}
			} else {
				bridgePath = bridges[bridgeSelected];
			}
			window.showInformationMessage(`Bridge: ${bridgePath}`);
			const bridgeContent = await readFile("Bridge", bridgePath);
			if (bridgeContent === undefined) return;
			const extensionNames = await getExtensionNames(bridgeContent);
			if (extensionNames === undefined) return;
			if (extensionNames.length === 0) {
				window.showInformationMessage(`There are no extensions installed in the Bridge`);
				return;
			}
			const extensionSelected = await window.showQuickPick(extensionNames);
			if (!extensionSelected) {
				window.showInformationMessage(`No extension selected`);
				return;
			}
			const extensionContent = extractExtension(bridgeContent, extensionSelected);
			if (extensionContent === undefined) {
				return;
			}
			env.clipboard.writeText(extensionContent);
		})
	);

	const serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));
	const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions,
		},
	};

	const virtualDocumentContents = new Map<string, string>();

	workspace.registerTextDocumentContentProvider("embedded-content", {
		provideTextDocumentContent: (uri) => {
			const extension = uri.path.lastIndexOf(".");
			const originalUri = uri.path.slice(1, extension);
			const decodedUri = decodeURIComponent(originalUri);
			return virtualDocumentContents.get(decodedUri);
		},
	});

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: "file", language: "sef" }],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
		},
		markdown: {
			isTrusted: true,
		},
		middleware: {
			provideCompletionItem: async (document, position, context, token, next) => {
				await workspace.openTextDocument(document.uri);
				const region = fileRegion(document, position, true);
				if (region === "SAMMI") {
					return await next(document, position, context, token);
				}

				const originalUri = document.uri.toString(true);
				virtualDocumentContents.set(originalUri, getVirtualContent(region, document.getText()));

				const vdocUriString = `embedded-content://${region}/${encodeURIComponent(originalUri)}.${region}`;
				const vdocUri = Uri.parse(vdocUriString);
				return await commands.executeCommand<CompletionList>(
					"vscode.executeCompletionItemProvider",
					vdocUri,
					position,
					context.triggerCharacter
				);
			},

			provideHover: async (document, position, token, next) => {
				const region = fileRegion(document, position);
				if (region === "SAMMI") {
					return await next(document, position, token);
				}

				const originalUri = document.uri.toString(true);
				const decodedUri = decodeURIComponent(originalUri);
				virtualDocumentContents.set(originalUri, getVirtualContent(region, document.getText()));

				const vdocUriString = `embedded-content://${region}/${encodeURIComponent(decodedUri)}.${region}`;
				const vdocUri = Uri.parse(vdocUriString);

				const hover: ProviderResult<Hover[]> = await commands.executeCommand("vscode.executeHoverProvider", vdocUri, position);

				if (hover) return hover[0];

				return;
			},
		},
	};

	client = new LanguageClient("SAMMILanguageServer", "SAMMI Language Server", serverOptions, clientOptions);

	await client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return;
	}
	return client.stop();
}
