import Budget from "../models/Budget.js";

export const createBudget = async (req, res) => {
  try {
    const { income, expenses } = req.body;

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const originalBalance = income - totalExpenses;

    // Shadow logic: reduce based on category
    const shadowExpenses = expenses.map((exp) => {
      let reduced = exp.amount;
      if (exp.category === "Subscriptions") reduced *= 0.5;
      else if (exp.category === "Transport") reduced *= 0.6;
      else if (exp.category === "Food") reduced *= 0.75;

      return {
        category: exp.category,
        amount: Math.round(reduced),
      };
    });

    const shadowTotal = shadowExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const shadowBalance = income - shadowTotal;

    const budget = new Budget({
      income,
      expenses,
      totalExpenses,
      originalBalance,
      shadowExpenses,
      shadowBalance,
    });

    await budget.save();

    // Find highest spending category
    const highestCategory = expenses.reduce((prev, current) =>
      current.amount > prev.amount ? current : prev
    ).category;

    // Category-specific tips
    const categoryTips = {
      Food: "🍱 Try home cooking or meal prep to cut down food expenses!",
      Transport: "🚌 Consider public transport or carpooling to save money.",
      Subscriptions: "📺 Review your subscriptions — do you use them all?",
      Entertainment: "🎮 Reduce entertainment costs by opting for free activities.",
      Shopping: "🛍️ Try a no-spend challenge or buy only what you need.",
      Utilities: "💡 Save on electricity with energy-efficient habits!",
    };

    const tip = categoryTips[highestCategory] || "💡 Consider reviewing your expenses to boost savings!";

    res.status(201).json({ shadowTip: tip });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
