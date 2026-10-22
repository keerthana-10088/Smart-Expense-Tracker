
import { useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("smart-expenses")) || [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const currentMonth = new Date().toISOString().slice(0, 7);

  const saveExpenses = (updatedExpenses) => {
    setExpenses(updatedExpenses);
    localStorage.setItem("smart-expenses", JSON.stringify(updatedExpenses));
  };

  const addExpense = (event) => {
    event.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0 || !date) {
      alert("Please enter a valid title, amount, and date.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
    };

    saveExpenses([newExpense, ...expenses]);
    setTitle("");
    setAmount("");
    setCategory("Food");
  };

  const deleteExpense = (id) => {
    saveExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const monthlyExpenses = expenses.filter(
    (expense) => expense.date.slice(0, 7) === currentMonth
  );

  const monthlyTotal = monthlyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const today = new Date().toISOString().slice(0, 10);

  const todayTotal = expenses
    .filter((expense) => expense.date === today)
    .reduce((total, expense) => total + expense.amount, 0);

  const categories = ["Food", "Travel", "Shopping", "Education", "Bills", "Other"];

  const categoryTotals = categories.map((name) => ({
    name,
    total: monthlyExpenses
      .filter((expense) => expense.category === name)
      .reduce((total, expense) => total + expense.amount, 0),
  }));

  const maxCategoryTotal = Math.max(
    ...categoryTotals.map((item) => item.total),
    1
  );

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">₹</div>
          <div>
            <h1>PennyWise</h1>
            <p>SMART EXPENSE TRACKER</p>
          </div>
        </div>
        <span className="month-badge">
          {new Date().toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </header>

      <section className="welcome">
        <div>
          <span className="eyebrow">YOUR MONEY, YOUR CONTROL</span>
          <h2>Track smarter. <span>Live better.</span></h2>
          <p>Every rupee counts. Keep your spending simple and organized.</p>
        </div>
        <div className="welcome-art" aria-hidden="true">₹</div>
      </section>

      <section className="summary-grid">
        <article className="summary-card purple">
          <span className="card-label">Monthly Spending</span>
          <div className="summary-icon">↗</div>
          <h3>{formatMoney(monthlyTotal)}</h3>
          <p>{monthlyExpenses.length} expenses this month</p>
        </article>

        <article className="summary-card green">
          <span className="card-label">Today's Spending</span>
          <div className="summary-icon">◷</div>
          <h3>{formatMoney(todayTotal)}</h3>
          <p>Your expenses for today</p>
        </article>

        <article className="summary-card orange">
          <span className="card-label">Total Records</span>
          <div className="summary-icon">▤</div>
          <h3>{expenses.length}</h3>
          <p>Expenses recorded so far</p>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel add-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">STAY ORGANIZED</span>
              <h2>Add an Expense</h2>
            </div>
            <span className="heading-icon">＋</span>
          </div>

          <form onSubmit={addExpense}>
            <label htmlFor="expense-title">Expense name</label>
            <input
              id="expense-title"
              type="text"
              placeholder="e.g. Lunch, Bus ticket..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              required
            />

            <label htmlFor="expense-amount">Amount (₹)</label>
            <input
              id="expense-amount"
              type="number"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />

            <div className="form-row">
              <div>
                <label htmlFor="expense-category">Category</label>
                <select
                  id="expense-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="expense-date">Date</label>
                <input
                  id="expense-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>
            </div>

            <button className="add-button" type="submit">
              + Add Expense
            </button>
          </form>
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">MONTHLY BREAKDOWN</span>
              <h2>Spending by Category</h2>
            </div>
            <span className="heading-icon">▥</span>
          </div>

          <div className="category-list">
            {categoryTotals.map((item) => (
              <div className="category-item" key={item.name}>
                <div className="category-info">
                  <span>{item.name}</span>
                  <strong>{formatMoney(item.total)}</strong>
                </div>
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label={`${item.name} spending`}
                  aria-valuemin="0"
                  aria-valuemax={maxCategoryTotal}
                  aria-valuenow={item.total}
                >
                  <div
                    className={`progress-fill category-${item.name.toLowerCase()}`}
                    style={{
                      width: `${(item.total / maxCategoryTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="chart-footer">
            <span className="chart-dot" />
            <span>Based on expenses recorded this month</span>
          </div>
        </article>
      </section>

      <section className="panel history-panel">
        <div className="panel-heading history-heading">
          <div>
            <span className="eyebrow">YOUR MONEY JOURNAL</span>
            <h2>Expense History</h2>
          </div>
          <span className="record-count">{expenses.length} records</span>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">₹</div>
            <h3>No expenses yet</h3>
            <p>Add your first expense above to see your spending history here.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="expense-name">{expense.title}</td>
                    <td><span className="category-tag">{expense.category}</span></td>
                    <td>{expense.date}</td>
                    <td className="expense-amount">{formatMoney(expense.amount)}</td>
                    <td>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => deleteExpense(expense.id)}
                        aria-label={`Delete ${expense.title}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>
        <span>₹ PennyWise</span>
        <p>Small steps today. Better finances tomorrow.</p>
      </footer>
    </main>
  );
}

export default App;