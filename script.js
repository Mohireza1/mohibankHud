// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-07-27T07:50:03.030Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.header__welcome');
const labelDate = document.querySelector('.text-container__date');
const labelBalance = document.querySelector('.balance__current');
const labelSumIn = document.querySelector('.num__number--in');
const labelSumOut = document.querySelector('.num__number--out');
const labelSumInterest = document.querySelector('.num__number--interest');
const labelTimer = document.querySelector('.timer__time');

const containerApp = document.querySelector('main');
const containerMovements = document.querySelector('.info__transactions');

const btnLogin = document.querySelector('.inputs__login--btn');
const btnTransfer = document.querySelector('.input-group__button--transfer');
const btnLoan = document.querySelector('.input-group__button--loan');
const btnClose = document.querySelector('.input-group__button--close');
const btnSort = document.querySelector('.details__sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pass');
const inputTransferTo = document.querySelector(
  '.input-group__input--transfer-to'
);
const inputTransferAmount = document.querySelector(
  '.input-group__input--transfer-amount'
);
const inputLoanAmount = document.querySelector(
  '.input-group__input--loan-amount'
);
const inputCloseUsername = document.querySelector(
  '.input-group__input--close-user'
);
const inputClosePin = document.querySelector('.input-group__input--close-pass');

// Time
const timeFull = new Date();
const hour = timeFull.getHours();
const minute = timeFull.getMinutes();
const time = timeFull.toLocaleString();
const isoTime = timeFull.toISOString();

// Functions //

// Currency formatter
const currencyFormat = (loc, curr) => val =>
  new Intl.NumberFormat(loc, {
    style: 'currency',
    currency: curr,
  }).format(val);

// Time formatter
const intlTimeFormat =
  (loc, lengthTime = 'short', lengthDate = 'long') =>
  val =>
    new Intl.DateTimeFormat(loc, {
      timeStyle: lengthTime,
      dateStyle: lengthDate,
      hourCycle: 'h24',
    }).format(val);

// Username maker
const userNameAdder = accs => {
  accs.forEach(obj => {
    obj.username = obj.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
userNameAdder(accounts);

// Diplay transactions

const displayMoves = (account, sort = false) => {
  // Sorting mechanism
  containerMovements.innerHTML = '';
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  // Shows movements
  movs.forEach((move, i) => {
    const moveDate = new Date(currentUser.movementsDates[i]);
    const hoursPassed = (timeFull - moveDate) / (1000 * 60 * 60);
    const moveHour = moveDate.getHours();
    const moveMinute = moveDate.getMinutes();
    const minutesPassed = hour * 60 + minute - (moveHour * 60 + moveMinute);
    const plural = new Intl.PluralRules().select(minutesPassed);

    const moveValue = currencyFormat(account.locale, account.currency)(move);

    const moveTime =
      hoursPassed < 1
        ? `${minutesPassed} minute${plural === 'one' ? '' : 's'} ago`
        : `${intlTimeFormat(account.locale, 'short', 'short')(moveDate)}`;
    const text = move > 0 ? 'deposit' : 'withdraw';
    const type = move > 0 ? 'in' : 'out';
    const moveText = `       <div class="movement__move">
            <div class="move__label move__label--${type}">${
      i + 1
    }. ${text}</div>
              <div class="move__date">${moveTime}</div>
              <div class="move__amount">${moveValue}</div>
            </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', moveText);
  });
};

// Display balance
const displayBalance = account => {
  const balance = account.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(currentUser.locale, {
    style: 'currency',
    currency: currentUser.currency,
  }).format(balance.toFixed(2))}`;
};

// Display summary
const displaySum = account => {
  // Summary currency
  const summeryCurrencyDefault = currencyFormat(
    account.locale,
    account.currency
  );
  const deposit = account.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  const withdraw = Math.abs(
    account.movements
      .filter(move => move < 0)
      .reduce((acc, move) => acc + move, 0)
  );
  const interest = account.movements
    .filter(move => move > 0)
    .map(move => (move * 1.2) / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumIn.textContent = summeryCurrencyDefault(deposit.toFixed(2));
  labelSumOut.textContent = summeryCurrencyDefault(withdraw.toFixed(2));
  labelSumInterest.textContent = summeryCurrencyDefault(interest.toFixed(2));
};

// As of date setter
const asOfDate = account => {
  labelDate.textContent = intlTimeFormat(account.locale, 'medium', 'long')();
};

let currentUser, timer;

// Transfer
const transfer = (user, amount) => {
  const balance = currentUser.movements.reduce((acc, move) => acc + move, 0);
  const target = accounts.find(acc => acc.username === user);
  if (amount > balance) {
    console.log('no amount');
    return;
  } else if (!target) {
    console.log('no user');
    return;
  } else if (target === currentUser) {
    console.log('same user');
    return;
  } else if (amount <= 0) {
    console.log('0 or negative amount');
    return;
  }
  target.movements.push(+amount);
  target.movementsDates.push(isoTime);
  currentUser.movements.push(+amount);
  currentUser.movementsDates.push(isoTime);
  updateUi(currentUser);
};

// Loan
const loanRequest = amount => {
  setTimeout(() => {
    // Loan rule check
    if (currentUser.movements.some(val => val > (amount * 10) / 100)) {
      // Add amount and time
      currentUser.movements.push(Math.round(amount));
      currentUser.movementsDates.push(isoTime);

      // Update UI
      updateUi(currentUser);
    }
  }, 2000);
};

const timerFunction = () => {
  let time = 300;
  const tick = () => {
    const minute = String(Math.trunc(time / 60)).padStart(2, '0');
    const second = String(Math.trunc(time % 60)).padStart(2, '0');
    labelTimer.textContent = `${minute}:${second}`;
    time--;
    if (time === -1) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to see your account info';
      containerApp.style.opacity = '0';
    }
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// UI update
const updateUi = user => {
  displayBalance(user);
  displayMoves(user);
  displaySum(user);
  asOfDate(user);
  if (timer) clearInterval(timer);
  timer = timerFunction();
};

// Event Listeners //

// Login submit
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentUser?.pin === +inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = '';
    updateUi(currentUser);
    labelWelcome.innerHTML = `Welcome back, <span style="font-weight: 600;">${currentUser.owner}</span>`;
    containerApp.style.opacity = '100% ';
    if (timer) clearInterval(timer);
    timer = timerFunction();
  }
});

// Transfer submit
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  transfer(inputTransferTo.value, inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
});

// Loan submit
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  // Request loan
  loanRequest(Number(inputLoanAmount.value));
  // Clear inputs
  inputLoanAmount.value = '';
});

// Delete submit
btnClose.addEventListener('click', e => {
  e.preventDefault();
  // Check if account is correct
  if (
    inputCloseUsername.value === currentUser.username &&
    currentUser.pin === +inputClosePin.value
  ) {
    // Delete account
    const dltAcc = accounts.findIndex(acc => acc === currentUser);
    accounts.splice(dltAcc, 1);
    // Hide UI
    containerApp.style.opacity = '0%';
    window.scrollTo({ top: 0 });
  }
  // Clear the inputs
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort
let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMoves(currentUser, !sorted);
  sorted = !sorted;
});
