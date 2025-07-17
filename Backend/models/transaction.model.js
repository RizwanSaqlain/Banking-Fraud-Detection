// import mongoose from 'mongoose';

// const transactionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   amount: Number,
//   date: Date,
//   status: String,
// });

// const Transaction = mongoose.model('Transaction',transactionSchema );
 
// export default Transaction;
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Success',
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
