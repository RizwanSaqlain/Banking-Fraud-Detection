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
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST: Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { amount, recipient, accountNumber, ifsc, purpose, note } = req.body;

    // Validate required fields
    if (!amount || !recipient || !accountNumber || !ifsc || !purpose) {
      return res.status(400).json({ error: 'All required fields are missing' });
    }

    const newTransaction = new Transaction({
      userId: req.user.id,
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
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Transaction Failed' });
  }
};
