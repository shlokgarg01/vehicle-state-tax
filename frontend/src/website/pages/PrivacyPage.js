import React from 'react'
import { Link } from 'react-router-dom'
import { SUPPORT_EMAIL, getLegalLastUpdatedLabel } from '../constants'

const PrivacyPage = () => (
  <section className="legal-page">
    <div className="container content-block">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">
        <em>Last updated: {getLegalLastUpdatedLabel()}</em>
      </p>
      <p>
        Vehicle State Tax (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy.
        This Privacy Policy explains what information we collect, how we use and share it, how long we
        keep it, and your choices when you use our website, mobile application, and customer support
        channels (the &quot;Service&quot;).
      </p>
      <p>
        By using the Service, you acknowledge that you have read this Privacy Policy. If you do not
        agree, please discontinue use of the Service.
      </p>

      <h2>1. Information we collect</h2>
      <p>We may collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account and identity:</strong> mobile number, OTP verification records, optional
          profile details, and device identifiers used for login and security.
        </li>
        <li>
          <strong>Vehicle and order data:</strong> vehicle registration number, owner name, state,
          tax category, tax mode, order ID, order status, amounts, and related fields you submit for
          payment processing.
        </li>
        <li>
          <strong>Payment information:</strong> transaction references, payment method type, gateway
          status, wallet debits/credits, and timestamps. We do not store full card or UPI PIN details;
          those are handled by payment partners.
        </li>
        <li>
          <strong>Communications:</strong> support emails, WhatsApp or SMS messages, call logs where
          recorded for quality, and in-app feedback you provide.
        </li>
        <li>
          <strong>Technical and usage data:</strong> app version, IP address, crash logs, and
          analytics events needed to operate and improve the Service (where enabled).
        </li>
        <li>
          <strong>Notifications:</strong> push notification tokens (FCM) if you allow notifications on
          your device.
        </li>
      </ul>

      <h2>2. How we use information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Authenticate you and maintain your account</li>
        <li>Process tax payment orders, confirmations, and receipts</li>
        <li>Operate wallet features and withdrawal flows where applicable</li>
        <li>Send order updates, payment alerts, and service messages</li>
        <li>Provide customer support and resolve disputes</li>
        <li>Detect fraud, abuse, and security incidents</li>
        <li>Comply with legal obligations and respond to lawful requests</li>
        <li>Improve app performance, features, and user experience</li>
      </ul>

      <h2>3. Legal bases and consent</h2>
      <p>
        We process information as necessary to perform our contract with you (providing the Service),
        based on your consent where required (such as optional notifications), and for legitimate
        interests such as security and service improvement, consistent with applicable Indian law
        including the Digital Personal Data Protection Act, 2023, where applicable.
      </p>

      <h2>4. Sharing and disclosure</h2>
      <p>We may share information with:</p>
      <ul>
        <li>
          <strong>Payment gateways and banks</strong> to complete transactions and reconcile payments
        </li>
        <li>
          <strong>Technology providers</strong> such as cloud hosting, SMS/WhatsApp delivery, and
          push notification services, under confidentiality obligations
        </li>
        <li>
          <strong>Staff and authorized partners</strong> who require access to process orders and
          support users
        </li>
        <li>
          <strong>Authorities</strong> when required by law, court order, or to protect rights and
          safety
        </li>
      </ul>
      <p>We do not sell your personal information to third parties for their marketing purposes.</p>

      <h2>5. Data retention</h2>
      <p>
        We retain information for as long as needed to provide the Service, meet legal and accounting
        requirements, and resolve disputes. Order and payment records may be kept for several years
        as required for audit and compliance. When data is no longer needed, we delete or anonymize it
        where feasible.
      </p>

      <h2>6. Security</h2>
      <p>
        We use reasonable administrative, technical, and organizational measures to protect
        information, including encrypted connections (HTTPS), access controls, and monitoring. No
        method of transmission or storage is completely secure; you use the Service at your own risk
        and should protect your device and OTP codes.
      </p>

      <h2>7. Your choices and rights</h2>
      <p>Depending on applicable law, you may have the right to:</p>
      <ul>
        <li>Access or correct certain account and order information in the app</li>
        <li>Withdraw consent for optional processing (such as marketing notifications)</li>
        <li>Request deletion or restriction of processing where legally required</li>
        <li>Lodge a complaint with a relevant data protection authority</li>
      </ul>
      <p>
        To exercise these rights, contact us at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We may verify your identity before
        responding.
      </p>

      <h2>8. Children</h2>
      <p>
        The Service is not directed at children under 18. We do not knowingly collect personal
        information from children. If you believe a child has provided data, contact us for removal.
      </p>

      <h2>9. Third-party links</h2>
      <p>
        The Service may link to third-party sites (such as app stores or payment pages). Their privacy
        practices are governed by their own policies. We encourage you to review those policies
        before providing information.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date
        indicates the latest version. Material changes may be communicated through the app or website
        where appropriate.
      </p>

      <h2>11. Related policies</h2>
      <p>
        Please also read our <Link to="/terms">Terms &amp; Conditions</Link> and{' '}
        <Link to="/refund-cancellation">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>12. Contact</h2>
      <p>
        Privacy questions or requests:{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </div>
  </section>
)

export default PrivacyPage
