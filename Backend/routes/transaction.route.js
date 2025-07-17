// import express from 'express';
// import { getUserTransactions } from '../controller/transaction.controller.js';
// import {verifyToken} from '../middleware/verifyToken.js';

// const router = express.Router();

// router.get('/', verifyToken, getUserTransactions);

// export default router;
import express from 'express';
import Transaction from '../models/transaction.model.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Create a new transaction
router.post('/', verifyToken, async (req, res) => {
  try {
    const { amount, recipient, accountNumber, ifsc, purpose, note } = req.body;

    // Optional: Basic input check
    if (!amount || !recipient || !accountNumber || !ifsc || !purpose) {
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

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error('Transaction Error:', err);
    res.status(500).json({ error: 'Transaction Failed' });
  }
});

export default router;
