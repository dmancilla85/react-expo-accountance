import TransactionType from '../transaction_types/TransactionType';

class Transaction {
  id: string;
  transactionType: TransactionType;
  ammount: number;
  description: string;
  date: Date = new Date();

  constructor(id: string, transactionType: TransactionType, ammount: number, description: string) {
    this.id = id;
    this.description = description;
    this.ammount = ammount;
    this.transactionType = transactionType;
  }
}

export default Transaction;
