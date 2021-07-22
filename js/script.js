// **************
// DOM SELECTORS
// **************
// Form & button
const userInputForm = document.getElementById("userInputForm");
const resetBtn = document.getElementById("resetBtn");
// Alert box and components
const alertBox = document.getElementById("alertBox");
const alertHeading = document.getElementById("alertHeading");
const alertMessage = document.getElementById("alertMessage");
// Monthly payments box and components
const monthlyPaymentsBox = document.getElementById("monthlyPayments");
const totalMonthlyAmount = document.getElementById("totalMonthlyAmount");
const principal = document.getElementById("principal");
const interest = document.getElementById("interest");
const cost = document.getElementById("cost");
// Table
const table = document.getElementById("table");
const tableBody = document.getElementById("tableBody");

// **************
// FUNCTIONS
// **************
// When an error occurs, show the alert box
const showAlert = (heading, message) => {
  alertHeading.innerText = heading;
  alertMessage.innerText = message;
  alertBox.classList.remove("d-none");
};

// Clear any previously shown alerts
const clearAlerts = () => {
  alertHeading.innerText = "";
  alertMessage.innerText = "'";
  alertBox.classList.add("d-none");
};

// Clear all user inputs
const clearInputs = () => {
  document.getElementById("userAmount").value = "";
  document.getElementById("userPayments").value = "";
  document.getElementById("loanRate").value = "";
};

// Reset monthly payments display data to the defaults of 0
const resetMonthlyPaymentsDisplay = () => {
  totalMonthlyAmount.innerText = 0;
  principal.innerText = 0;
  interest.innerText = 0;
  cost.innerText = 0;
};

// Reset form, monthly display and table display
const resetEverything = () => {
  clearAlerts();
  resetMonthlyPaymentsDisplay();
  clearInputs();
  table.classList.add("d-none");
  tableBody.innerHTML = "";
};

// calculate all loan details
const calculateLoanDetails = (principal, months, percent) => {
  // Convert interest rate from annual to monthly
  const interestRate = percent / 1200;

  // compute the monthly payment figure
  var x = Math.pow(1 + interestRate, months); //Math.pow computes powers
  var monthlyPayment = ((principal * x * interestRate) / (x - 1)).toFixed(2);

  // Calculate total interest amount for the loan
  const interest = +(monthlyPayment * months - principal).toFixed(2);

  // Calculate total cost of the loan
  const total = principal + interest;

  return {
    monthlyPayment,
    principal,
    interest,
    total,
  };
};

// Display monthly payments information
const displayMonthlyPayments = (loanDetails) => {
  totalMonthlyAmount.innerText = loanDetails.monthlyPayment;
  principal.innerText = loanDetails.principal;
  interest.innerText = loanDetails.interest;
  cost.innerText = loanDetails.total;

  // Flash the result display to get user's attention
  monthlyPaymentsBox.classList.add("flashing");
  setTimeout(() => monthlyPaymentsBox.classList.remove("flashing"), 2000);
};

// Display table with amortization data
const displayAmortizationTable = (loanDetails, months, rate) => {
  const { monthlyPayment, principal, interest, total } = loanDetails;

  //   Total Monthly Payment = (amount loaned) * (rate/1200) / (1 – (1 + rate/1200)(-Number of Months) )
  //   Remaining Balance before the very first month equals the amount of the loan.
  //   Interest Payment = Previous Remaining Balance * rate/1200
  //   Principal Payment = Total Monthly Payment - Interest Payment
  //   At end each month, Remaining Balance = Previous Remaining Balance - principal payments

  // tableData += `
  //   <tr>
  //   <td>${i}</td>
  //   <td>${monthlyPayment}</td>
  //   <td>${principal}</td>
  //   <td>${interest}</td>
  //   <td>${interest}</td>
  //   <td>${total}</td>
  //   </tr>
  // `;

  let tableData = "";
  let remainingBalance = principal;
  let totalInterestPaid = 0;

  for (let i = 1; i <= months; i++) {
    const interestPaid = monthlyPayment * (rate / 1200);
    console.log(`interestPaid`, interestPaid);
    const principalPaid = monthlyPayment - interestPaid;
    totalInterestPaid += interestPaid;

    tableData += `
      <tr>
      <td>${i}</td>
      <td>${monthlyPayment}</td>
      <td>${principalPaid}</td>
      <td>${interestPaid}</td>
      <td>${totalInterestPaid}</td>
      <td>${remainingBalance}</td>
      </tr>
    `;

    remainingBalance = remainingBalance - principalPaid;
  }

  tableBody.innerHTML = tableData;
  table.classList.remove("d-none");
};

// Get User Input
const getUserInput = (e) => {
  // Prevent form's default behavior of submition
  e.preventDefault();

  // Clear any previous alerts
  clearAlerts();
  // Clear data from any previously calculation
  resetMonthlyPaymentsDisplay();

  // Get user inputs from
  const userAmount = document.getElementById("userAmount").value;
  const userPayments = document.getElementById("userPayments").value;
  const loanRate = document.getElementById("loanRate").value;

  // Convert user inputs from typeof string to number and retain floating point values
  const userAmountNumber = +userAmount;
  const userPaymentsNumber = +userPayments;
  const loanRateNumber = +loanRate;

  // Validate that user inputs are indeed numbers
  if (!userAmount || !userPayments || !loanRate) {
    // Error case
    showAlert(
      "Did you enter the correct information above?",
      "Only numbers are allowed inputs and the fields cannot be empty. Please enter all information about the loan before clicking on calculate."
    );
  } else {
    // If all inputs are valid and there's no error:
    // Calculate loan details: return an object that is saved in "loanDetails"
    const loanDetails = calculateLoanDetails(
      userAmountNumber,
      userPaymentsNumber,
      loanRateNumber
    );

    // Display monthly payments information
    displayMonthlyPayments(loanDetails);
    // Display table with amortization data
    displayAmortizationTable(
      loanDetails,
      userPaymentsNumber,
      userPaymentsNumber
    );

    // Clear inputs
    clearInputs();
  }
};

// **************
// EVENT HANDLERS
// **************
// Listen to submit event on the form
userInputForm.addEventListener("submit", getUserInput);
// Reset everything and start fresh
resetBtn.addEventListener("click", resetEverything);
