const API_URL = "https://api.exchangerate-api.com/v4/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Set initial values
let fromCurrency = "USD";
let toCurrency = "INR";
let exchangeRate = 80; // Default fallback rate

// Populate currency dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    if (evt.target.name === "from") fromCurrency = evt.target.value;
    if (evt.target.name === "to") toCurrency = evt.target.value;
    updateExchangeRate();
  });
}

const updateExchangeRate = async () => {
  let amount = parseFloat(amountInput.value) || 1;
  
  try {
    const response = await fetch(`${API_URL}${fromCurrency}`);
    const data = await response.json();
    exchangeRate = data.rates[toCurrency];
    updateDisplay(amount);
  } catch (error) {
    console.log("Using fallback rate due to API error:", error);
    updateDisplay(amount);
  }
};

function updateDisplay(amount) {
  const convertedAmount = (amount * exchangeRate).toFixed(2);
  msg.innerHTML = `
    <div class="rate-display">
      1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}<br>
      ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}
    </div>
  `;
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

amountInput.addEventListener("input", () => {
  updateDisplay(parseFloat(amountInput.value) || 1);
});

// Initialize on page load
window.addEventListener("load", () => {
  updateExchangeRate();
  updateDisplay(100); // Show initial rate for default 100 value
});