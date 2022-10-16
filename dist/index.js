"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const table_1 = require("./class/table");
let _init = 0, db;
function fn(table) {
    if (!_init)
        throw new Error("Database is not initized.");
    table = table || "data";
    return new table_1.Table(db, table);
}
fn.init = function init(file) {
    file = file || "data.sqlite";
    db = new better_sqlite3_1.default(file);
    _init = 1;
    return fn;
};
module.exports = fn;
//# sourceMappingURL=index.js.map