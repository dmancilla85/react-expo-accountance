import Transaction from './Transaction';

interface TransactionService {
  addTransaction(transaction: Transaction): Promise<void>;
  getTransactions(): Promise<Transaction[]>;
  updateTransaction(transaction: Transaction): Promise<void>;
  removeTransaction(id: string): Promise<void>;
}

export default TransactionService;
