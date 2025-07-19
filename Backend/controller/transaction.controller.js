import Transaction from '../models/transaction.model.js';
import { contract, web3 } from '../blockchain.js';
import cleanBigInt from '../utils/cleanBigInt.js';

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

    // 1. Ensure contract is configured
    // Validate required fields
    if (!amount || !recipient || !accountNumber || !ifsc || !purpose) {
      return res.status(400).json({ error: 'All required fields are missing' });
    }
    // Check if contract is properly configured

    if (!contract?.methods?.createTransaction || typeof contract.methods.createTransaction !== 'function') {
      console.error("Blockchain contract not configured! ABI or address may be wrong.");
      // Fallback: Just save to MongoDB with "No Blockchain" status
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
        txHash: null, // No blockchain tx hash
        validated: false,
        chainStatus: "OffChain",
        blockchainLog: null,
      });
      await newTransaction.save();
      return res.status(201).json(cleanBigInt(newTransaction.toObject ? newTransaction.toObject() : newTransaction));
    }

    // 2. Get sender address (in production, use user's wallet)
    const accounts = await web3.eth.getAccounts();
    const senderAddress = accounts[0];

    // 3. Create transaction on blockchain
    let tx;
    try {
      tx = await contract.methods
        .createTransaction(recipient, amount)
        .send({ from: senderAddress, gas: 300000 });
    } catch (err) {
      return res.status(500).json({ error: "Blockchain transaction creation failed: " + err.message });
    }

    // 4. Get transaction hash (adjust if your contract emits differently)
    const txHash = tx.events && tx.events.TransactionCreated
      ? tx.events.TransactionCreated.returnValues.txHash
      : tx.transactionHash;

    // 5. Validate transaction on blockchain (if your contract supports it)
    let validate;
    try {
      validate = await contract.methods
        .validateTransaction(txHash)
        .send({ from: senderAddress, gas: 100000 });
    } catch (err) {
      return res.status(500).json({ error: "Blockchain transaction validation failed: " + err.message });
    }

    // 6. Save transaction to DB with blockchain status
    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      recipient,
      accountNumber,
      ifsc,
      purpose,
      note,
      date: new Date(),
      status: "Success (with Blockchain)",
      txHash,
      validated: true,
      chainStatus: "OnChain",
      blockchainLog: validate, // Save validation log for audit
    });

    await newTransaction.save();
    res.status(201).json(cleanBigInt(newTransaction.toObject ? newTransaction.toObject() : newTransaction));
  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Transaction Error: " + err.message });
}
};
