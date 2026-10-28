import { pathsEqual, url } from "./url-utils";

/** Keep article and filtered archive visits within the Blog section. */
export function isNavPathCurrent(pathname: string, target: string): boolean {
	if (pathsEqual(pathname, target)) return true;
	return (
		pathsEqual(target, url("/blog/")) &&
		(pathsEqual(pathname, url("/archive/")) ||
			pathname.startsWith(url("/posts/")))
	);
}
