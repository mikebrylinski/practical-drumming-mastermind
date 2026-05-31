// Static transactional email templates. No AI, no dynamic generation.
// Each template returns { subject, html }.

const COLORS = {
  void: '#050505',
  charcoal: '#0f0e0c',
  gold: '#c9a55c',
  mist: '#e8e4dc',
}

function layout(title, bodyHtml) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:${COLORS.void};color:${COLORS.mist};font-family:Georgia,'EB Garamond',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.void};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:${COLORS.charcoal};border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">
          <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <span style="font-family:'Bebas Neue',Arial,sans-serif;letter-spacing:2px;font-size:18px;color:${COLORS.gold};">PRACTICAL DRUMMING MASTERMIND</span>
          </td></tr>
          <tr><td style="padding:32px;">
            <h1 style="margin:0 0 16px;font-size:24px;color:${COLORS.mist};">${title}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(232,228,220,0.4);">
            Practical Drumming — Mastermind Club
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

function button(href, label) {
  if (!href) return ''
  return `<a href="${href}" style="display:inline-block;margin-top:20px;background:${COLORS.gold};color:${COLORS.void};text-decoration:none;padding:12px 26px;border-radius:999px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">${label}</a>`
}

function paragraph(text) {
  return `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:rgba(232,228,220,0.75);">${text}</p>`
}

export const TEMPLATES = {
  welcome_email: (d = {}) => ({
    subject: 'Welcome to the Practical Drumming Mastermind',
    html: layout(
      `Welcome${d.name ? `, ${d.name}` : ''}.`,
      paragraph('You are now part of a community built for serious drummers.') +
        paragraph('Show up, participate, and let the work compound.') +
        button(d.dashboardUrl, 'Open dashboard'),
    ),
  }),

  booking_confirmation: (d = {}) => ({
    subject: `Your call is booked${d.dateLabel ? ` — ${d.dateLabel}` : ''}`,
    html: layout(
      "You're booked.",
      paragraph(`We look forward to speaking with you${d.dateLabel ? ` on <strong>${d.dateLabel}</strong>` : ''}${d.time ? ` at <strong>${d.time}</strong>` : ''}.`) +
        (d.joinUrl ? paragraph('When it’s time, join the live room using the button below.') : '') +
        button(d.joinUrl, 'Join the room'),
    ),
  }),

  booking_cancelled: (d = {}) => ({
    subject: 'Your booking was cancelled',
    html: layout(
      'Booking cancelled.',
      paragraph(`Your call${d.dateLabel ? ` on <strong>${d.dateLabel}</strong>` : ''} has been cancelled.`) +
        paragraph('You can book another time whenever you’re ready.') +
        button(d.bookUrl, 'Book another time'),
    ),
  }),

  session_reminder: (d = {}) => ({
    subject: `Reminder: ${d.title || 'Your live session'} is coming up`,
    html: layout(
      'A quick reminder.',
      paragraph(`<strong>${d.title || 'Your live session'}</strong>${d.dateLabel ? ` starts ${d.dateLabel}` : ''}.`) +
        button(d.joinUrl, 'Join the session'),
    ),
  }),

  session_join_link: (d = {}) => ({
    subject: `Your join link${d.title ? ` for ${d.title}` : ''}`,
    html: layout(
      'Here’s your join link.',
      paragraph('Click below to enter the live classroom.') + button(d.joinUrl, 'Join now'),
    ),
  }),

  application_received: (d = {}) => ({
    subject: 'We received your application',
    html: layout(
      `Thank you${d.name ? `, ${d.name}` : ''}.`,
      paragraph('We’ve received your application to the Mastermind and will be in touch soon.') +
        paragraph('Keep an eye on your inbox.'),
    ),
  }),
}

export function renderEmail(template, data = {}) {
  const fn = TEMPLATES[template]
  if (!fn) return null
  return fn(data)
}

export const TEMPLATE_IDS = Object.keys(TEMPLATES)
