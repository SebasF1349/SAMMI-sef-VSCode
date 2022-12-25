import * as fs from "fs/promises";
import { window, workspace } from "vscode";

export async function readFile(fileType: "Bridge" | "Extension", path: string) {
	try {
		const bridge = await fs.readFile(path, "utf-8");
		return bridge.toString();
	} catch (err) {
		await window.showInformationMessage(`${fileType} can't be read`);
		return;
	}
}

export async function saveBridge(path: string, content: string) {
	try {
		const backup = path.slice(0, path.length - 5) + "_backup.html";
		await fs.rename(path, backup);
		await fs.writeFile(path, content);
	} catch (err) {
		await window.showInformationMessage("Bridge can't be written");
	}
}

export async function getExtensionNames(bridgeContent: string) {
	const startInsertSection = bridgeContent.indexOf("<!--INSERT PART 1-->");
	const endInsertSection = bridgeContent.indexOf("<!--Twitch Triggers-->");

	if (startInsertSection === -1 || endInsertSection === -1 || startInsertSection > endInsertSection) {
		await window.showInformationMessage("Bridge is broken");
		return;
	}

	const extensionNames: string[] = [];
	let extensionNameLineEnd = startInsertSection;

	while (true) {
		extensionNameLineEnd = bridgeContent.indexOf(" external-->", extensionNameLineEnd);
		if (extensionNameLineEnd === -1 || extensionNameLineEnd > endInsertSection) {
			break;
		}
		const extensionNameLineStart = bridgeContent.lastIndexOf("<!--", extensionNameLineEnd);
		if (extensionNameLineStart === -1 || extensionNameLineStart < startInsertSection) {
			break;
		}
		extensionNames.push(bridgeContent.slice(extensionNameLineStart + 4, extensionNameLineEnd));
		extensionNameLineEnd++;
	}
	return extensionNames;
}

export function getBridges() {
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
	return bridges;
}
