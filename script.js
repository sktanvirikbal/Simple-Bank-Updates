'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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

const account5 = {
  owner: 'Sk Tanvir Ikbal',
  movements: [4300, 100, 7000, 500, 9056],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

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


//starting from 144 dom manipulation
const displayMovements = function (movements, sort = false) {

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;





  //removing the previous records from list

  containerMovements.innerHTML = ''
  movs.forEach(function (mov, i,) {

    //deciding the type of movement here to show ,is it a deposit or a withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1
      }.${type}  </div>
            <div class="movements__value">${mov}€</div>
          </div>
        `;


    containerMovements.insertAdjacentHTML('afterbegin', html);





  })
}

// displayMovements(account1.movements)
//we are modifying the accounts array here where we have all the accounts


//148 creating usernames
const createUserName = function (accs) {
  //creating side effects
  accs.forEach(function (acc) {
    //adding this username property to every object in the accounts array
    acc.username = acc.owner.toLowerCase().split(' ').map((name) => name[0]).join('');
  });

}
createUserName(accounts);
// updating ui after transferring money of after login
const updateUI = (currentAccount) => {
  displayMovements(currentAccount.movements);


  //display balance 
  calcDisplayBalance(currentAccount);
  //display summary
  calcDisplaySummary(currentAccount);
}
//150
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accm, mov) => accm + mov, 0);

  labelBalance.textContent = `${acc.balance}€`
}
// calcDisplayBalance(account1.movements)

//151 chaining method use
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements.filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`


}
// calcDisplaySummary(accounts)


//display movmenets function

//event handlers
//implementing login
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) { //display ui and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner} `;
    containerApp.style.opacity = 100;
    //clear the input fields
    inputLoginPin.value = inputLoginUsername.value = ''
    inputLoginPin.blur()
    //display movements
    //displaying movements are refactored while implementing money transfers
    //into another function

    updateUI(currentAccount);
    //who transferred the money that also should be deposited



  }
  else {
    alert('Wrong username or pin! Try again!');
    containerApp.style.opacity = 0;
  }
})


//156 Implementing transfer
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
    //returns the first value where username===this value

  );
  inputTransferTo.value = inputTransferAmount.value = ''

  //currentAccount is previously defined before login implementation
  if (amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance
    && receiverAcc.username !== currentAccount.username
    //with receiverAcc check we check if it is valid account to transfer money into
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);



  }
  else {
    if (amount <= 0) alert('invalid amount,try again'.toUpperCase())
    else if (!receiverAcc) alert('wrong username,try again'.toUpperCase())
    else if (amount > currentAccount.balance) alert('You dontt have sufficient balance,try again'.toUpperCase())
    else if (receiverAcc.username === currentAccount.username)
      alert('Cannot transfer to this current account,try again'.toUpperCase())
  }


})


//158 requesting loan, using some method
//bank grants loan if there is atleast ine deposit of 10% of loan requested

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  //condition
  if (amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add the movement
    currentAccount.movements.push(amount);
    //update ui
    updateUI(currentAccount);
    inputLoanAmount.value = ''

  }





})




//156
//closing account
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username
    &&
    Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(accounts[index].owner);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started'


  }
  else alert('invalid info')

  inputCloseUsername = inputClosePin = '';


})
//160 sort button
let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})







/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


/////////////////////////////////////////////////
//140
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE method ///does not mutate the original
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-3, -1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr])

//SPLICE method //mutates the original
// console.log(arr.splice(2));
console.log(arr)//cuts off the part from idx 2 to size-1

arr.splice(-1);//just deletes the last element from the array
//start end index is a bit different here than slice
arr.splice(1, 2);
console.log(arr)


//REVERSE mutates the original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

//CONCAT

let letters = arr.concat(arr2);
// let letters = [...arr, ...arr2];

console.log(letters)

//same another technique
// console.log([...arr, ...arr2]);



//JOIN method
console.log(letters.join('_'))
console.log(letters.join())//defaukt joiner comma
console.log(letters)


*/

//141 looping the arrays

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//positive : deposit negative: withdraw

//for of loop
// for (let i of movements) {
//   if (i > 0) { console.log('deposit', Math.abs(i), 'rupees'); }
//   else if (i < 0) { console.log('withdrawn', Math.abs(i), 'rupees') }
// }

//how to use the indexes of the array element in for of loop

for (const [i, movement] of movements.entries())
  console.log(i, movement)


//for each loop
//only using elememnt as parameter
// movements.forEach(function (movement) {
//   if (movement > 0) { console.log('deposit', Math.abs(movement), 'rupees'); }
//   else if (movement < 0) { console.log('withdrawn', Math.abs(movement), 'rupees') }

// })
//using all parameters
movements.forEach(function (movement, index, array) {
  if (movement > 0) { console.log(index, 'deposit', Math.abs(movement), 'rupees'); }
  else if (movement < 0) { console.log(index, 'withdrawn', Math.abs(movement), 'rupees') }

})

*/

//142

/*
//forEach with maps and sets
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
  // console.log(map)
})

//set

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
//a set contains only unique elements
console.log(currenciesUnique)
currenciesUnique.forEach(function (value, key, set) {
  console.log(`${key}: ${value}`);

})
// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${value}: ${value}`);

// })

*/
//143

//145 coding challenge

//146 map filter reduce intro

//147 map method

/*

//1 usd =81.99 rupee
// const USDToRupee = 1 / 81.99
// const movementsRupee = movements.map(function (mov) {
//   return mov * USDToRupee;
//   //returning the converted values
// })
// console.log(movements)
// console.log((movementsRupee))
const eurToUsd = 1.1
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
//   //returning the converted values
// })
const movementsUSD = movements.map(mov => mov * eurToUsd)
console.log(movements)
console.log((movementsUSD))
// const movementsUSDfor = []
// for (const mov of movements)
//   movementsUSDfor.push(mov * eurToUsd)
// console.log(movementsUSDfor)


const movementsDescription = movements.map((movement, index, arr) => `${movement > 0 ? 'deposit' : 'withdraw'} ${index + 1}:   ${Math.abs(movement)} rupees`)
movementsDescription.forEach((str) => console.log(str))
*/


//149 filter method
/*
//to keep only deposits we have to remove the negatives or the withdrawals from the movements array
// const deposits =
//   movements.filter(function (mov) {
//     // if (mov > 0) return mov;
//     return mov > 0; //we can only return the boolean value here
//   })
const deposits =
  movements.filter(mov => mov > 0)
console.log(movements)

console.log(deposits)
const withdrawals =
  movements.filter(mov => mov < 0)

console.log(withdrawals)

const depositsfor = []
for (const mov of movements)
  if (mov > 0) depositsfor.push(mov)
console.log(depositsfor)
*/

//150 reduce method
/*
const balance = movements.reduce((acc, curr, idx, arr) => {
  console.log(`iteration ${idx}:${acc}`);
  return acc + curr;
}, 0)
console.log(balance)

//maximum value
const maximumValue = movements.reduce((acc, mov) => acc = Math.max(acc, mov),
  movements[0]);
console.log(maximumValue)

*/

//151 chaining method

//PIPELINE
/*
const eurToUsd = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    if (i == arr.length - 1)
      console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

*/


//154 find method
/*
const firstWithdrawal = movements.find(mov => mov < 0)
console.log(firstWithdrawal)
// console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis')
console.log(account)
*/

//156 find index method used in deleting account

//157 some and every
/*
//indludes example
console.log(movements);
console.log(movements.includes(-130));//checks if array has a -130,
//includes returns boolean value but it only checks for equality
//checking if there is any deposits in movements
//some  checks for any condition given
const anyDeposits =
  movements.some(mov => mov > 5000);
console.log(anyDeposits)


//every :returns true if every element satisfies some condition
console.log(movements.every(mov => mov > 0))

*/

//159: flat and flatmap method

/*

//flat
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];

console.log(arrDeep.flat(2));//this contains the inner arrays


// example
// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

//flatmap
// example

const allMovements = accounts.flatMap(acc => acc.movements);
console.log(allMovements);

const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

*/

//160 sorting
const owners = ['jonas', 'zach', 'adam', 'martha'];
console.log(owners.sort());
console.log(owners, 'this sort function mutates the array');
const numbers = [-10, -2, -60, 1, 2, 3, 5, 6, 7, 8, 1, 2, 4, 5, 6, 7];
// console.log(numbers.sort());//this will sort numbers array elements as strings

/*
compare_function(a,b){

return <0 ,a,b  //keep the order
return >0 ,b,a //switch order  

*/
//Ascending order 
console.log(numbers.sort((a, b) => {
  // if (a > b) return 1;
  // if (b > a) return -1;
  // return a > b ? 1 : -1;

  return a - b;
}));
//Descending order
console.log(numbers.sort((a, b) => {
  // return a > b ? -1 : 1;
  return b - a;

}));

