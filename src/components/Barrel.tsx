import type { SVGProps } from 'react'

/** Small barrel grill mark for menu headings and the favicon. */
export function BarrelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...props}>
      <g stroke="var(--ink-true, #000)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M8 12.5c-1.3 4.6-1.3 9 .4 14h15.2c1.7-5 1.7-9.4.4-14z" fill="var(--icon-body, #c3942c)" />
        <path d="M6.6 12.6c2.6-5.6 16.2-5.6 18.8 0z" fill="var(--icon-lid, #fed289)" />
        <path d="M14 6.2h4" />
        <path d="M7.6 17.6c5.6 1.1 11.2 1.1 16.8 0M7.8 22.4c5.5 1 10.9 1 16.4 0" fill="none" />
        <path d="M10 26.5v2.2M22 26.5v2.2" />
      </g>
    </svg>
  )
}
