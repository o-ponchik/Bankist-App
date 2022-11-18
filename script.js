'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Display movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Calculate and display current balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accum, mov) => accum + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

// Calculate and display summury
const calcDisplaySummury = function (movements, int) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((accum, mov) => accum + mov, 0);

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((accum, mov) => accum + mov, 0);

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * int) / 100)
    .filter(int => int >= 1)
    .reduce((accum, mov) => accum + mov, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

// Create username for system => 'Steven Thomas Williams' after computing => stw
const createUsername = function (accounts) {
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(word => word.slice(0, 1))
        .join(''))
  );
};

createUsername(accounts);

const updateUi = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summury
  calcDisplaySummury(acc.movements);
};

// Event handler - Login and display UI for current account
let currentAccount;

const handleLogin = function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Update UI
    updateUi(currentAccount);
  } else {
    console.log('Incorrect PIN');
  }

  // Clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
};

btnLogin.addEventListener('click', handleLogin);

// Making transfer to another account
const handleTranfer = function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUi(currentAccount);
  } else {
    console.log('Invalid transfer!');
  }

  // clear inputs
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
};

btnTransfer.addEventListener('click', handleTranfer);

// Making request loan
const handleLoan = function (e) {
  e.preventDefault();
  const loanRequest = Number(inputLoanAmount.value);
  const deposits = currentAccount.movements.filter(mov => mov > 0);

  if (
    loanRequest > 0 &&
    deposits.some(deposit => deposit >= loanRequest * 0.1)
  ) {
    // Add deposit and update UI
    currentAccount.movements.push(loanRequest);
    updateUi(currentAccount);
  } else {
    console.log('Request was canceled');
  }

  //clear inputs
  inputLoanAmount.value = '';
};

btnLoan.addEventListener('click', handleLoan);

// Close an account
const handleCloseAcc = function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // Find the index of account
    const findUserIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete an account
    accounts.splice(findUserIndex, 1);
    console.log('Deleted');

    // Hide UI
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  } else {
    console.log('Incorrect');
  }

  inputCloseUsername.value = inputClosePin.value = '';
};

btnClose.addEventListener('click', handleCloseAcc);