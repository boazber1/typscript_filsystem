"use strict";
var Folder = (function () {
    function Folder(id, name, type, content, parentId) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._content = content;
        this._parentId = parentId;
        this._children = [];
    }
    Folder.prototype.rename = function (name) {
        this._name = name;
    };
    ;
    Folder.prototype.getType = function (type) {
        return (this._type === type);
    };
    ;
    Folder.prototype.addChild = function (file) {
        this._children.push(file);
    };
    ;
    Folder.prototype.deleteChild = function (id) {
        var i = 0;
        while (i < this._children.length) {
            if (this._children[i]._id === id) {
                this._children.splice(i, 1);
                break;
            }
            i++;
        }
    };
    ;
    return Folder;
}());
exports.Folder = Folder;
//# sourceMappingURL=folder.js.map