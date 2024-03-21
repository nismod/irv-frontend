// mock canvas.getContext to avoid warnings when running tests
// e.g. `Not implemented: HTMLCanvasElement.prototype.getContext`
global.HTMLCanvasElement.prototype.getContext = () => null;
global.URL.createObjectURL = () => '';
