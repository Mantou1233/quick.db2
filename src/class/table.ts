import * as Database from "better-sqlite3";
import _ from "lodash";

export class Table<T extends Database.Database = Database.Database> {
    db: T;
    table: string;
    constructor(db: T, table: string) {
        this.db = db;
        this.table = table;
        db.prepare(
            `CREATE TABLE IF NOT EXISTS ${table} (ID TEXT, json TEXT)`
        ).run();
    }

    public all() {
        let { db, table } = this;
        let data = db.prepare(`SELECT * FROM ${table} WHERE ID IS NOT NULL`);
        let values: {
            key: string,
            value: any
        }[] = [];
        for (const row of data.iterate()) {
            try {
                let value = JSON.parse(row.json);
                values[row.ID] = value;
            } catch (e) {}
        }
        return values;
    }

    public get(key: string) {
        let { db, table } = this;
        let tree: string | boolean = false;
        if (key.includes(".")) {
            const tmp = key.split(".");
            key = tmp[0];
            tmp.shift();
            tree = tmp.join(".");
        }
        let data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        if (!data) return null; // If empty, return null
        data = JSON.parse(data.json);

        // Check if target was supplied
        if (tree) data = _.get(data, tree) ?? null; // Get prop using dot notation
        return data;
    }

    public set(key: string, value) {
        let { db, table } = this;
        let tree: string | boolean = false;
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
            db.prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`).run(
                key,
                "{}"
            );
            data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        }

        // Parse fetched
        data = JSON.parse(data.json);
        // Check if a target was supplied
        if (typeof data === "object" && tree) {
            data = _.set(data, tree, value);
        } else if (tree) throw new TypeError("Cannot target a non-object.");
        else data = value;

        data = JSON.stringify(data);

        db.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(
            data,
            key
        );

        data = db
            .prepare(`SELECT * FROM ${table} WHERE ID = (?)`)
            .get(key).json;
        if (data === "{}") return null;
        else {
            data = JSON.parse(data);
            return data;
        }
    }

    public delete(key: string) {
        let { db, table } = this;
        let tree: string | boolean = false;
        if (key.includes(".")) {
            const tmp = key.split(".");
            key = tmp[0];
            tmp.shift();
            tree = tmp.join(".");
        }

        let data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        if (!data) return false;
        else data = JSON.parse(data.json);

        if (typeof data === "object" && tree) {
            _.unset(data, tree);
            data = JSON.stringify(data);
            db.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(
                data,
                key
            );
            return true;
        } else if (tree) throw new TypeError("Target is not an object.");
        else db.prepare(`DELETE FROM ${table} WHERE ID = (?)`).run(key);

        return true;
    }

    public clear(){
        let { db, table } = this;

        let data = db.prepare(`DELETE FROM ${table}`).run();
        if(!data) return null;
        
        // Return Amount of Rows Deleted
        return data.changes;
    }

    public has(key: string, value: number) {
        let { db, table } = this;
        let tree: string | boolean = false;
        if (key.includes(".")) {
            const tmp = key.split(".");
            key = tmp[0];
            tmp.shift();
            tree = tmp.join(".");
        }

        let data = db.prepare(`SELECT * FROM ${table} WHERE ID = (?)`).get(key);
        if(tree) data = _.get(data, tree);
        if (!data) return false;
        return true;
    }

    public operate(key: string, value: number) {
        let tmp = key
        if (key.includes(".")) tmp = key.split(".")[0];
        let data = this.get(key);
        if (data === null) data = 0;
        if (isNaN(+data)) throw new Error("the origin data is not a number!");
        if (isNaN(value))
            throw new TypeError("the given value is not a number!");
        if (!isFinite(value))
            throw new Error("the given value will not be able to operate!");

        data += value;

        if (isNaN(data))
            throw new Error(
                "the added data is not a number!! it might be too big to add on."
            );

        this.set(key, data);
        return this.get(tmp);
    }

    public add(key: string, value: number) {
        return this.operate(key, +value);
    }

    public subtract(key: string, value: number) {
        return this.operate(key, -value);
    }

    public push(key: string, ...values: any[]) {
        let tmp = key
        if (key.includes(".")) tmp = key.split(".")[0];
        let data = this.get(key);
        data = data ?? [];
        if (!Array.isArray(data)) throw new Error("the origin is not a array!");

        data.push(...values);

        console.log(key)
        this.set(key, data);
        return this.get(tmp);
    }
}
