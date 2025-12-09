import { configureStore } from '@reduxjs/toolkit';
// Importa tus reducers aquí
// import transactionTypeReducer from './features/transaction_type/transactionTypeSlice';

export const store = configureStore({
  reducer: {
    // transactionType: transactionTypeReducer,
    // Agrega aquí otros reducers
  },
});

// Tipos para usar en todo el proyecto
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;