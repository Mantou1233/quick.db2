import * as Database from "better-sqlite3";
import { Table } from "./src/class/table";

declare module 'quick.db2' {
	export interface Fn {
		(table: string): Table;
		init: (
			fileName: string
		) => Table
	}
}