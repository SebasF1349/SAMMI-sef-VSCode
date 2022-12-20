import { window } from "vscode";
import { readFile } from "./extensionHelpers";

export async function installExtension(bridgeContent: string, extensionPath: string) {
	const extensionContent = await readFile("Extension", extensionPath);
	if (extensionContent === undefined) {
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
			extSectionsContent[i - 1] = extensionContent.slice(extSectionPos[i - 1] + extSections[i - 1].length, extSectionPos[i]).trim(); //missing decks for the moment
		}
	}
	extSectionsContent[0] = extSectionsContent[0].replaceAll("\n", "").replaceAll("\r", "").trim();
	const extensionName = extSectionsContent[0];
	//extension version
	extSectionsContent[2] = extSectionsContent[2].replaceAll("\n", "").replaceAll("\r", "").trim();

	const bridgeExtSections = [
		`<!--${extensionName} external-->`,
		`<!--${extensionName} external end-->`,
		`//[${extensionName} command]`,
		`//[${extensionName} command end]`,
		`//[${extensionName} hook]`,
		`//[${extensionName} hook end]`,
		`//[${extensionName} script]`,
		`//[${extensionName} script end]`,
	];

	let newBridgeContent = uninstallExtension(bridgeContent, extensionName);
	if (newBridgeContent === undefined) return;

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
		`\n<div id="content-${extensionName.replaceAll(" ", "_")}" class="tab-pane" data-version="${
			extSectionsContent[2]
		}" title="${extensionName}">${extSectionsContent[3]}</div>\n` +
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

	return newBridgeContent;
}

export function uninstallExtension(bridgeContent: string, extensionName: string) {
	const bridgeExtSections = [
		`<!--${extensionName} external-->`,
		`<!--${extensionName} external end-->`,
		`//[${extensionName} command]`,
		`//[${extensionName} command end]`,
		`//[${extensionName} hook]`,
		`//[${extensionName} hook end]`,
		`//[${extensionName} script]`,
		`//[${extensionName} script end]`,
	];

	let isExtInstalled = false;
	let isExtCorrecltyInstalled = true;
	const bridgeExtSectionsPos = [bridgeContent.indexOf(bridgeExtSections[0])];
	if (bridgeExtSectionsPos[0] !== -1) isExtInstalled = true;

	for (let i = 0; i < bridgeExtSections.length; i++) {
		bridgeExtSectionsPos[i] = bridgeContent.indexOf(bridgeExtSections[i], bridgeExtSectionsPos[i - 1]);

		if (bridgeExtSectionsPos[i] === -1 && isExtInstalled) {
			isExtCorrecltyInstalled = false;
			break;
		} else if (bridgeExtSectionsPos[i] !== -1 && !isExtInstalled) {
			isExtCorrecltyInstalled = false;
			break;
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

	if (!isExtCorrecltyInstalled) {
		window.showInformationMessage("Extension was incorrectly installed or incorrectly uninstalled.");
		return;
	}

	if (!isExtInstalled) return bridgeContent;

	const newBridgeContent =
		bridgeContent.slice(0, bridgeExtSectionsPos[0]) +
		bridgeContent.slice(bridgeExtSectionsPos[1], bridgeExtSectionsPos[2]) +
		bridgeContent.slice(bridgeExtSectionsPos[3], bridgeExtSectionsPos[4]) +
		bridgeContent.slice(bridgeExtSectionsPos[5], bridgeExtSectionsPos[6]) +
		bridgeContent.slice(bridgeExtSectionsPos[7]);

	return newBridgeContent;
}
