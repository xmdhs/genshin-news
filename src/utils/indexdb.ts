import { DBSchema, IDBPDatabase, openDB } from "idb";
import { List } from "../interface/ContentList";

interface DB extends DBSchema {
    'list': {
        key: string;
        value: List;
        indexes: { 'channelId': string };
    };
    total: {
        key: string;
        value: number;
    }
}

let db: IDBPDatabase<DB> | null = null;

export async function useDB() {
    if (db != null) {
        return db
    }
    db = await openDB<DB>("genshin", 1, {
        upgrade(db) {
            db.createObjectStore("list", {
                keyPath: "id"
            });
            db.createObjectStore("total")
        }
    })
    return db
}