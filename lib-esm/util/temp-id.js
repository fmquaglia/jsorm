var memo = 0;
var generate = function () {
    memo++;
    return "temp-id-" + memo;
};
export default { generate: generate };
//# sourceMappingURL=temp-id.js.map