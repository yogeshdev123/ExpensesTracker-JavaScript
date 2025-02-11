// const balance = document.getElementById('balance-amount');
// const income = document.getElementById('income');
// const expense = document.getElementById('expense');
// const transactionList = document.getElementById('transaction-list');
// const form = document.getElementById('transaction-form');
// const descriptionInput = document.getElementById('description');
// const amountInput = document.getElementById('amount');

// let transactions = [];

// function updateValues() {
//     const amounts = transactions.map(transaction => transaction.amount);
//     const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
//     const incomeTotal = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
//     const expenseTotal = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0).toFixed(2) * -1;

//     balance.textContent = total;
//     income.textContent = `$${incomeTotal}`;
//     expense.textContent = `$${expenseTotal}`;
// }

// function addTransaction(e) {
//     e.preventDefault();

//     if (descriptionInput.value.trim() === '' || amountInput.value.trim() === '') {
//         alert('Please enter both description and amount.');
//         return;
//     }

//     const transaction = {
//         id: generateID(),
//         description: descriptionInput.value,
//         amount: +amountInput.value
//     };

//     transactions.push(transaction);
//     addTransactionDOM(transaction);
//     updateValues();

//     descriptionInput.value = '';
//     amountInput.value = '';
// }

// function generateID() {
//     return Math.floor(Math.random() * 100000000);
// }

// function addTransactionDOM(transaction) {
//     const sign = transaction.amount < 0 ? '-' : '+';
//     const item = document.createElement('li');
    
//     item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
//     item.innerHTML = `
//         ${transaction.description} <span>${sign}$${Math.abs(transaction.amount)}</span>
//         <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
//     `;
//     transactionList.appendChild(item);
// }

// function removeTransaction(id) {
//     transactions = transactions.filter(transaction => transaction.id !== id);
//     init();
// }

// function init() {
//     transactionList.innerHTML = '';
//     transactions.forEach(addTransactionDOM);
//     updateValues();
// }

// form.addEventListener('submit', addTransaction);
// init();

const balanceEl = document.getElementById('balance');
const expenseListEl = document.getElementById('expense-list');
const expenseForm = document.getElementById('expense-form');
const chartCtx = document.getElementById('expenseChart').getContext('2d');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let chart;

// Add Expense
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const expense = { id: generateID(), description, amount, category, date };
    expenses.push(expense);

    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateUI();
    updateChart();
    
    expenseForm.reset();
});

// Generate Unique ID for Each Expense
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Update UI
function updateUI() {
    // Clear the current list
    expenseListEl.innerHTML = '';

    // Calculate Balance
    const totalBalance = expenses.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2);
    balanceEl.textContent = totalBalance;

    // Render Expense List
    expenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `
            ${expense.description} <span>${expense.category} - $${expense.amount}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        expenseListEl.appendChild(listItem);
    });
}

// Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateUI();
    updateChart();
}

// Update Chart
function updateChart() {
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(chartCtx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: 'Expense by Category',
                data,
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Initialize
function init() {
    updateUI();
    updateChart();
}

init();
