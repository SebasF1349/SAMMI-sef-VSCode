import { Position, TextDocument } from "vscode";

export function getWord(document: TextDocument, position: Position, completion = false) {
	const text = document.lineAt(position).text;
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

	if (completion) {
		limits[1]++; //why??
	}

	return text.substring(limits[0] + 1, limits[1]);
}
