import { Database } from 'sqlite3';
import { BusinessModel } from '../model/business';

export class BusinessRepository {
    private connection:Database;

    constructor(connection: Database) {
        this.connection = connection;
    }

    async getBusinessById(id: number): Promise<BusinessModel | undefined> {
        const sql = `SELECT * FROM business WHERE id = ?`;
        return new Promise((resolve, reject) => this.connection.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row as BusinessModel);
        }));
    }

    async getBusinessByCatergory(category: string): Promise<BusinessModel | undefined> {
        const sql = `SELECT * FROM business WHERE category = ?`;
        return new Promise((resolve, reject) => this.connection.get(sql, [category], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row as BusinessModel);
        }));
    }

    async getBusinesses(): Promise<BusinessModel[]> {
        const sql = `SELECT * FROM business`;
        return new Promise((resolve, reject) => this.connection.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows as BusinessModel[]);
        }));
    }
}