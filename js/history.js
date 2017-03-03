"use strict";
var HistoryLog = (function () {
    function HistoryLog() {
        this._historyForGoingBack = [];
        this._historyForGoingForward = [];
    }
    HistoryLog.prototype.addToHistory = function (id) {
        this._historyForGoingBack.push(id);
    };
    ;
    HistoryLog.prototype.getLastIdInHistory = function () {
        var targetId = this._historyForGoingBack.pop();
        return targetId;
    };
    ;
    return HistoryLog;
}());
exports.HistoryLog = HistoryLog;
exports.history = new HistoryLog();
//# sourceMappingURL=history.js.map