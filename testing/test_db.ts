import sqlite3 from "sqlite3"
import { open } from "sqlite"

import { BusinessRepository } from '../db/sqlite/repository/business'
import fs from 'fs';


async function main() {
    let db = await open({
        filename: 'testing.db',
        driver: sqlite3.Database
    });

    // seed the database
    // run sql scripts in docs folder

    //db.exec(fs.readFileSync(__dirname + '/../db/sqlite/docs/init.sql').toString());
    //db.exec(fs.readFileSync(__dirname + '/../db/sqlite/docs/seed.sql').toString());

    let businessRepo = new BusinessRepository(db);

    let businesses = await businessRepo.getBusinesses();

    console.log(businesses);    
}

main().then(() => {});
