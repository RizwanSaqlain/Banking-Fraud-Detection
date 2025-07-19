import Transaction from '../models/transaction.model.js';
import { contract, web3 } from '../blockchain.js';

// Get all transactions
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create transaction with blockchain (fallback to MongoDB if contract misconfigured)
export const createTransaction = async (req, res) => {
  try {
    const { amount, recipient, accountNumber, ifsc, purpose, note } = req.body;

    // Validate required fields
    if (!amount || !recipient || !accountNumber || !ifsc || !purpose) {
      return res.status(400).json({ error: 'All required fields are missing' });
    }
    // Check if contract is properly configured
    if (!contract?.methods?.createTransaction || typeof contract.methods.createTransaction !== 'function') {
      // Fallback: Just save to MongoDB
      const newTransaction = new Transaction({
        userId: req.userId,
        amount,
        recipient,
        accountNumber,
        ifsc,
        purpose,
        note,
        date: new Date(),
        status: "Success (No Blockchain)",
        chainStatus: "NotConfigured",
      });
      await newTransaction.save();
      return res.status(201).json(newTransaction);
    }

    // Blockchain logic
    const accounts = await web3.eth.getAccounts();
    const senderAddress = accounts[0];

    const tx = await contract.methods
      .createTransaction(recipient, amount)
      .send({ from: senderAddress, gas: 300000 });

    const txHash = tx.events.TransactionCreated.returnValues.txHash;

    const validate = await contract.methods
      .validateTransaction(txHash)
      .send({ from: senderAddress, gas: 100000 });

    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      recipient,
      accountNumber,
      ifsc,
      purpose,
      note,
      date: new Date(),
      status: "Success",
      txHash,
      validated: true,
      chainStatus: "Pending",
      blockchainLog: validate,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Transaction Error: " + err.message });
}
};
