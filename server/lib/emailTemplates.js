// Static transactional email templates. No AI, no dynamic generation.
// Each template returns { subject, html }.

import { publicPath } from './publicUrl.js'

const COLORS = {
  black: '#000000',
  white: '#ffffff',
  mist: '#e8e4dc',
  gold: '#c9a55c',
}

function emailLogoUrl() {
  const url = publicPath('/logo-dd.png')
  if (url.startsWith('https://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url
  }
  return 'https://www.pracdrum.com/logo-dd.png'
}

function emailHeader() {
  const logoUrl = emailLogoUrl()
  return `<table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding-right:12px;vertical-align:middle;">
        <a href="https://pracdrum.com" style="text-decoration:none;">
          <img src="${logoUrl}" alt="" width="36" height="36" style="display:block;width:36px;height:36px;border:0;" />
        </a>
      </td>
      <td style="vertical-align:middle;">
        <a href="https://pracdrum.com" style="font-family:'Bebas Neue',Arial,sans-serif;font-size:28px;line-height:1;letter-spacing:0.05em;color:${COLORS.mist};text-decoration:none;">PRACTICAL DRUMMING</a>
      </td>
    </tr>
  </table>`
}

function layout(title, bodyHtml) {
  const logoUrl = emailLogoUrl()
  return `<!doctype html>
<html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;background:${COLORS.black};color:${COLORS.white};font-family:Georgia,'EB Garamond',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.black};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:${COLORS.black};border:1px solid rgba(255,255,255,0.1);border-radius:14px;overflow:hidden;">
          <tr><td style="padding:20px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
            ${emailHeader()}
          </td></tr>
          <tr><td style="padding:32px;">
            <h1 style="margin:0 0 16px;font-size:24px;color:${COLORS.white};">${title}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td align="center" style="padding:28px 32px 24px;border-top:1px solid rgba(255,255,255,0.08);">
            <a href="https://pracdrum.com" style="text-decoration:none;">
              <img src="${logoUrl}" alt="Practical Drumming" width="88" height="88" style="display:block;width:88px;height:88px;margin:0 auto 16px;border:0;" />
            </a>
            <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.55);">
              Practical Drumming — Mastermind Club
            </p>
            <a href="https://pracdrum.com" style="color:${COLORS.gold};text-decoration:none;font-size:12px;">pracdrum.com</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

function button(href, label) {
  if (!href) return ''
  return `<a href="${href}" style="display:inline-block;margin-top:20px;background:${COLORS.gold};color:${COLORS.black};text-decoration:none;padding:12px 26px;border-radius:999px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">${label}</a>`
}

function paragraph(text) {
  return `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.88);">${text}</p>`
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
      `You're booked${d.name ? `, ${d.name}` : ''}.`,
      paragraph(
        `We look forward to speaking with you${d.dateLabel ? ` on <strong>${d.dateLabel}</strong>` : ''}.`,
      ) +
        paragraph(
          'When it\u2019s time, join your private video room using the button below. You can also copy the link into your browser.',
        ) +
        button(d.joinUrl, 'Join the room') +
        (d.joinUrl
          ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.6);">Room link:<br><a href="${d.joinUrl}" style="color:${COLORS.gold};word-break:break-all;">${d.joinUrl}</a></p>`
          : ''),
    ),
  }),

  booking_admin_notification: (d = {}) => ({
    subject: `New booking${d.name ? ` — ${d.name}` : ''}`,
    html: layout(
      'New discovery call booked',
      paragraph(
        `<strong>${d.name || 'Guest'}</strong> (${d.email || 'no email'}) booked a call${d.dateLabel ? ` for <strong>${d.dateLabel}</strong>` : ''}.`,
      ) +
        paragraph('Guest room link:') +
        (d.joinUrl
          ? `<p style="margin:0 0 14px;font-size:13px;line-height:1.5;"><a href="${d.joinUrl}" style="color:${COLORS.gold};word-break:break-all;">${d.joinUrl}</a></p>`
          : '') +
        button(d.joinUrl, 'Open room') +
        button(d.adminBookingsUrl, 'View bookings'),
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

  contact_admin_notification: (d = {}) => ({
    subject: `New contact form message from ${d.name || 'visitor'}`,
    html: layout(
      'New contact submission',
      paragraph(`<strong>${d.name || 'Someone'}</strong> (${d.email || 'no email'}) sent a message:`) +
        paragraph(`"${(d.message || '').replace(/"/g, '&quot;')}"`) +
        (d.ip_address ? paragraph(`IP: ${d.ip_address}`) : ''),
    ),
  }),
}

export function renderEmail(template, data = {}) {
  const fn = TEMPLATES[template]
  if (!fn) return null
  return fn(data)
}

export const TEMPLATE_IDS = Object.keys(TEMPLATES)
