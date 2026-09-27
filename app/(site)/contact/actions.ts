'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { getSite } from '@/lib/content'

export type ContactState = { status: 'idle' | 'sent' | 'error'; message?: string; fields?: Record<string, string> }

const recent = new Map<string, number[]>()

/** Sends a contact-form message to the inbox configured for the chosen topic in the CMS. */
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const site = await getSite()
  const fields = {
    name: String(form.get('name') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    topic: String(form.get('topic') ?? '').trim(),
    message: String(form.get('message') ?? '').trim(),
  }

  // Spam trap: real people never fill the hidden field or submit within 2 seconds.
  if (String(form.get('company') ?? '') || Date.now() - Number(form.get('t') ?? 0) < 2000) {
    return { status: 'sent' }
  }

  if (!fields.name || !fields.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { status: 'error', message: 'Please add your name, a valid email address, and a message.', fields }
  }
  if (fields.message.length > 5000) {
    return { status: 'error', message: 'Please keep your message under 5,000 characters.', fields }
  }

  // Basic rate limit: 5 messages per 10 minutes per address.
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (hits.length >= 5) return { status: 'error', message: 'Too many messages. Please try again later or email us directly.', fields }
  recent.set(ip, [...hits, now])

  const topic = site.contact.topics.find((t) => t.label === fields.topic)
  const to = topic?.email || site.contact.general
  const key = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL

  if (!key || !from || !to) {
    return {
      status: 'error',
      message: `The contact form isn’t connected yet. Please email ${to || 'us'} directly.`,
      fields,
    }
  }

  try {
    const resend = new Resend(key)
    const { error } = await resend.emails.send({
      from: `VT CRO Website <${from}>`,
      to,
      replyTo: fields.email,
      subject: `[vtcro.org] ${fields.topic || 'Message'} from ${fields.name}`,
      text: `${fields.message}\n\n—\nFrom: ${fields.name} <${fields.email}>\nTopic: ${fields.topic || 'General'}\nSent via the contact form on vtcro.org`,
    })
    if (error) throw error
    return { status: 'sent' }
  } catch {
    return { status: 'error', message: `Something went wrong sending your message. Please email ${to} directly.`, fields }
  }
}
