const Stock = require('../models/watchList1Model');

// Function to generate small alternating increments or decrements
function getSmallIncrementOrDecrement(currentPrice, targetPrice) {
  const direction = targetPrice > currentPrice ? 1 : -1; // Decide increment or decrement based on target
  const change = Math.random() * 0.5 * direction; // Small change (average 0.5)
  return currentPrice + change;
}

async function fluctuatePrice(WatchList1Stock) {
  let currentPrice = WatchList1Stock.price;
  const A = WatchList1Stock.watchlist1_A;
  const B = WatchList1Stock.watchlist1_B;

  if (A < B) {
    // Case 1: A < B (Move from A to B with small increments/decrements)
    if (currentPrice < B) {
      currentPrice = getSmallIncrementOrDecrement(currentPrice, B);
      if (currentPrice >= B) currentPrice = B; // Stop at B
    } else {
      // After reaching B, fluctuate between B-3 and B+3
      currentPrice = Math.random() * (B + 3 - (B - 3)) + (B - 3);
    }
  } else {
    // Case 2: A > B (Move from A to B with small decrements/increments)
    if (currentPrice > B) {
      currentPrice = getSmallIncrementOrDecrement(currentPrice, B);
      if (currentPrice <= B) currentPrice = B; // Stop at B
    } else {
      // After reaching B, fluctuate between B-3 and B+3
      currentPrice = Math.random() * (B + 3 - (B - 3)) + (B - 3);
    }
  }

  // Update the stock price and save to the database
  WatchList1Stock.price = currentPrice;
  await WatchList1Stock.save();
}

// Schedule price fluctuation for all stocks
function startPriceFluctuation() {
  setInterval(() => {
    Stock.find()
      .then(stocks => {
        stocks.forEach(fluctuatePrice);
      })
      .catch(err => {
        console.error('Error fetching stocks:', err);
      });
  }, 1000); // Run every 1 second (adjust as needed)
}

module.exports = { startPriceFluctuation };
