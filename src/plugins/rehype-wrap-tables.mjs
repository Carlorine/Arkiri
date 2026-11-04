import { visit } from "unist-util-visit";

function classList(properties) {
	const className = properties?.className;
	if (Array.isArray(className)) return className.map(String);
	if (typeof className === "string") return className.split(/\s+/);
	return [];
}

/** Give wide GFM tables one horizontal scroll layer instead of widening the page. */
export function rehypeWrapTables() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "table" || parent == null || index == null) return;
			if (classList(parent.properties).includes("table-scroll")) return;

			parent.children[index] = {
				type: "element",
				tagName: "div",
				properties: {
					className: ["table-scroll"],
					tabIndex: 0,
					role: "region",
					ariaLabel: "Scrollable table",
				},
				children: [node],
			};
		});
	};
}
