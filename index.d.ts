
declare module "quick.db2" {
	import Database from "better-sqlite3";
		
	class Table {
		db: Database.Database;
		table: string;
		constructor(db: Database.Database, table: string);
		all(): {
			key: string;
			value: any;
		}[];
		get(key: string): any;
		set(key: string, value: any): any;
		delete(key: string): boolean;
		clear(): number | null;
		has(key: string, value: number): boolean;
		operate(key: string, value: number): void;
		add(key: string, value: number): any;
		subtract(key: string, value: number): any;
		push(key: string, ...values: any[]): any;
	}
	interface Fn {
		(table?: string): Table;
		$: (table?: string) => Table;
		init: (
			fileName?: string
		) => Fn
	}
	const fn: Fn
	export default fn;
}
