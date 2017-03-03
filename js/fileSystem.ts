"use strict";
import {Folder} from "./folder";
import {File} from "./file";

export class FileSystem{

    _root: Folder;
    _files: any[];

    constructor(){
        this._root = new Folder(0, 'ROOT', 'directory', '', -1);
        this._files = [];
        this._files.push(this._root);
    }

    addFolder(name: string, parentId: number):void {
        let newFile = new Folder(this._files.length, name, 'directory', '', parentId);
        this._files.push(newFile);
        this._files[parentId].addChild(newFile);
    };

    addFile = function (name: string, parentId: number, content: string): void {//
        let newTextFile = new File(this._files.length, name, 'file', content, parentId);
        this._files.push(newTextFile);
        this._files[parentId].addChild(newTextFile);
    };

    deleteItem (id: number) {
        let fileToDelete = this._files[id];
        let parentFile = this._files[fileToDelete._parentId];
        parentFile.deleteChild(fileToDelete);

        for (let i = 0; i < this._files.length; i++) {
            if (this._files[i]) {
                if (this._files[i]._parentId == fileToDelete._id) {
                    this.deleteItem(this._files[i]._id);
                }
            }
        }

        this._files[id] = undefined;
    };

    getItem(id: number): Object {
        return this._files[id];
    };

    getLastId() :number {
        return this._files.length -1;
    };

    isFileNameExist (fileId: number, name: string, type: string): boolean{
        var file = this.getItem(fileId);
        if(file instanceof Folder || file instanceof File){
            for (var i = 0; i < file._children.length; i++){
                if(file._children[i]._type === type && file._children[i]._name === name){
                    return true;
                }
            }
        }
        return false;
    };

    getUnduplicatedFileName (folderId: number, name: string, type: string): string{
        let fileName = name;
        let counter = 0;
        let flag = true;

        while (flag){
            if (counter > 0){
                fileName = name + '(' +counter + ')';
            }
            if (!this.isFileNameExist(folderId, fileName, type)){
                flag = false;
            }
            counter++;
        }
        return fileName;
    }

    findParent(id: number): Object {
        let targetFile = this._files[id];
        let parent = this._files[targetFile._parentId];
        return parent;
    }

    savingToLocalStorage(): void{
        let saveArray = [];
        for(let i = 0; i < this._files.length; i++){
            if(this._files[i]) {
                saveArray.push([this._files[i]._id, this._files[i]._name, this._files[i]._type,
                    this._files[i]._parentId, this._files[i]._content]);
            }
        }
        localStorage.setItem('FileSystem',JSON.stringify(saveArray));
    };


}

export const fileSystem = new FileSystem();