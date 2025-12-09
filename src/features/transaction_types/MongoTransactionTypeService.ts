import Repository from '../../shared/types/Repository';
import MongoDBClient from '../../utils/MongoDBClient';
import TransactionType from './TransactionType';
import TransactionTypeService from './TransactionTypeService';

const COLLECTION_NAME = 'transaction_types';

export default class MongoTransactionTypeService implements TransactionTypeService {
  private dbClient = MongoDBClient.getInstance();
  private transactionTypeRepository: Repository<TransactionType>;

  constructor(transactionTypeRepository: Repository<TransactionType>) {
    this.transactionTypeRepository = transactionTypeRepository;
  }

  public async addTransactionType(transactionType: TransactionType): Promise<void> {
    const db = await this.dbClient.checkConnection();
    await db.collection(COLLECTION_NAME).insertOne({
      transactionType_id: transactionType.id,
      description: transactionType.description,
      isCredit: transactionType.isCredit,
    });
  }

  public async getTransactionTypes(): Promise<TransactionType[]> {
    const db = await this.dbClient.checkConnection();
    const docs = await db.collection(COLLECTION_NAME).find().toArray();
    return docs.map((doc: any) => new TransactionType(doc._id, doc.description, doc.isCredit));
  }

  public async updateTransactionType(transactionType: TransactionType): Promise<void> {
    const db = await this.dbClient.checkConnection();
    await db
      .collection(COLLECTION_NAME)
      .updateOne(
        { transactionType_id: transactionType.id },
        { $set: { description: transactionType.description, isCredit: transactionType.isCredit } },
      );
  }

  async removeTransactionType(id: string): Promise<void> {
    const db = await this.dbClient.checkConnection();
    await db.collection(COLLECTION_NAME).deleteOne({ transactionType_id: id });
  }
}
