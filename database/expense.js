const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    email: String,
    expense: {
      type: [
        {
          date: Date,
          content: [
            {
              description: String,
              amount: Number,
            },
          ],
        },
      ],
      required: true,
    },
  });

  const Expense = new mongoose.model("expense", expenseSchema);

  module.exports = Expense