'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { sendContact, type ContactState } from '@/app/(site)/contact/actions'
import { ArrowRight, CheckIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'

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
      <div
        className="grid justify-items-start gap-3 rounded-(--radius-m) border border-line bg-surface-2 p-[clamp(28px,4vw,44px)] outline-none"
        ref={status}
        tabIndex={-1}
        role="status"
      >
        <span className="mb-2 grid size-12 place-items-center rounded-[50%] bg-accent-soft text-accent">
          <CheckIcon size={22} />
        </span>
        <p className="t-h3">Message sent</p>
        <p className="t-body">Thanks for reaching out. We’ll reply to the email address you provided.</p>
      </div>
    )
  }

  const f = state.fields ?? {}
  return (
    <form action={action} className="grid gap-5" noValidate={false}>
      <input type="hidden" name="t" value={t} />
      <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
        <Field label="Name" name="name" autoComplete="name" defaultValue={f.name} required />
        <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={f.email} required />
      </div>

      {topics.length > 0 && (
        <div className="grid gap-2">
          <Label htmlFor="topic">What is this about?</Label>
          <NativeSelect id="topic" name="topic" defaultValue={f.topic || topics[0]}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </NativeSelect>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required maxLength={5000} defaultValue={f.message} />
      </div>

      <div ref={status} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {state.status === 'error' && <p className="border-l-2 border-l-[#f08a7e] bg-[rgb(240_138_126/0.08)] px-3.5 py-3 text-[0.9375rem] text-[#f5b3aa]">{state.message}</p>}
      </div>

      <Button type="submit" className="justify-self-start disabled:cursor-progress disabled:opacity-60" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'} <ArrowRight size={16} />
      </Button>
    </form>
  )
}

function Field({ label, name, type = 'text', ...rest }: { label: string; name: string; type?: string; autoComplete?: string; defaultValue?: string; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} {...rest} />
    </div>
  )
}
