import * as path from "path";
import { commands, CompletionList, ExtensionContext, Hover, ProviderResult, Uri, window, workspace } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node";
import { fileRegion, getVirtualContent } from "./embeddedSupport";
import { installExtension } from "./utils/installExtension";

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand("sammi.installExtension", async () => {
			const bridges: { [key: string]: string } = {};
			const mainBridge: string | undefined = workspace.getConfiguration().get("SAMMI.bridge.mainPath");
			interface ExtraBridges {
				name: string;
				path: string;
			}
			const extraBridges: ExtraBridges[] | undefined = workspace.getConfiguration().get("SAMMI.bridge.extraPaths");
			if (mainBridge) {
				bridges.main = mainBridge;
			}
			if (extraBridges && extraBridges[0].name) {
				for (let i = 0; i < extraBridges.length; i++) {
					if (extraBridges[i].name && extraBridges[i].path) bridges[extraBridges[i].name] = extraBridges[i].path;
				}
			}
			bridges["Add New Bridge"] = "new";
			const selection = await window.showQuickPick(Object.keys(bridges));
			if (selection) {
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
				const extensionPath = window.activeTextEditor?.document.uri.fsPath || "D:\\Date_Math.lb2";
				await installExtension(bridgePath, extensionPath);
			} else {
				window.showInformationMessage(`Missing Bridge Path`);
				return;
			}
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
