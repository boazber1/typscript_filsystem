"use strict";
var fileSystem_1 = require("./fileSystem");
var history_1 = require("./history");
var file_1 = require("./file");
var folder_1 = require("./folder");
var targetId = -1;
var currentLocationId = -1;
var editFileWindow = $('#text-file-container').clone();
var UI = (function () {
    function UI() {
        this._fileSystem = fileSystem_1.fileSystem;
        this._history = history_1.history;
        this._context = this;
    }
    UI.prototype.render = function () {
        this.createSystem();
        this.initBrowser();
        this.initContextMenu();
        this.goBack();
        $('#text-file-container').remove;
    };
    /* Browser Functions */
    UI.prototype.initBrowser = function () {
        var context = this._context;
        var root = fileSystem_1.fileSystem.getItem(0);
        if (root instanceof folder_1.Folder || root instanceof file_1.File) {
            var rootUl = context.createNewUlWithId(0, root._name);
        }
        $('#browser_ul').append(rootUl);
    };
    UI.prototype.openBrowserDirectory = function (folderId) {
        var context = this._context;
        $('#img_' + folderId).attr('src', 'icons/open.png');
        var directory = fileSystem_1.fileSystem.getItem(folderId);
        if (directory instanceof folder_1.Folder || directory instanceof file_1.File) {
            for (var i = 0; i < directory._children.length; i++) {
                var currentChild = directory._children[i];
                if (currentChild.getType('directory')) {
                    context.appendNewUl(folderId, currentChild._id, currentChild._name);
                }
            }
        }
    };
    UI.prototype.closeBrowserDirectory = function (folderId) {
        $('#img_' + folderId).attr('src', 'icons/close.png');
        var directory = fileSystem_1.fileSystem.getItem(folderId);
        if (directory instanceof folder_1.Folder || directory instanceof file_1.File) {
            for (var i = 0; i < directory._children.length; i++) {
                if (directory._children[i].getType('directory')) {
                    $('#browser_ul_' + directory._children[i]._id).remove();
                }
            }
        }
    };
    UI.prototype.appendNewUl = function (parentId, childId, childName) {
        var context = this._context;
        $('#browser_ul_' + parentId).append(context.createNewUlWithId(childId, childName));
    };
    UI.prototype.createNewUlWithId = function (id, name) {
        var context = this._context;
        var newUl = $('<li><ul class="b_ul" id="browser_ul_' + id + '">' +
            '<img class ="dir" src="icons/close.png" id="img_' + id + '" index="' + id + '">' +
            '<a href="#" id="a_' + id + '" index="' + id + '">' + name + '</a></ul></li>');
        context.addListenerClickToATitle(newUl.find('a'));
        context.addListenerRightClickToOpenContextMenuWithTargetId(newUl.find('a'));
        context.addListenerClickToFolderIcon(newUl.find('img'));
        return newUl;
    };
    /* Content Function */
    UI.prototype.drawContent = function (folderId) {
        var context = this._context;
        $('#content').empty();
        currentLocationId = folderId;
        var directory = fileSystem_1.fileSystem.getItem(folderId);
        if (directory instanceof folder_1.Folder || directory instanceof file_1.File) {
            for (var i = 0; i < directory._children.length; i++) {
                var currentChild = directory._children[i];
                context.drawFileOnContent(currentChild);
            }
        }
        context.updateCurrentRootAddress(folderId);
    };
    UI.prototype.drawFileOnContent = function (file) {
        var context = this._context;
        var imgSrc = '';
        switch (file._type) {
            case 'directory':
                imgSrc = 'icons/close.png';
                break;
            case 'file':
                imgSrc = 'icons/text.png';
                break;
        }
        var newFile = $('<span><img class="content_icon" src="' + imgSrc + '" index="' + file._id + '">' +
            '<span class="content_file_text">' + file._name + '</span></span>');
        context.addListenerDblClickToContentFileIcon(newFile.find('img'));
        context.addListenerRightClickUpdateTargetId(newFile.find('img'));
        $('#content').append(newFile);
    };
    UI.prototype.initContextMenu = function () {
        var context = this._context;
        $(document).contextmenu(function () {
            return false;
        });
        $('#content').mousedown(function ($event) {
            if ($event.button !== 2) {
                targetId = -1;
                $('#context_menu').fadeOut(200);
            }
        });
        $('#browser').mousedown(function (event) {
            if (event.button !== 2) {
                targetId = -1;
                $('#context_menu').fadeOut(200);
            }
        });
        context.addListenerRightClickToOpenContextMenu($('#content'));
        context.addListenerClickToCreateFolder();
        context.addListenerClickToCreateFile();
        context.addListenerClickToRename();
        context.addListenerClickToDelete(); //?
        context.addListenerClickToGoToButton();
    };
    UI.prototype.openContextMenu = function (posX, posY) {
        if (targetId > -1) {
            var contextMenu = $('#context_menu');
            contextMenu.css('top', posY + 5);
            contextMenu.css('left', posX + 5);
            $('.table_div').append(contextMenu);
            contextMenu.fadeIn(200);
        }
    };
    /* Listeners: */
    UI.prototype.addListenerClickToFolderIcon = function (icon) {
        var context = this._context;
        icon.click(function () {
            if ($(this).attr('src') === 'icons/close.png') {
                context.openBrowserDirectory(parseInt($(this).attr("index")));
            }
            else {
                context.closeBrowserDirectory(parseInt($(this).attr("index")));
            }
        });
    };
    UI.prototype.addListenerClickToATitle = function (aTitle) {
        var context = this._context;
        aTitle.click(function () {
            context.drawContent(parseInt($(this).attr("index")));
        });
    };
    UI.prototype.addListenerDblClickToContentFileIcon = function (icon) {
        var context = this._context;
        icon.css({ 'cursor': 'pointer' });
        if (icon.attr("src") === 'icons/close.png') {
            icon.click(function () {
                context.drawContent(parseInt($(this).attr("index")));
                context._history.addToHistory(parseInt($(this).attr("index")));
            });
        }
        else if (icon.attr('src') === 'icons/text.png') {
            icon.click(function () {
                context.drawingTheContentFileWithADiv(parseInt($(this).attr('index')));
            });
        }
    };
    UI.prototype.addListenerRightClickToOpenContextMenu = function (item) {
        var context = this._context;
        item.mousedown(function (event) {
            if (event.button === 2) {
                if (targetId === -1) {
                    targetId = currentLocationId;
                }
                context.openContextMenu(event.pageX, event.pageY);
            }
        });
    };
    UI.prototype.addListenerRightClickToOpenContextMenuWithTargetId = function (item) {
        var context = this._context;
        item.mousedown(function (event) {
            if (event.button === 2) {
                targetId = parseInt($(this).attr("index"));
                context.openContextMenu(event.pageX, event.pageY);
            }
        });
    };
    UI.prototype.addListenerClickToDelete = function () {
        var context = this._context;
        $('#delete_file').click(function () {
            $('#context_menu').fadeOut(200);
            var theParent = fileSystem_1.fileSystem.findParent(targetId);
            if (theParent instanceof folder_1.Folder) {
                context.closeBrowserDirectory(theParent._id);
                theParent.deleteChild(targetId);
                fileSystem_1.fileSystem.deleteItem(targetId);
                context.openBrowserDirectory(theParent._id);
                context.drawContent(theParent._id);
            }
            fileSystem_1.fileSystem.savingToLocalStorage();
            targetId = -1;
        });
    };
    UI.prototype.addListenerRightClickUpdateTargetId = function (icon) {
        icon.mousedown(function (event) {
            if (event.button === 2) {
                targetId = parseInt($(this).attr("index"));
            }
        });
    };
    UI.prototype.addListenerClickToGoToButton = function () {
        var context = this._context;
        $('#go-to-address').click(function () {
            var searchPath = $('#root-address').val();
            searchPath = searchPath.split('\\');
            if (searchPath[0] !== 'ROOT') {
                alert('No such address called:' + searchPath);
            }
            var currentFolderId = 0;
            var flag = true;
            var index = 1;
            while (flag && index < searchPath.length) {
                var file = fileSystem_1.fileSystem.getItem(currentFolderId);
                if (fileSystem_1.fileSystem.isFileNameExist(currentFolderId, searchPath[index], 'directory')) {
                    if (file instanceof folder_1.Folder || file instanceof file_1.File) {
                        for (var i = 0; i < file._children.length; i++) {
                            if (file._children[i]._name === searchPath[index]) {
                                currentFolderId = file._children[i]._id;
                            }
                        }
                    }
                }
                else {
                    alert('no path called ' + ($('#root-address').val()));
                    flag = false;
                }
                index++;
            }
            context.drawContent(currentFolderId);
        });
    };
    UI.prototype.addListenerClickToCreateFolder = function () {
        var context = this._context;
        $('#create_directory').click(function () {
            var folderName = prompt("folder name:");
            if (folderName === '') {
                folderName = "new folder";
            }
            if (folderName !== null) {
                folderName = fileSystem_1.fileSystem.getUnduplicatedFileName(targetId, folderName, 'directory');
                fileSystem_1.fileSystem.addFolder(folderName, targetId);
                context.drawContent(targetId);
                if ($('#img_' + targetId).attr('src') === 'icons/close.png') {
                    context.openBrowserDirectory(targetId);
                }
                else {
                    context.appendNewUl(targetId, fileSystem_1.fileSystem.getLastId(), folderName);
                }
                fileSystem_1.fileSystem.savingToLocalStorage();
            }
        });
    };
    UI.prototype.addListenerClickToCreateFile = function () {
        var context = this._context;
        $('#create_file').click(function () {
            var fileName = prompt('file Name:');
            if (fileName === '') {
                fileName = 'new file';
            }
            if (fileName !== null) {
                fileName = fileSystem_1.fileSystem.getUnduplicatedFileName(targetId, fileName, 'file');
                fileSystem_1.fileSystem.addFile(fileName, targetId, '');
                context.drawContent(targetId);
            }
            fileSystem_1.fileSystem.savingToLocalStorage();
        });
    };
    UI.prototype.addListenerClickToRename = function () {
        var context = this._context;
        $('#rename_file').click(function () {
            $('#context_menu').fadeOut(200);
            var newName = prompt('Rename');
            var targetFile = fileSystem_1.fileSystem.getItem(targetId);
            var theParent = fileSystem_1.fileSystem.findParent(targetId);
            if ((targetFile instanceof folder_1.Folder || targetFile instanceof file_1.File) && (theParent instanceof folder_1.Folder || theParent instanceof file_1.File)) {
                if (newName !== targetFile._name) {
                    context.closeBrowserDirectory(theParent._id);
                    targetFile._name = newName;
                    context.openBrowserDirectory(theParent._id);
                    if (currentLocationId == theParent._id) {
                        context.drawContent(theParent._id);
                    }
                }
            }
            else {
                alert('name already exists');
            }
            targetId = -1;
            fileSystem_1.fileSystem.savingToLocalStorage();
        });
    };
    UI.prototype.updateCurrentRootAddress = function (fileId) {
        var folderNameArr = [];
        var folderName = '';
        var address = '';
        while (fileId > -1) {
            var file = fileSystem_1.fileSystem.getItem(fileId);
            if (file instanceof folder_1.Folder || file instanceof file_1.File) {
                folderNameArr.push(file._name);
                fileId = file._parentId;
            }
        }
        while (folderNameArr.length > 0) {
            folderName = folderNameArr.pop();
            folderName += '\\';
            address += folderName;
        }
        address = address.substring(0, address.length - 1);
        $('#root-address').val(address);
    };
    UI.prototype.createSystem = function () {
        var system = JSON.parse(localStorage.getItem('FileSystem'));
        if (system !== null) {
            this.drawingTheSavedSystem(system);
        }
    };
    UI.prototype.drawingTheSavedSystem = function (system) {
        for (var i = 1; i < system.length; i++) {
            if (system[i][2] === "directory") {
                fileSystem_1.fileSystem.addFolder(system[i][1], system[i][3]);
            }
            if (system[i][2] === "file") {
                fileSystem_1.fileSystem.addFile(system[i][1], system[i][3], system[i][4]);
            }
        }
    };
    UI.prototype.drawingTheContentFileWithADiv = function (fileId) {
        var newEditFileWindow = editFileWindow.clone();
        $('#content').append(newEditFileWindow);
        newEditFileWindow.show();
        var targetFile = fileSystem_1.fileSystem.getItem(fileId);
        if (targetFile instanceof file_1.File) {
            $('#file-text').val(targetFile._content);
            $('#save').click(function () {
                var targetFile = fileSystem_1.fileSystem.getItem(fileId);
                if (targetFile instanceof file_1.File) {
                    targetFile.setContent($('#file-text').val());
                }
                newEditFileWindow.remove();
                fileSystem_1.fileSystem.savingToLocalStorage();
            });
            $('#exit').click(function () {
                newEditFileWindow.remove();
            });
        }
    };
    UI.prototype.goBack = function () {
        var context = this._context;
        $('#back').click(function () {
            if (history_1.history._historyForGoingBack.length > 0) {
                var folderHistoryToGoBack = history_1.history.getLastIdInHistory();
                history_1.history._historyForGoingForward.push(folderHistoryToGoBack);
                context.drawContent(folderHistoryToGoBack);
            }
            else {
                context.drawContent(0);
            }
        });
        $('#forward').click(function () {
            if (history_1.history._historyForGoingForward.length > 0) {
                var folderInHistoryToGoForward2 = history_1.history._historyForGoingForward.pop();
                history_1.history.addToHistory(folderInHistoryToGoForward2);
                context.drawContent(folderInHistoryToGoForward2);
            }
        });
    };
    return UI;
}());
exports.userInterface = new UI();
// addListenerDblClickToContentFileIcon(icon) {
//     const context = this._context;
//     icon.css({'cursor' : 'pointer'});
//     if (icon.attr("src") === 'close.png'){
//         icon.click(function () {
//             context.codrawContent(parseInt($(this).attr("index")));
//             context.myHistoryNavigation.addToHistory(parseInt($(this).attr("index")));;
//         });
//     } else if(icon.attr('src') === 'text.png') {
//         icon.click(function () {
//             context.drawingTheContentFileWithADiv(parseInt($(this).attr('index')));
//         })
//     }
// }
//
//     const conrext = this._context
//     a1.click(fun(){
//         this // element
//     //ui --> context
// })}) 
//# sourceMappingURL=ui.js.map