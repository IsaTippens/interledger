import {Database} from "sqlite3"

import { BusinessRepository } from '../db/sqlite/repository/business'
import fs from 'fs';


async function main() {
    let db = new Database('testing.db');
    // seed the database
    // run sql scripts in docs folder

    db.exec(fs.readFileSync(__dirname + '/../db/sqlite/docs/init.sql').toString());
    db.exec(fs.readFileSync(__dirname + '/../db/sqlite/docs/seed.sql').toString());

    let businessRepo = new BusinessRepository(db);

    let businesses = await businessRepo.getBusinesses();

    console.log(businesses);    
}

main().then(() => {});
