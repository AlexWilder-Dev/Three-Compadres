import type { Location } from '../data/venue'
import { groupHours } from '../lib/hours'

/** Address lines for a site. */
export function Address({ location }: { location: Location }) {
  const { street, extra, locality, postcode } = location.address
  return (
    <address className="address">
      {street}
      <br />
      {extra && (
        <>
          {extra}
          <br />
        </>
      )}
      {locality} {postcode}
    </address>
  )
}

/** Hours collapsed into runs, e.g. "Mon–Fri 11:30am – late". */
export function HoursList({ location, className = '' }: { location: Location; className?: string }) {
  return (
    <dl className={`hours-list ${className}`}>
      {groupHours(location).map((group) => (
        <div key={group.days}>
          <dt>{group.days}</dt>
          <dd>{group.range}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Email address that only breaks at the @ on narrow columns. */
export function EmailText({ email }: { email: string }) {
  const [user, domain] = email.split('@')
  return (
    <span className="email-text">
      {user}
      <wbr />@{domain}
    </span>
  )
}
