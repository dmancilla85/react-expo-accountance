import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import MongoTransactionTypeService from './MongoTransactionTypeService';
import TransactionType from './TransactionType';

const transactionTypesAdapter = createEntityAdapter<TransactionType>({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const transactionTypeService = new MongoTransactionTypeService();
const initialState = transactionTypesAdapter.getInitialState();

const transactionTypeSlice = createSlice({
  name: 'transactionType',
  initialState,
  reducers: {
    /**
     * Adds a new transaction type to the state and database.
     * @param state - The current state of the transaction types.
     * @param action - The action containing the transaction type to add.
     */
    addTransactionType: (state, action: PayloadAction<TransactionType>) => {
      transactionTypesAdapter.addOne(state, action.payload);
      transactionTypeService.addTransactionType(action.payload);
    },

    /**
     * Removes a transaction type from the state and database.
     * @param state - The current state of the transaction types.
     * @param action - The action containing the ID of the transaction type to remove.
     */
    removeTransactionType: (state, action: PayloadAction<string>) => {
      transactionTypesAdapter.removeOne(state, action.payload);
      transactionTypeService.removeTransactionType(action.payload);
    },

    /**
     * Updates an existing transaction type in the state and database.
     * @param state - The current state of the transaction types.
     * @param action - The action containing the updated transaction type.
     */
    updateTransactionType: (state, action: PayloadAction<TransactionType>) => {
      transactionTypesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
      transactionTypeService.updateTransactionType(action.payload);
    },

    /**
     * Sets the transaction types in the state and database.
     * @param state - The current state of the transaction types.
     * @param action - The action containing the transaction types to set.
     */
    setTransactionTypes: (state, action: PayloadAction<TransactionType[]>) => {
      transactionTypesAdapter.setAll(state, action.payload);
      action.payload.forEach((transactionType) => {
        transactionTypeService.addTransactionType(transactionType);
      });
    },
  },
});

export default transactionTypeSlice.reducer;
