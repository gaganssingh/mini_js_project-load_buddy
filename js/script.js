// **************
// DOM SELECTORS
// **************
const userInputForm = document.getElementById("userInputForm");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const alertBox = document.getElementById("alertBox");
const alertHeading = document.getElementById("alertHeading");
const monthlyPaymentsBox = document.getElementById("monthlyPayments");
const alertMessage = document.getElementById("alertMessage");
const totalMonthlyAmount = document.getElementById("totalMonthlyAmount");
const totalPrincipalRemaining = document.getElementById(
  "totalPrincipalRemaining"
);
const totalInterestRemaining = document.getElementById(
  "totalInterestRemaining"
);
const totalCostRemaining = document.getElementById("totalCostRemaining");

// **************
// FUNCTIONS
// **************
// When an error occurs, show the alert box
const showAlert = (heading, message) => {
  alertHeading.innerText = heading;
  alertMessage.innerText = message;
  alertBox.classList.remove("invisible");
};

// Clear any previously shown alerts
const clearAlerts = () => {
  alertHeading.innerText = "";
  alertMessage.innerText = "'";
  alertBox.classList.add("invisible");
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
  totalPrincipalRemaining.innerText = 0;
  totalInterestRemaining.innerText = 0;
  totalCostRemaining.innerText = 0;
};

// Reset form, monthly display and table display
const resetEverything = () => {
  clearAlerts();
  resetMonthlyPaymentsDisplay();
  clearInputs();
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

// Display Monthly Payments Details
const displayMonthlyPayments = (loanDetails) => {
  totalMonthlyAmount.innerText = loanDetails.monthlyPayment;
  totalPrincipalRemaining.innerText = loanDetails.principal;
  totalInterestRemaining.innerText = loanDetails.interest;
  totalCostRemaining.innerText = loanDetails.total;

  // Flash the result display to get user's attention
  monthlyPaymentsBox.classList.add("flashing");
  setTimeout(() => monthlyPaymentsBox.classList.remove("flashing"), 2000);
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
