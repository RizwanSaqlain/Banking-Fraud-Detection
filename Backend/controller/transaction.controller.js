// import Transaction from '../models/transaction.model.js';

// export const getUserTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
//     res.status(200).json(transactions);
//   } catch (err) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// };

import Transaction from '../models/transaction.model.js';

// GET: Fetch all transactions for logged-in user
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({userId: req.userId}).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST: Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { amount, recipient, purpose } = req.body;

    const newTransaction = new Transaction({
      userId: req.userId,
      amount,
      recipient,
      purpose,
      date: new Date(),
      status: 'Success',
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: 'Transaction Failed' });
  }
};
