var underscore = function (str) {
    return str.replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });
};
var camelize = function (str) {
    return str.replace(/(\_[a-z])/g, function ($1) { return $1.toUpperCase().replace('_', ''); });
};
export { underscore, camelize };
//# sourceMappingURL=string.js.map