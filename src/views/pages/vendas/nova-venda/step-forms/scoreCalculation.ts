// ** Sale Score Calculation
export default (saleObj: any) => {
  const {saleAmount: sale, totalCost: cost, paymentMethod: payment} = saleObj
  const {paymentType: paymentMethod} = payment

  const markup = Math.round(((sale - cost) / cost) * 10) / 10 // Markup
  const profit = Math.round(sale - cost) // Profit
  let score = 0 // Score
  const maxScore = 10 // Max Score

  const priceRange = {
    1: {min: 0, max: 999},
    2: {min: 1000, max: 1599},
    3: {min: 1600, max: 2399},
    4: {min: 2400, max: 3999},
    5: {min: 4000, max: 999999}
  }
  const profitRange = {
    1: {min: 0, max: 399},
    2: {min: 400, max: 799},
    3: {min: 800, max: 1299},
    4: {min: 1300, max: 1899},
    5: {min: 1900, max: 999999}
  }
  const markupRange = {
    1: {min: 0, max: 2.5},
    2: {min: 2.6, max: 3.1},
    3: {min: 3.2, max: 4.1},
    4: {min: 4.1, max: 5},
    5: {min: 5.1, max: 999999}
  }
  const paymentMethodMultiplicator = () => {
    switch (paymentMethod) {
      case "cash":
        return 1.05
      case "debitCard":
        return 0.975
      case "pix":
        return 1
      case "creditCard":
        return 0.85
      case "installment":
        return 0.75
      case "ted":
        return 0.975
      default:
        return 1
    }
  }

  // console.log("score", score);
  // Add score based on price /1000
  score += sale / 850
  // console.log("score + based on price", score);

  // Add score based on profit
  const profitScore = () => {
    if (profit > profitRange[5].max) {
      return 3.75
    } else if (profit > profitRange[4].max) {
      return 3.2
    } else if (profit > profitRange[3].max) {
      return 2.5
    } else if (profit > profitRange[2].max) {
      return 1.8
    } else if (profit > profitRange[1].max) {
      return 1.2
    } else {
      return 0.5
    }
  }
  score += profitScore()
  // console.log("score + based on profit", score);

  // add score based on price
  const priceScore = () => {
    if (sale > priceRange[5].max) {
      return 3
    } else if (sale > priceRange[4].max) {
      return 2.5
    } else if (sale > priceRange[3].max) {
      return 2
    } else if (sale > priceRange[2].max) {
      return 1.5
    } else if (sale > priceRange[1].max) {
      return 0.8
    } else {
      return 0.5
    }
  }
  score += priceScore()
  // console.log("score + based on price range", score);

  // Add score based on markup
  const markupScore = () => {
    if (markup > markupRange[5].max) {
      return 3
    } else if (markup > markupRange[4].max) {
      return 2.5
    } else if (markup > markupRange[3].max) {
      return 1.8
    } else if (markup > markupRange[2].max) {
      return 1.2
    } else if (markup > markupRange[1].max) {
      return 0.5
    } else {
      return 0.3
    }
  }
  score += markupScore()
  // console.log("score + based on markup", score);

  // Multiply score by payment method multiplicator
  score *= paymentMethodMultiplicator()
  // console.log("score * payment method multiplicator", score);

  // Limit score to 10
  if (score > maxScore) {
    score = maxScore
  }
  // console.log("score limited to 10", score);

  // Return score
  return {
    score: parseFloat(score.toFixed(2)),
    profit: profit,
    markup: markup
  }
}
