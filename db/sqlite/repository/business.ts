import { Database } from 'sqlite';
import { BusinessModel } from '../model/business';

export class BusinessRepository {
    private connection:Database;

    constructor(connection: Database) {
        this.connection = connection;
    }

    async getBusinessById(id: number): Promise<BusinessModel | undefined> {
        const sql = `SELECT * FROM business WHERE id = ?`;
        const row = await this.connection.get(sql, [id]);
        return row as BusinessModel | undefined;
    }

    async getBusinesses(): Promise<BusinessModel[]> {
        const sql = `SELECT * FROM business`;
        const rows = await this.connection.all(sql);
        return rows as BusinessModel[];
    }
}