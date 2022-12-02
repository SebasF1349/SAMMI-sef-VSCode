import * as fs from "fs/promises";
import { window } from "vscode";

async function readFile(fileType: "Bridge" | "Extension", path: string) {
	try {
		const bridge = await fs.readFile(path, "utf-8");
		return bridge.toString();
	} catch (err) {
		await window.showInformationMessage(`${fileType} can't be read`);
		return;
	}
}

async function saveBridge(path: string, content: string) {
	try {
		const backup = path.slice(0, path.length - 5) + "_backup.html";
		await fs.rename(path, backup);
		await fs.writeFile(path, content);
	} catch (err) {
		await window.showInformationMessage("Bridge can't be written");
	}
}

export async function installExtension(bridgePath: string, extensionPath: string) {
	const extensionContent = await readFile("Extension", extensionPath);
	if (!extensionContent) {
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
	const extSectionPos: number[] = [];
	const extSectionsContent: string[] = [];
	let pos = 0;
	for (let i = 0; i < extSections.length; i++) {
		pos = extensionContent.indexOf(extSections[i], pos);
		if (pos === -1 && i !== 2) {
			// index === 2 is optional for the moment
			await window.showInformationMessage("Extension is missing a section");
			return;
		}
		extSectionPos[i] = pos;
		if (i !== 0) {
			extSectionsContent[i - 1] = extensionContent.slice(extSectionPos[i - 1] + extSections[i - 1].length + 2, extSectionPos[i] - 2); //missing decks for the moment
		}
	}
	//extension name
	extSectionsContent[0] = extSectionsContent[0].replaceAll("\n", "").replaceAll("\r", "").trim();
	//extension version
	extSectionsContent[2] = extSectionsContent[2].replaceAll("\n", "").replaceAll("\r", "").trim();

	const bridgeContent = await readFile("Bridge", bridgePath);
	if (!bridgeContent) {
		return;
	}

	const bridgeExtSections = [
		`<!--${extSectionsContent[0]} external-->`,
		`<!--${extSectionsContent[0]} external end-->`,
		`//[${extSectionsContent[0]} command]`,
		`//[${extSectionsContent[0]} command end]`,
		`//[${extSectionsContent[0]} hook]`,
		`//[${extSectionsContent[0]} hook end]`,
		`//[${extSectionsContent[0]} script]`,
		`//[${extSectionsContent[0]} script end]`,
	];

	let isExtInstalled = true;
	const bridgeExtSectionsPos = [bridgeContent.indexOf(bridgeExtSections[0])];
	if (bridgeExtSectionsPos[0] === -1) {
		isExtInstalled = false;
	}
	for (let i = 1; i < bridgeExtSections.length; i++) {
		if (i === 0) {
			bridgeExtSectionsPos[i] = bridgeContent.indexOf(bridgeExtSections[i]);
		} else {
			bridgeExtSectionsPos[i] = bridgeContent.indexOf(bridgeExtSections[i], bridgeExtSectionsPos[i - 1]);
		}
		if (bridgeExtSectionsPos[i] === -1 && isExtInstalled) {
			await window.showInformationMessage("Extension was incorrectly installed previously and can't be deleted.");
			return;
		} else if (bridgeExtSectionsPos[i] !== -1 && !isExtInstalled) {
			await window.showInformationMessage("Extension was incorrectly installed previously and can't be deleted.");
			return;
		}
		if (i % 2 === 1) {
			bridgeExtSectionsPos[i] += bridgeExtSections[i].length;
			let isThereNewLine = true;
			while (isThereNewLine) {
				if (bridgeContent[bridgeExtSectionsPos[i]] === "\n" || bridgeContent[bridgeExtSectionsPos[i]] === "\r") {
					bridgeExtSectionsPos[i]++;
				} else {
					isThereNewLine = false;
				}
			}
		}
	}

	let newBridgeContent: string;
	if (isExtInstalled) {
		//uninstall ext
		newBridgeContent =
			bridgeContent.slice(0, bridgeExtSectionsPos[0]) +
			bridgeContent.slice(bridgeExtSectionsPos[1], bridgeExtSectionsPos[2]) +
			bridgeContent.slice(bridgeExtSectionsPos[3], bridgeExtSectionsPos[4]) +
			bridgeContent.slice(bridgeExtSectionsPos[5], bridgeExtSectionsPos[6]) +
			bridgeContent.slice(bridgeExtSectionsPos[7]);
	} else {
		newBridgeContent = bridgeContent;
	}

	const bridgeSections = ["<!--INSERT PART 1-->", "/*INSERT PART 2*/", "/*INSERT PART 3*/", "/*INSERT PART 4*/"];
	const bridgeSectionsPos: number[] = [];
	pos = 0;
	for (let i = 0; i < bridgeSections.length; i++) {
		pos = newBridgeContent.indexOf(bridgeSections[i], pos);
		if (pos === -1) {
			await window.showInformationMessage("Bridge is missing a section");
			return;
		}
		bridgeSectionsPos[i] = pos + bridgeSections[i].length;
	}

	//install extension

	newBridgeContent =
		newBridgeContent.slice(0, bridgeSectionsPos[0]) +
		`\n` +
		bridgeExtSections[0] +
		`\n<div id="content-${extSectionsContent[0].replaceAll(" ", "_")}" class="tab-pane" data-version="${extSectionsContent[2]}" title="${
			extSectionsContent[0]
		}">${extSectionsContent[3]}</div>\n` +
		bridgeExtSections[1] +
		newBridgeContent.slice(bridgeSectionsPos[0], bridgeSectionsPos[1]) +
		`\n` +
		bridgeExtSections[2] +
		`\n` +
		extSectionsContent[4] +
		`\n` +
		bridgeExtSections[3] +
		`\n` +
		newBridgeContent.slice(bridgeSectionsPos[1], bridgeSectionsPos[2]) +
		`\n` +
		bridgeExtSections[4] +
		`\n` +
		extSectionsContent[5] +
		`\n` +
		bridgeExtSections[5] +
		`\n` +
		newBridgeContent.slice(bridgeSectionsPos[2], bridgeSectionsPos[3]) +
		`\n` +
		bridgeExtSections[6] +
		`\n` +
		extSectionsContent[6] +
		`\n` +
		bridgeExtSections[7] +
		`\n` +
		newBridgeContent.slice(bridgeSectionsPos[3]);

	saveBridge(bridgePath, newBridgeContent);
}
