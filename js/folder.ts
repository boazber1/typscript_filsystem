"use strict";


export class Folder{
        _id: number;
        _name: string;
        _type: string;
        _content: string;
        _parentId: number;
        _children: any;

    constructor(id: number, name: string, type: string, content: string, parentId: number){
        this._id = id;
        this._name = name;
        this._type = type;
        this._content = content;
        this._parentId = parentId;
        this._children = [];
    }

    rename (name: string): void{
        this._name = name;
    };

    getType (type: string): boolean{
        return (this._type === type)
    };

    addChild (file: Object):void{
        this._children.push(file);
    };

    deleteChild  (id: number): void {
        let i = 0;
        while (i < this._children.length){
            if (this._children[i]._id === id){
                this._children.splice(i, 1);
                break;
            }
            i++;
        }
    };

}