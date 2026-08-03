import React from 'react'
import { Link } from 'react-router-dom'
import { SUPPORT_EMAIL, getLegalLastUpdatedLabel } from '../constants'

const TermsPage = () => (
  <section className="legal-page">
    <div className="container content-block">
      <h1>Terms &amp; Conditions</h1>
      <p className="legal-updated">
        <em>Last updated: {getLegalLastUpdatedLabel()}</em>
      </p>
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the Vehicle
        State Tax website, mobile application, and related services (collectively, the
        &quot;Service&quot;). By creating an account, placing an order, or otherwise using the Service,
        you agree to be bound by these Terms. If you do not agree, please do not use the Service.
      </p>
      <p>
        Vehicle State Tax is operated as a private technology service provider. We are not a government
        authority. We assist users with vehicle tax payment workflows, order tracking, receipts, and
        support in connection with applicable transport and tax processes. You remain solely
        responsible for compliance with motor vehicle laws, tax rules, and documentation requirements
        in your state or region.
      </p>

      <h2>1. Eligibility and account</h2>
      <p>
        You must be at least 18 years old and capable of entering into a binding contract under
        applicable law. You must provide a valid mobile number for OTP-based login and keep your
        account credentials secure. You are responsible for all activity under your account. Notify us
        immediately if you suspect unauthorized access.
      </p>

      <h2>2. Accurate information</h2>
      <p>
        You agree to submit correct and complete information, including vehicle number, owner details,
        state, tax type, and payment-related data. Incorrect information may delay processing, cause
        order failure, or result in cancellation. We may request additional verification before
        completing an order.
      </p>

      <h2>3. Orders and service delivery</h2>
      <p>
        Each tax payment request creates an order in our system with a unique order ID. Processing
        times depend on payment confirmation, internal review, and third-party or government systems.
        We process orders on a best-effort basis and do not guarantee specific completion times.
        Status updates are available in the app and may be sent via SMS, WhatsApp, or push
        notifications where enabled.
      </p>

      <h2>4. Fees and payments</h2>
      <p>
        Payable amounts shown in the app include applicable tax or service charges as configured for
        your selection. Payments are collected through authorized payment gateways and/or wallet
        balance where available. A payment is considered successful only after confirmation from the
        payment provider and our systems. Failed or incomplete payments do not constitute a completed
        order.
      </p>
      <p>
        For refunds and cancellations, see our{' '}
        <Link to="/refund-cancellation">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>5. Wallet</h2>
      <p>
        If you use in-app wallet features, wallet balance is applied according to order rules at
        checkout. Wallet transactions are recorded in your account history. Misuse, chargebacks, or
        fraudulent activity may result in suspension and reversal of wallet credits as permitted by
        law and our internal policies.
      </p>

      <h2>6. Prohibited use</h2>
      <p>You may not use the Service to:</p>
      <ul>
        <li>Submit false, misleading, or fraudulent payment or vehicle information</li>
        <li>Attempt to bypass security, access other users&apos; data, or interfere with systems</li>
        <li>Resell or commercially exploit the Service without written permission</li>
        <li>Violate any applicable law, regulation, or third-party rights</li>
      </ul>
      <p>
        We may suspend or terminate access, cancel orders, and cooperate with authorities where
        required.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The Service, including software, design, logos, and content, is owned by Vehicle State Tax
        or its licensors. You receive a limited, non-exclusive license to use the Service for personal
        or authorized business use in accordance with these Terms.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot; to the fullest extent
        permitted by law. We do not warrant uninterrupted or error-free operation. Official tax
        records and legal effect of payments may depend on government systems outside our control.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Vehicle State Tax and its operators shall not be liable
        for indirect, incidental, special, or consequential damages arising from use of the Service.
        Our aggregate liability for any claim relating to the Service shall not exceed the amount you
        paid to us for the specific order giving rise to the claim in the three months preceding the
        claim, except where liability cannot be limited under applicable law.
      </p>

      <h2>10. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &quot;Last updated&quot; date at the top
        reflects the latest revision. Continued use after changes constitutes acceptance of the
        updated Terms where permitted by law.
      </p>

      <h2>11. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of India. Courts at Alwar, Rajasthan shall have
        exclusive jurisdiction subject to applicable consumer protection laws that may provide
        alternate forums.
      </p>

      <h2>12. Contact</h2>
      <p>
        For questions about these Terms, contact{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </div>
  </section>
)

export default TermsPage
