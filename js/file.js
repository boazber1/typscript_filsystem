"use strict";
var File = (function () {
    function File(id, name, type, content, parentId) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._content = content;
        this._parentId = parentId;
        this._children = [];
    }
    File.prototype.rename = function (name) {
        this._name = name;
    };
    ;
    File.prototype.getType = function (type) {
        return (this._type === type);
    };
    ;
    File.prototype.setContent = function (content) {
        this._content = content;
    };
    ;
    return File;
}());
exports.File = File;
//# sourceMappingURL=file.js.map