import TransactionType from './TransactionType';

interface TransactionTypeService {
  addTransactionType(transactionType: TransactionType): Promise<void>;
  getTransactionTypes(): Promise<TransactionType[]>;
  updateTransactionType(transactionType: TransactionType): Promise<void>;
  removeTransactionType(id: string): Promise<void>;
}

export default TransactionTypeService;
