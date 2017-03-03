"use strict";
import {FileSystem, fileSystem} from "./fileSystem";
import {HistoryLog, history} from "./history";
import {File} from "./file";
import {Folder} from "./folder";

let targetId = -1;
let currentLocationId = -1;
let editFileWindow = $('#text-file-container').clone();


class UI{

    _fileSystem: FileSystem;
    _history: HistoryLog;
    _context: UI;

    constructor(){
        this._fileSystem = fileSystem;
        this._history = history;
        this._context = this;
    }

    render(){
        this.createSystem();
        this.initBrowser();
        this.initContextMenu();
        this.goBack();
        $('#text-file-container').remove;
    }

    /* Browser Functions */

    initBrowser(): void {
        const context = this._context;
        let root = fileSystem.getItem(0);
        if (root instanceof Folder || root instanceof File) {
            var rootUl = context.createNewUlWithId(0, root._name);
        }
        $('#browser_ul').append(rootUl);

    }

    openBrowserDirectory(folderId: number): void {
        const context = this._context;
        $('#img_' + folderId).attr('src', 'icons/open.png');
        let directory = fileSystem.getItem(folderId);
        if (directory instanceof Folder || directory instanceof File) {
            for (let i = 0; i < directory._children.length; i++) {
                let currentChild = directory._children[i];
                if (currentChild.getType('directory')) {
                    context.appendNewUl(folderId, currentChild._id, currentChild._name);
                }
            }
        }
    }

    closeBrowserDirectory(folderId: number): void {
        $('#img_'+folderId).attr('src', 'icons/close.png');
        let directory = fileSystem.getItem(folderId);
        if (directory instanceof Folder || directory instanceof File) {
            for (let i = 0; i < directory._children.length; i++) {
                if (directory._children[i].getType('directory')) {
                    $('#browser_ul_' + directory._children[i]._id).remove();
                }
            }
        }
    }

    appendNewUl(parentId: number, childId: number, childName: string): void {
        const context = this._context;
        $('#browser_ul_'+parentId).append(context.createNewUlWithId(childId, childName));
    }

    createNewUlWithId(id: number, name: string): any {
        const context = this._context;
        let newUl = $('<li><ul class="b_ul" id="browser_ul_'+id+'">' +
            '<img class ="dir" src="icons/close.png" id="img_'+id+'" index="'+id+'">' +
            '<a href="#" id="a_'+id+'" index="'+id+'">'+name+'</a></ul></li>');
        context.addListenerClickToATitle(newUl.find('a'));
        context.addListenerRightClickToOpenContextMenuWithTargetId(newUl.find('a'));
        context.addListenerClickToFolderIcon(newUl.find('img'));
        return newUl;
    }

    /* Content Function */

    drawContent(folderId: number): void{
        const context = this._context;
        $('#content').empty();
        currentLocationId = folderId;
        let directory = fileSystem.getItem(folderId);
        if (directory instanceof Folder || directory instanceof File) {
            for (let i = 0; i < directory._children.length; i++) {
                let currentChild = directory._children[i];
                context.drawFileOnContent(currentChild);
            }
        }
        context.updateCurrentRootAddress(folderId)
    }

    drawFileOnContent(file: any): void {
        const context = this._context;
        let imgSrc ='';
        switch(file._type){
            case 'directory':
                imgSrc = 'icons/close.png';
                break;

            case 'file':
                imgSrc = 'icons/text.png';
                break;
        }
        let newFile = $('<span><img class="content_icon" src="'+imgSrc+'" index="'+file._id+'">' +
            '<span class="content_file_text">'+file._name+'</span></span>');

        context.addListenerDblClickToContentFileIcon(newFile.find('img'));
        context.addListenerRightClickUpdateTargetId(newFile.find('img'));
        $('#content').append(newFile);
    }


    initContextMenu(): void {
        const context = this._context;
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
        context.addListenerClickToDelete();//?
        context.addListenerClickToGoToButton();
    }

    openContextMenu(posX: number, posY: number): void {
        if (targetId > -1){
            let contextMenu = $('#context_menu');
            contextMenu.css('top', posY+5);
            contextMenu.css('left', posX+5);
            $('.table_div').append(contextMenu);
            contextMenu.fadeIn(200);
        }
    }

    /* Listeners: */

    addListenerClickToFolderIcon(icon: any): void {
        const context = this._context;
        icon.click(function () {
            if ($(this).attr('src') === 'icons/close.png'){
                context.openBrowserDirectory(parseInt($(this).attr("index")));
            } else {
                context.closeBrowserDirectory(parseInt($(this).attr("index")));
            }
        });
    }

    addListenerClickToATitle(aTitle: any): void {
        const context = this._context;
        aTitle.click(function () {
            context.drawContent(parseInt($(this).attr("index")));
        });
    }

    addListenerDblClickToContentFileIcon(icon: any): void {
        const context = this._context;
        icon.css({'cursor' : 'pointer'});
        if (icon.attr("src") === 'icons/close.png'){
            icon.click(function () {
                context.drawContent(parseInt($(this).attr("index")));
                context._history.addToHistory(parseInt($(this).attr("index")));
            });
        } else if(icon.attr('src') === 'icons/text.png') {
            icon.click(function () {
                context.drawingTheContentFileWithADiv(parseInt($(this).attr('index')));
            });


        }
    }

    addListenerRightClickToOpenContextMenu(item: any): void {
        const context = this._context;
        item.mousedown(function (event) {
            if (event.button === 2) {
                if (targetId === -1) {
                    targetId = currentLocationId;

                }
                context.openContextMenu(event.pageX, event.pageY);
            }
        });
    }

    addListenerRightClickToOpenContextMenuWithTargetId(item: any): void {
        const context = this._context;
        item.mousedown(function (event) {
            if (event.button === 2) {
                targetId = parseInt($(this).attr("index"));
                context.openContextMenu(event.pageX, event.pageY);

            }
        });
    }

     addListenerClickToDelete(): void {
         const context = this._context;
    $('#delete_file').click(function () {
        $('#context_menu').fadeOut(200);

        let theParent = fileSystem.findParent(targetId);
        if (theParent instanceof Folder ) {
            context.closeBrowserDirectory(theParent._id);
            theParent.deleteChild(targetId);
            fileSystem.deleteItem(targetId);
            context.openBrowserDirectory(theParent._id);

            context.drawContent(theParent._id);
        }
        fileSystem.savingToLocalStorage();
        targetId = -1;
    });
}

    addListenerRightClickUpdateTargetId(icon: any): void {
        icon.mousedown(function (event) {
                if (event.button === 2) {
                    targetId = parseInt($(this).attr("index"));
                }
            }
        )
    }

    addListenerClickToGoToButton(): void {
        const context = this._context;

        $('#go-to-address').click(function () {
            let searchPath = $('#root-address').val();
            searchPath = searchPath.split('\\');
            if(searchPath[0] !== 'ROOT'){
                alert('No such address called:' + searchPath);
            }

            let currentFolderId = 0;
            let flag = true;
            let index = 1;

            while(flag && index < searchPath.length  ){
                let file = fileSystem.getItem(currentFolderId);
                if(fileSystem.isFileNameExist(currentFolderId, searchPath[index], 'directory')){
                    if (file instanceof Folder || file instanceof File) {
                        for (let i = 0; i < file._children.length; i++) {
                            if (file._children[i]._name === searchPath[index]) {
                                currentFolderId = file._children[i]._id;
                            }
                        }
                    }
                } else {
                    alert('no path called ' + ($('#root-address').val()));
                    flag = false;
                }
                index++
            }
            context.drawContent(currentFolderId);
        });
    }

    addListenerClickToCreateFolder(): void {
        const context = this._context;
        $('#create_directory').click(function () {
            let folderName = prompt("folder name:");
            if (folderName === ''){
                folderName = "new folder";
            }
            if (folderName !== null){
                folderName = fileSystem.getUnduplicatedFileName(targetId, folderName, 'directory');
                fileSystem.addFolder(folderName, targetId);
                context.drawContent(targetId);
                if($('#img_'+targetId).attr('src') === 'icons/close.png' ){
                    context.openBrowserDirectory(targetId);
                } else {
                    context.appendNewUl(targetId, fileSystem.getLastId(),folderName);
                }
                fileSystem.savingToLocalStorage();
            }
        });

    }

    addListenerClickToCreateFile(): void {
        const context = this._context;
        $('#create_file').click(function () {
            let fileName = prompt('file Name:');
            if (fileName === ''){
                fileName = 'new file';
            }
            if(fileName !== null){
                fileName = fileSystem.getUnduplicatedFileName(targetId, fileName, 'file');
                fileSystem.addFile(fileName, targetId, '');
                context.drawContent(targetId);
            }
            fileSystem.savingToLocalStorage();
        });
    }

    addListenerClickToRename(): void {
        const context = this._context;
        $('#rename_file').click(function () {

            $('#context_menu').fadeOut(200);
            let newName = prompt('Rename');
            let targetFile = fileSystem.getItem(targetId);
            let theParent = fileSystem.findParent(targetId);
            if((targetFile instanceof Folder || targetFile instanceof File) && (theParent instanceof Folder || theParent instanceof File) ){
            if(newName !== targetFile._name) {
                context.closeBrowserDirectory(theParent._id);
                targetFile._name = newName;
                context.openBrowserDirectory(theParent._id);
                if (currentLocationId == theParent._id) {
                    context.drawContent(theParent._id);
                }
            }

            } else {
                alert('name already exists')
            }
            targetId = -1;
            fileSystem.savingToLocalStorage();

        });



    }


    updateCurrentRootAddress(fileId: number){
        let folderNameArr = [];
        let folderName = '';
        let address = '';
        while (fileId > -1 ) {
            let file = fileSystem.getItem(fileId);
            if (file instanceof Folder || file instanceof File) {
                folderNameArr.push(file._name);
                fileId = file._parentId;
            }
        }

        while (folderNameArr.length > 0){
            folderName = folderNameArr.pop();
            folderName +='\\';
            address += folderName;

        }
        address = address.substring(0, address.length-1);
        $('#root-address').val(address);
    }

    createSystem(){//need new fs?
        let system = JSON.parse(localStorage.getItem('FileSystem'));
        if(system !== null){
            this.drawingTheSavedSystem(system);
        }
    }

    drawingTheSavedSystem(system){
        for(var i = 1; i < system.length; i++){
            if(system[i][2] ==="directory"){
                fileSystem.addFolder(system[i][1],system[i][3])
            }
            if(system[i][2] === "file"){
                fileSystem.addFile(system[i][1],system[i][3],system[i][4])
            }
        }
    }

    drawingTheContentFileWithADiv(fileId: number): void  {
        let newEditFileWindow = editFileWindow.clone();
        $('#content').append(newEditFileWindow);
        newEditFileWindow.show();
        let targetFile = fileSystem.getItem(fileId);
        if(targetFile instanceof  File) {
            $('#file-text').val(targetFile._content);
            $('#save').click(function () {
                let targetFile = fileSystem.getItem(fileId);
                if (targetFile instanceof File) {
                    targetFile.setContent($('#file-text').val());
                }
                newEditFileWindow.remove();
                fileSystem.savingToLocalStorage();
            })
            $('#exit').click(function () {
                newEditFileWindow.remove();
            })
        }

    }


    goBack(): void {
        const context = this._context;
        $('#back').click(function () {
            if (history._historyForGoingBack.length > 0) {
                var folderHistoryToGoBack = history.getLastIdInHistory();
                history._historyForGoingForward.push(folderHistoryToGoBack);
                context.drawContent(folderHistoryToGoBack);
            } else {
                context.drawContent(0);
            }
        });

        $('#forward').click(function () {
            if (history._historyForGoingForward.length > 0) {
                var folderInHistoryToGoForward2 = history._historyForGoingForward.pop();
                history.addToHistory(folderInHistoryToGoForward2);
                context.drawContent(folderInHistoryToGoForward2);
            }
        })
    }























//THE end
}

export const userInterface = new UI();



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