import User from "../models/user.model.js";

export const detectFraud = async (amount, recipientId, userId) => {
    const user = await User.findById(userId);
    const recipient = await User.findById(recipientId);
    const senderBalance = {oldBalance: Number(user.balance), newBalance: Number(user.balance) - Number(amount)};
    const recipientBalance = {oldBalance: Number(recipient.balance), newBalance: Number(recipient.balance) + Number(amount)};
    console.log("senderBalance:", senderBalance, "recipientBalance:", recipientBalance);
    return false;
}