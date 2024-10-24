class FinanceApp {
    constructor() {
        this.pendingBills = [];
        this.transactionHistory = [];
        this.pin = '4102';

        this.billNameInput = document.getElementById('billName');
        this.billAmountInput = document.getElementById('billAmount');
        this.billDueDateInput = document.getElementById('billDueDate');
        this.addBillBtn = document.getElementById('addBillBtn');
        this.completeBillContent = document.getElementById('completeBillContent');
        this.pendingBillsQueue = document.getElementById('pendingBillsQueue');
        this.transactionHistoryElement = document.getElementById('transactionHistory');

        this.addBillBtn.addEventListener('click', () => this.addBill());
        this.updateUI();
    }

    addBill() {
        const newBill = {
            name: this.billNameInput.value,
            amount: parseFloat(this.billAmountInput.value),
            dueDate: this.billDueDateInput.value,
            originalAmount: parseFloat(this.billAmountInput.value)
        };

        if (!newBill.name || isNaN(newBill.amount) || !newBill.dueDate) {
            alert('Please fill in all fields correctly.');
            return;
        }

        this.pendingBills.push(newBill);
        this.pendingBills.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        this.billNameInput.value = '';
        this.billAmountInput.value = '';
        this.billDueDateInput.value = '';

        this.updateUI();
    }

    completeBillPayment(paymentMethod) {
        if (this.pendingBills.length === 0) return;

        const enteredPin = prompt('Enter PIN to complete payment:');
        if (enteredPin !== this.pin) {
            alert('Incorrect PIN');
            return;
        }

        const bill = this.pendingBills.shift();
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
        const dueDate = new Date(bill.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Reset time to start of day

        if (currentDate > dueDate) {
            const fine = bill.originalAmount * 0.1;
            bill.amount = bill.originalAmount + fine;
            alert(`Due date has passed. A 10% fine of ₹${fine.toFixed(2)} has been added. New total: ₹${bill.amount.toFixed(2)}`);
        }

        const transaction = {
            ...bill,
            paymentMethod: paymentMethod,
            paymentDate: currentDate.toISOString().split('T')[0]
        };

        this.transactionHistory.unshift(transaction);
        this.updateUI();
    }

    updateUI() {
        this.updatePendingBillsQueue();
        this.updateTransactionHistory();
        this.updateCompleteBillContent();
    }

    updatePendingBillsQueue() {
        this.pendingBillsQueue.innerHTML = this.pendingBills.map(bill => {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
            const dueDate = new Date(bill.dueDate);
            dueDate.setHours(0, 0, 0, 0); // Reset time to start of day
            const isOverdue = currentDate > dueDate;
            const overdueClass = isOverdue ? 'overdue' : '';

            return `
                <div class="bill-item ${overdueClass}">
                    <p>${bill.name} - ₹${bill.amount.toFixed(2)} (Due: ${bill.dueDate})</p>
                    ${isOverdue ? '<p class="overdue-notice">Overdue!</p>' : ''}
                </div>
            `;
        }).join('');
    }

    updateTransactionHistory() {
        this.transactionHistoryElement.innerHTML = this.transactionHistory.map(transaction => `
            <div class="transaction-item">
                <p>${transaction.name} - ₹${transaction.amount.toFixed(2)} (Paid: ${transaction.paymentDate})</p>
                <p>Payment Method: ${transaction.paymentMethod}</p>
                ${transaction.amount !== transaction.originalAmount ? 
                    `<p class="fine-notice">Includes ₹${(transaction.amount - transaction.originalAmount).toFixed(2)} fine</p>` : ''}
            </div>
        `).join('');
    }

    updateCompleteBillContent() {
        if (this.pendingBills.length > 0) {
            const nextBill = this.pendingBills[0];
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Reset time to start of day
            const dueDate = new Date(nextBill.dueDate);
            dueDate.setHours(0, 0, 0, 0); // Reset time to start of day
            const isOverdue = currentDate > dueDate;

            this.completeBillContent.innerHTML = `
                <p>Next bill: ${nextBill.name} - ₹${nextBill.amount.toFixed(2)} (Due: ${nextBill.dueDate})</p>
                ${isOverdue ? '<p class="overdue-notice">This bill is overdue.</p>' : ''}
                <div class="payment-options">
                    <button class="payment-option" id="creditCardBtn">Credit Card</button>
                    <button class="payment-option" id="debitCardBtn">Debit Card</button>
                    <button class="payment-option" id="upiBtn">UPI</button>
                </div>
            `;
            document.getElementById('creditCardBtn').addEventListener('click', () => this.completeBillPayment('Credit Card'));
            document.getElementById('debitCardBtn').addEventListener('click', () => this.completeBillPayment('Debit Card'));
            document.getElementById('upiBtn').addEventListener('click', () => this.completeBillPayment('UPI'));
        } else {
            this.completeBillContent.innerHTML = '<p>No pending bills</p>';
        }
    }
}

const app = new FinanceApp();