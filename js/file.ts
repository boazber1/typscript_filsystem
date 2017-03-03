"use strict";
export class File{

    _id: number;
    _name: string;
    _type: string;
    _content: string;
    _parentId: number;
    _children: any[];

    constructor(id: number, name: string, type: string, content: string, parentId: number){
        this._id = id;
        this._name = name;
        this._type = type;
        this._content = content;
        this._parentId = parentId;
        this._children = [];
    }

    rename(name: string): void{
        this._name = name;
    };

    getType(type: string): boolean{
        return (this._type === type);
    };

    setContent(content: string): void {
        this._content = content;
    };
}