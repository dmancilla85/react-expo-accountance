/**
 * TransactionType class represents a type of transaction with an ID, description, and a flag indicating if it is a credit or debit.
 * It provides methods to access and modify the properties of the transaction type.
 */
class TransactionType {
  private _id: string;
  private _description: string;
  private _isCredit: boolean;

  /**
   * Represents a type of transaction.
   * @param id - Unique identifier for the transaction type.
   * @param description - Description of the transaction type.
   * @param isCredit - Indicates if the transaction type is a credit or a debit (default is debit).
   */
  constructor(id: string, description: string, isCredit: boolean = false) {
    this._id = id;
    this._description = description;
    this._isCredit = isCredit;
  }

  get id(): string {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get isCredit(): boolean {
    return this._isCredit;
  }

  set description(value: string) {
    this._description = value;
  }
}

export default TransactionType;
