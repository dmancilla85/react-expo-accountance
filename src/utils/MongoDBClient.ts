import { Db, MongoClient } from 'mongodb';

export default class MongoDBClient {
  private static instance: MongoDBClient;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  public isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  public async checkConnection(): Promise<Db> {
    if (!this.isConnected()) {
      const uri = process.env.REACT_APP_MONGODB_CONN;
      if (!uri) {
        throw new Error('MongoDB connection string is not defined in environment variables.');
      }
      await this.connect(uri, 'accountance_db');
    }

    return this.db!; // Ensure db is not null
  }

  public async connect(uri: string, dbName: string): Promise<Db> {
    try {
      if (!this.client) {
        this.client = new MongoClient(uri);
        await this.client.connect();
        this.db = this.client.db(dbName);
      }
      return this.db!;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw new Error('MongoDB connection failed');
    }
  }

  public getDb(): Db | null {
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected()) {
      console.warn('MongoDB client is not connected.');
      return;
    }

    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
      }
    } catch (error) {
      console.error('Failed to disconnect from MongoDB:', error);
    }
  }
}
