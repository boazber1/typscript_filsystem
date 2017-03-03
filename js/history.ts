"use strict";

export class HistoryLog{

    _historyForGoingBack: number[];
    _historyForGoingForward: number[];

    constructor(){
        this._historyForGoingBack = [];
        this._historyForGoingForward = [];
    }

    addToHistory(id: number):void {
        this._historyForGoingBack.push(id);
    };

    getLastIdInHistory (): number {
        let targetId = this._historyForGoingBack.pop();
        return targetId;
    };
}

export const history = new HistoryLog();

