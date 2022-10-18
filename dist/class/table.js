"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const lodash_1 = __importDefault(require("lodash"));
class Table {
    db;
    table;
    constructor(db, table) {
        this.db = db;
        this.table = table;
        db.prepare(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, json TEXT)`).run();
    }
    all() {
        let { db, table } = this;
        let data = db.prepare(`SELECT * FROM ${table} WHERE ID IS NOT NULL`);
        let values = [];
        for (const row of data.iterate()) {
            try {
                let value = JSON.parse(row.json);
                values.push({
                    key: row.ID, value
                });
            }
            catch (e) { }
        }
        return values;
    }
    get(key) {
        let { db, table } = this;
        let tree = false;
        if (key.includes(".")) {
            const tmp = key.split(".");
            key = tmp[0];
            tmp.shift();
            tree = tmp.join(".");
        }
        let data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        if (!data)
            return null; // If empty, return null
        data = JSON.parse(data.json);
        // Check if target was supplied
        if (tree)
            data = lodash_1.default.get(data, tree) ?? null; // Get prop using dot notation
        return data;
    }
    set(key, value) {
        let { db, table } = this;
        let tree = false;
        if (key.includes(".")) {
            const tmp = key.split(".");
            key = tmp[0];
            tmp.shift();
            tree = tmp.join(".");
        }
        // Fetch entry
        let data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        // If not found, create empty row
        if (!data) {
            db.prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`).run(key, "{}");
            data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        }
        // Parse fetched
        data = JSON.parse(data.json);
        // Check if a target was supplied
        if (typeof data === "object" && tree) {
            data = lodash_1.default.set(data, tree, value);
        }
        else if (tree)
            throw new TypeError("Cannot target a non-object.");
        else
            data = value;
        data = JSON.stringify(data);
        db.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(data, key);
        data = db
            .prepare(`SELECT * FROM ${table} WHERE ID = (?)`)
            .get(key).json;
        if (data === "{}")
            return null;
        else {
            data = JSON.parse(data);
            return data;
        }
    }
    delete(key) {
        let { db, table } = this;
        let tree = false;
        if (key.includes(".")) {
            const tmp = key.split(".");
            key = tmp[0];
            tmp.shift();
            tree = tmp.join(".");
        }
        let data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        if (!data)
            return false;
        else
            data = JSON.parse(data.json);
        if (typeof data === "object" && tree) {
            lodash_1.default.unset(data, tree);
            data = JSON.stringify(data);
            db.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(data, key);
            return true;
        }
        else if (tree)
            throw new TypeError("Target is not an object.");
        else
            db.prepare(`DELETE FROM ${table} WHERE ID = (?)`).run(key);
        return true;
    }
    clear() {
        let { db, table } = this;
        let data = db.prepare(`DELETE FROM ${table}`).run();
        if (!data)
            return null;
        // Return Amount of Rows Deleted
        return data.changes;
    }
    has(key, value) {
        let { db, table } = this;
        let tree = false;
        if (key.includes(".")) {
            const tmp = key.split(".");
            key = tmp[0];
            tmp.shift();
            tree = tmp.join(".");
        }
        let data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        if (tree)
            data = lodash_1.default.get(data, tree);
        if (!data)
            return false;
        return true;
    }
    operate(key, value) {
        let tmp = key;
        if (key.includes("."))
            tmp = key.split(".")[0];
        let data = this.get(key);
        if (data === null)
            data = 0;
        if (isNaN(+data))
            throw new Error("the origin data is not a number!");
        if (isNaN(value))
            throw new TypeError("the given value is not a number!");
        if (!isFinite(value))
            throw new Error("the given value will not be able to operate!");
        data += value;
        if (isNaN(data))
            throw new Error("the added data is not a number!! it might be too big to add on.");
        this.set(key, data);
        return this.get(tmp);
    }
    add(key, value) {
        return this.operate(key, +value);
    }
    subtract(key, value) {
        return this.operate(key, -value);
    }
    push(key, ...values) {
        let tmp = key;
        if (key.includes("."))
            tmp = key.split(".")[0];
        let data = this.get(key);
        data = data ?? [];
        if (!Array.isArray(data))
            throw new Error("the origin is not a array!");
        data.push(...values);
        this.set(key, data);
        return this.get(tmp);
    }
}
exports.Table = Table;
//# sourceMappingURL=table.js.map