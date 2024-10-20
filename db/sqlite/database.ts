import sqlite3 from "sqlite3"
import {  Database as SqliteDatabase } from "sqlite3"


class Database {
    private client: SqliteDatabase | undefined;

    constructor() {
        this.client = new SqliteDatabase("testing.db");
    }



  public getClient(): SqliteDatabase {
    if (!this.client) {
      throw new Error('Database not connected.');
    }
    return this.client;
  }
}

const database = new Database();
export default database.getClient();