'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-09-23T21:31:17.178Z',
    '2022-09-25T07:42:02.383Z',
    '2022-10-02T09:15:04.904Z',
    '2022-10-11T10:17:24.185Z',
    '2022-10-18T14:11:59.604Z',
    '2022-11-20T17:01:17.194Z',
    '2022-11-22T23:36:17.929Z',
    '2022-11-23T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-07-20T13:15:33.035Z',
    '2022-07-30T09:48:16.867Z',
    '2022-09-25T06:04:23.907Z',
    '2022-10-05T14:18:46.235Z',
    '2022-10-25T16:33:06.386Z',
    '2022-11-10T14:43:26.374Z',
    '2022-11-25T18:49:59.371Z',
    '2022-11-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2022-08-01T13:15:33.035Z',
    '2022-08-30T09:48:16.867Z',
    '2022-09-25T06:04:23.907Z',
    '2022-09-25T14:18:46.235Z',
    '2022-10-05T16:33:06.386Z',
    '2022-10-10T14:43:26.374Z',
    '2022-11-20T18:49:59.371Z',
    '2022-11-22T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2022-07-01T13:15:33.035Z',
    '2022-08-30T09:48:16.867Z',
    '2022-09-25T06:04:23.907Z',
    '2022-09-25T14:18:46.235Z',
    '2022-10-05T16:33:06.386Z',
    '2022-10-10T14:43:26.374Z',
    '2022-11-25T18:49:59.371Z',
    '2022-11-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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
// Date
const formatMovementDate = function (date) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

// Display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Calculate and display current balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accum, mov) => accum + mov, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
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

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
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
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summury
  calcDisplaySummury(acc.movements);
};

// Event handler - Login and display UI for current account
let currentAccount;

// Fake always Logged In///////////////////////////////////////
currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;

//////////////////////////////////////////////////////////

const handleLogin = function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Display current date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;

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

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

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
  const loanRequest = Math.floor(inputLoanAmount.value);
  const deposits = currentAccount.movements.filter(mov => mov > 0);

  if (
    loanRequest > 0 &&
    deposits.some(deposit => deposit >= loanRequest * 0.1)
  ) {
    // Add deposit
    currentAccount.movements.push(loanRequest);
    // add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    // update UI
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
    +inputClosePin.value === currentAccount.pin
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

///////////////////////////////////////////////////////////////
