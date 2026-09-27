'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { sendContact, type ContactState } from '@/app/(site)/contact/actions'
import { ArrowRight, CheckIcon } from '@/components/icons'
import styles from './ContactForm.module.css'

export function ContactForm({ topics }: { topics: string[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' })
  const [t, setT] = useState(0)
  const status = useRef<HTMLDivElement>(null)
  useEffect(() => setT(Date.now()), [])
  useEffect(() => {
    if (state.status !== 'idle') status.current?.focus()
  }, [state])

  if (state.status === 'sent') {
    return (
      <div className={styles.sent} ref={status} tabIndex={-1} role="status">
        <span className={styles.check}>
          <CheckIcon size={22} />
        </span>
        <p className="t-h3">Message sent</p>
        <p className="t-body">Thanks for reaching out. We’ll reply to the email address you provided.</p>
      </div>
    )
  }

  const f = state.fields ?? {}
  return (
    <form action={action} className={styles.form} noValidate={false}>
      <input type="hidden" name="t" value={t} />
      <div className={styles.trap} aria-hidden="true">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.row}>
        <Field label="Name" name="name" autoComplete="name" defaultValue={f.name} required />
        <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={f.email} required />
      </div>

      {topics.length > 0 && (
        <div className={styles.field}>
          <label htmlFor="topic">What is this about?</label>
          <div className={styles.selectWrap}>
            <select id="topic" name="topic" defaultValue={f.topic || topics[0]}>
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={6} required maxLength={5000} defaultValue={f.message} />
      </div>

      <div ref={status} tabIndex={-1} aria-live="polite" className={styles.status}>
        {state.status === 'error' && <p className={styles.error}>{state.message}</p>}
      </div>

      <button type="submit" className="btn btn--primary" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'} <ArrowRight size={16} />
      </button>
    </form>
  )
}

function Field({ label, name, type = 'text', ...rest }: { label: string; name: string; type?: string; autoComplete?: string; defaultValue?: string; required?: boolean }) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} {...rest} />
    </div>
  )
}
