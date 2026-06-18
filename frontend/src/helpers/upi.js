export const buildUpiPaymentUri = ({ upiId, amount, payeeName, note }) => {
  if (!upiId?.trim()) return ''

  const params = new URLSearchParams()
  params.set('pa', upiId.trim())
  params.set('cu', 'INR')

  if (amount != null && amount !== '') {
    params.set('am', Number(amount).toFixed(2))
  }
  if (payeeName?.trim()) {
    params.set('pn', payeeName.trim().slice(0, 50))
  }
  if (note?.trim()) {
    params.set('tn', note.trim().slice(0, 80))
  }

  return `upi://pay?${params.toString()}`
}
