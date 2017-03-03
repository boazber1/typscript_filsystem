"use strict";
var folder_1 = require("./folder");
var file_1 = require("./file");
var FileSystem = (function () {
    function FileSystem() {
        this.addFile = function (name, parentId, content) {
            var newTextFile = new file_1.File(this._files.length, name, 'file', content, parentId);
            this._files.push(newTextFile);
            this._files[parentId].addChild(newTextFile);
        };
        this._root = new folder_1.Folder(0, 'ROOT', 'directory', '', -1);
        this._files = [];
        this._files.push(this._root);
    }
    FileSystem.prototype.addFolder = function (name, parentId) {
        var newFile = new folder_1.Folder(this._files.length, name, 'directory', '', parentId);
        this._files.push(newFile);
        this._files[parentId].addChild(newFile);
    };
    ;
    FileSystem.prototype.deleteItem = function (id) {
        var fileToDelete = this._files[id];
        var parentFile = this._files[fileToDelete._parentId];
        parentFile.deleteChild(fileToDelete);
        for (var i = 0; i < this._files.length; i++) {
            if (this._files[i]) {
                if (this._files[i]._parentId == fileToDelete._id) {
                    this.deleteItem(this._files[i]._id);
                }
            }
        }
        this._files[id] = undefined;
    };
    ;
    FileSystem.prototype.getItem = function (id) {
        return this._files[id];
    };
    ;
    FileSystem.prototype.getLastId = function () {
        return this._files.length - 1;
    };
    ;
    FileSystem.prototype.isFileNameExist = function (fileId, name, type) {
        var file = this.getItem(fileId);
        if (file instanceof folder_1.Folder || file instanceof file_1.File) {
            for (var i = 0; i < file._children.length; i++) {
                if (file._children[i]._type === type && file._children[i]._name === name) {
                    return true;
                }
            }
        }
        return false;
    };
    ;
    FileSystem.prototype.getUnduplicatedFileName = function (folderId, name, type) {
        var fileName = name;
        var counter = 0;
        var flag = true;
        while (flag) {
            if (counter > 0) {
                fileName = name + '(' + counter + ')';
            }
            if (!this.isFileNameExist(folderId, fileName, type)) {
                flag = false;
            }
            counter++;
        }
        return fileName;
    };
    FileSystem.prototype.findParent = function (id) {
        var targetFile = this._files[id];
        var parent = this._files[targetFile._parentId];
        return parent;
    };
    FileSystem.prototype.savingToLocalStorage = function () {
        var saveArray = [];
        for (var i = 0; i < this._files.length; i++) {
            if (this._files[i]) {
                saveArray.push([this._files[i]._id, this._files[i]._name, this._files[i]._type,
                    this._files[i]._parentId, this._files[i]._content]);
            }
        }
        localStorage.setItem('FileSystem', JSON.stringify(saveArray));
    };
    ;
    return FileSystem;
}());
exports.FileSystem = FileSystem;
exports.fileSystem = new FileSystem();
//# sourceMappingURL=fileSystem.js.map