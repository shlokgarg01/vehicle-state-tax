export const calculateWithdrawalAmounts = (walletDebitInput, deductionPercent = 0) => {
  const walletDebitAmount = Math.floor(Number(walletDebitInput) || 0)
  const percent = Math.min(100, Math.max(0, Number(deductionPercent) || 0))
  const payoutAmount = Math.floor(
    walletDebitAmount - (walletDebitAmount * percent) / 100
  )
  const deductionAmount = walletDebitAmount - payoutAmount

  return {
    walletDebitAmount,
    payoutAmount,
    deductionPercent: percent,
    deductionAmount,
  }
}
