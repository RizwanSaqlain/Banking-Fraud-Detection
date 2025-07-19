// transaction.routes.js

import express from 'express';
import Transaction from '../models/transaction.model.js';
import verifyToken from '../middleware/verifyToken.js';
import {
  getUserTransactions,
  createTransaction, // ✅ Controller with blockchain integration
} from '../controller/transaction.controller.js';

const router = express.Router();

//////////////////////////////////
// ✅ ROUTE 1: GET Transactions
//////////////////////////////////

// Use controller to get user's transactions
router.get('/', verifyToken, getUserTransactions);

//////////////////////////////////
// ✅ ROUTE 2: BASIC Create Transaction (MongoDB only)
// You already had this, and we keep it. Users who don't use blockchain can still make transactions.
//////////////////////////////////
router.post('/', verifyToken, async (req, res) => {
  try {
    const { amount, recipient, accountNumber, ifsc, purpose, note } = req.body;
    
    console.log('Transaction data received:', { amount, recipient, accountNumber, ifsc, purpose, note });
    console.log('User ID:', req.userId);

    // Optional: Basic input check
    if (!amount || !recipient || !accountNumber || !ifsc || !purpose) {
      console.log('Missing required fields:', { amount, recipient, accountNumber, ifsc, purpose });
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newTransaction = new Transaction({
      userId: req.userId,
      amount,
      recipient,
      accountNumber,
      ifsc,
      purpose,
      note,
      date: new Date(),
      status: 'Success',
    });

    console.log('Saving transaction:', newTransaction);
    await newTransaction.save();
    console.log('Transaction saved successfully');
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error('Transaction Error:', err);
    res.status(500).json({ error: 'Transaction Failed' });
  }
});

//////////////////////////////////
// ➕ ROUTE 3: Blockchain + Database Transaction (Controller-based)
//////////////////////////////////

// Use extended controller to create + validate tx on Ethereum and save to MongoDB
router.post('/create', verifyToken, createTransaction);

// Fetch all transactions for the logged-in user
router.get('/', verifyToken, getUserTransactions);

export default router;
