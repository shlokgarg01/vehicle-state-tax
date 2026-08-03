import React from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { HELPLINE, WHATSAPP, SUPPORT_EMAIL, getLegalLastUpdatedLabel } from '../constants'

const RefundCancellationPage = () => (
  <>
    <PageHero
      title="Refund & Cancellation Policy"
      subtitle="How we handle order cancellations, failed payments, and refund requests."
    />
    <section className="legal-page">
      <div className="container content-block">
        <p className="legal-updated">
          <em>Last updated: {getLegalLastUpdatedLabel()}</em>
        </p>
        <p>
          This Refund &amp; Cancellation Policy (&quot;Policy&quot;) applies to tax payment and
          related orders placed through the <strong>Vehicle State Tax</strong> mobile application,
          website, and official support channels. It should be read together with our{' '}
          <Link to="/terms">Terms &amp; Conditions</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <p>
          By placing an order, you agree to the cancellation and refund rules described below. Where
          this Policy conflicts with mandatory consumer protection law, the law shall prevail.
        </p>

        <h2>1. Definitions</h2>
        <ul>
          <li>
            <strong>Order:</strong> a tax payment or service request created in the app with a unique
            order ID.
          </li>
          <li>
            <strong>Payment confirmed:</strong> when our systems and the payment gateway record a
            successful charge or wallet debit as per order rules.
          </li>
          <li>
            <strong>Processing:</strong> internal steps after payment to fulfill the order, which may
            include partner or government-system updates.
          </li>
        </ul>

        <h2>2. Cancellation before payment</h2>
        <p>
          You may abandon or cancel checkout before payment is completed. No tax or service amount is
          charged until payment succeeds. Orders that remain unpaid may expire or be automatically
          cancelled after a timeout (including hybrid wallet + gateway orders that are not completed
          within the allowed window).
        </p>

        <h2>3. Failed, pending, or abandoned payments</h2>
        <p>
          If payment fails, times out, or is declined by your bank or UPI app, the order stays unpaid
          or moves to a failed/cancelled state. You may retry payment by creating a new order or as
          directed in the app. If wallet balance was debited in error before gateway failure, we
          reverse the wallet portion after verification.
        </p>
        <p>
          &quot;Pending&quot; at the gateway does not mean we have received funds. Final status depends
          on gateway confirmation and our periodic status checks.
        </p>

        <h2>4. Cancellation after successful payment</h2>
        <p>
          Once payment is confirmed and processing has begun, cancellation may not be available
          because work may already have been performed or submitted to external systems. Cancellation
          requests are reviewed case-by-case when submitted with order ID, vehicle number, and
          registered mobile number.
        </p>
        <p>
          We may cancel an order unilaterally if information is invalid, fraud is suspected, the
          service cannot be delivered for the selected state or tax type, or required by law or
          partners.
        </p>

        <h2>5. Refund eligibility</h2>
        <p>Refunds may be approved when one or more of the following apply:</p>
        <ul>
          <li>Duplicate payment for the same order verified in our records and gateway reports</li>
          <li>
            Payment captured but the order could not be fulfilled due to a verified technical or
            operational error on our side
          </li>
          <li>
            Amount debited without a corresponding confirmed successful order (subject to gateway
            and bank verification)
          </li>
          <li>
            Order cancelled by us before fulfillment where no service was delivered and policy allows
            refund
          </li>
          <li>Chargeback or dispute resolved in your favour under payment network rules</li>
        </ul>
        <p>Refunds are generally not available when:</p>
        <ul>
          <li>The order was fulfilled and confirmation or receipt was issued as per service rules</li>
          <li>Incorrect details were provided by you and processing failed for that reason</li>
          <li>Delays caused solely by third-party or government systems outside our control</li>
        </ul>

        <h2>6. Refund method and timeline</h2>
        <p>
          Approved refunds are returned to the original payment source where possible (same UPI, card,
          or gateway route) or credited to your in-app wallet if that is the only viable method or if
          you agree. Processing typically begins within 3–5 business days of approval; banks and
          payment partners may take an additional 5–10 business days (or longer in rare cases) to
          show the credit in your account.
        </p>
        <p>
          Partial refunds may apply if only part of an order is reversed or if wallet and gateway
          amounts split the payment.
        </p>

        <h2>7. Wallet refunds</h2>
        <p>
          Wallet-only or partial wallet payments are reversed to wallet balance unless you request
          withdrawal through supported payout flows and meet verification requirements. Withdrawal
          requests are subject to separate review and timelines shown in the app.
        </p>

        <h2>8. How to request cancellation or refund</h2>
        <p>Contact support with:</p>
        <ul>
          <li>Registered mobile number</li>
          <li>Vehicle number</li>
          <li>Order ID and payment date</li>
          <li>Screenshot or UTR/reference from your bank or UPI app, if applicable</li>
        </ul>
        <p>
          Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <br />
          Helpline: <a href={`tel:${HELPLINE}`}>{HELPLINE}</a>
          <br />
          WhatsApp: <a href={`https://wa.me/91${WHATSAPP}`}>{WHATSAPP}</a>
        </p>
        <p>
          We may take up to 7 business days to investigate and respond. Complex cases involving
          gateways or banks may take longer.
        </p>

        <h2>9. Chargebacks</h2>
        <p>
          If you initiate a chargeback with your bank without contacting us, we may provide transaction
          records to the payment provider. Orders under dispute may be suspended pending resolution.
        </p>

        <h2>10. Policy updates</h2>
        <p>
          We may revise this Policy from time to time. The &quot;Last updated&quot; date reflects the
          current version. Continued use of the Service after updates constitutes acceptance where
          permitted by law.
        </p>
      </div>
    </section>
  </>
)

export default RefundCancellationPage
