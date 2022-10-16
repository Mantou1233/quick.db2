import Database from "better-sqlite3";
import { Table } from "./class/table";

let _init = 0, db;

function fn(table){
	if(!_init) throw new Error("Database is not initized.");
	table = table || "data";
	return new Table(db, table);
}

fn.init = function init(file){
	file = file || "data.sqlite";
	db = new Database(file);
	_init = 1;
	return fn;
}

module.exports = fn;