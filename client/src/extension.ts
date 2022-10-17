import * as path from "path";
import { commands, CompletionList, ExtensionContext, Uri, workspace } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node";
import { fileRegion, getVirtualContent } from "./embeddedSupport";

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
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

				const hover: any = await commands.executeCommand("vscode.executeHoverProvider", vdocUri, position);

				return hover[0];
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
