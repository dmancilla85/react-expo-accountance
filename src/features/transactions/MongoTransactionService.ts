import Transaction from './Transaction';
import TransactionService from './TransactionService';

class MongoTransactionService implements TransactionService {
  async addTransaction(transaction: Transaction): Promise<void> {
    // Implementation for adding a transaction
  }

  async getTransactions(): Promise<Transaction[]> {
    // Implementation for retrieving transactions
    return [];
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    // Implementation for updating a transaction
  }

  async removeTransaction(id: string): Promise<void> {
    // Implementation for removing a transaction
  }
}

export default MongoTransactionService;
