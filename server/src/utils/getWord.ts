import { Position, TextDocument } from "vscode-languageserver-textdocument";

export function getWord(document: TextDocument, position: Position) {
	const start = {
		line: position.line,
		character: 0,
	};
	const end = {
		line: position.line + 1,
		character: 0,
	};
	const text = document.getText({ start, end });
	const index = position.character - 1;

	const limitChars = [" ", "	", "(", ")", "{", "}", "[", "]", '"', "`", "'", ":", "\n", "\r"];

	const limits = limitChars.reduce(
		(prev, current) => {
			const bottomLimit = text.lastIndexOf(current, index);
			if (bottomLimit > prev[0]) {
				prev[0] = bottomLimit;
			}
			const topLimit = text.indexOf(current, index);
			if (topLimit !== -1 && topLimit < prev[1]) {
				prev[1] = topLimit;
			}
			return prev;
		},
		[-1, text.length - 1]
	);

	let isMethod = false;
	if (text.lastIndexOf(".", index) > limits[0]) {
		isMethod = true;
	}

	return { word: text.substring(limits[0] + 1, limits[1]), isMethod };
}
