# Handover — Timelessapp.io

Transfer document for a change of ownership. For what the product *is* and how it
is built, read [`README.md`](./README.md); for the development history and
backlog, [`ACTION_PLAN.md`](./ACTION_PLAN.md). This file covers only what a new
owner needs: what they receive, how to run and deploy it, and what is knowingly
unfinished.

Last updated: 2026-08-05.

---

## 1. What is being transferred

| Asset | Where it lives | How it transfers |
|---|---|---|
| Source code | this Git repository | repo transfer or export |
| Domain `timelessapp.io` | registered at **Hostinger** | registrar transfer (auth code + 60-day ICANN lock applies) |
| DNS zone | **Cloudflare** (`lex` / `destiny` nameservers) | move zone to the buyer's Cloudflare account |
| Hosting | **Vercel** | project transfer, or redeploy from the buyer's own account |
| Backend | **Firebase** project (Auth, Firestore, Storage) | add buyer as Owner in IAM, then remove the seller |
| Email | Google Workspace on the domain | separate — transfers with the domain, not with the app |

**Order matters.** Transfer Firebase first (the app is useless without it), then
Vercel, then the DNS zone, then the registrar. Moving the registrar first can
leave the domain in a state where DNS edits are blocked mid-migration.

### Not included / must be re-created by the buyer

- Firebase API keys in `.env.local` (the buyer generates their own — see §3).
- Any Google Workspace mailboxes on the domain (separate licence and billing).
- Analytics or ad accounts, if any were connected outside this repo.

---

## 2. Running it locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the Firebase values
npm run dev                        # http://localhost:3000
```

Requires Node 18+ and, for the security-rule tests only, a JDK (the Firebase
emulators are Java).

## 3. Environment variables

All seven are `NEXT_PUBLIC_*`, read by the browser, and come from one place:
**Firebase Console → Project Settings → General → Your apps → SDK snippet**.

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

These are public by design — a Firebase web API key is an identifier, not a
secret. What actually protects the data is the security rules in §5. Do not
treat leaking these as a breach, and do not treat them as sufficient protection
either.

The same seven must be set in **Vercel → Settings → Environment Variables** for
Production, Preview and Development.

## 4. Deploying

**Application** — Vercel builds on push to `main`. No custom build command;
`npm run build` must pass first.

**Security rules deploy separately from the app.** This is the single most
common way to break this project: merging a rules change and assuming it is
live. It is not until you run:

```bash
npm run deploy:rules   # firebase deploy --only firestore:rules,storage
```

Always run `npm run test:rules` before deploying rules.

**DNS** — the zone is on Cloudflare. Records pointing at Vercel must be
**DNS-only (grey cloud)**; with the orange proxy on, Vercel cannot issue or
renew its TLS certificate. Cloudflare Email Routing must stay **disabled** or it
injects MX records that override Google Workspace.

## 5. Security posture

A rules audit was performed on 2026-08-05. Everything it found in Firestore and
Storage was fixed and is now covered by tests.

| Fixed | Was |
|---|---|
| Privilege escalation | Any user could write `role`/`isSuperUser` on their own user document and become an admin, then read every user's identity documents and payout data. `role` and `isSuperUser` are now immutable except by an admin. |
| Contract tampering | Either party could rewrite any contract field, including `amount`, after the other had signed. Updates are now restricted to signature, payment and payout markers, each party only its own side. |
| Impersonation | `events`, `services`, `tickets`, `bookings`, `venues`, `approvals` and `conversations` could be created attributed to another user. All now bind the owner at creation and freeze it. |
| Self-approval | A user could submit their own verification request pre-approved. Creation is forced to `pending`. |
| Review manipulation | Users could review themselves and submit arbitrary ratings. Now blocked, `rating` constrained to 1–5. |
| Storage defacement | Any authenticated user could overwrite any service's images. Service uploads are now scoped by uploader uid. |
| Hosted-payload risk | The artist portfolio path accepted any content type at 50 MB with public read, allowing HTML or executables to be served from a Google-trusted domain on this project's bill. Restricted to image/audio/mp4. |

**Verification.** 51 rule tests run against the Firebase emulators, one per
finding, each asserting the attack is rejected plus happy-path cases so a
tightened rule cannot silently break the app:

```bash
npm run test:rules
```

`AdminRoute` in the React app is a **convenience redirect, not a security
boundary**. Anything that must be enforced belongs in the rules — a client never
has to go through your UI to reach Firebase.

**HTTP headers** are set in [`next.config.mjs`](./next.config.mjs): CSP,
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, HSTS.

## 6. Known limitations — disclosed, not hidden

These are real and a buyer should price them in.

**Wallet balances are client-controlled (the significant one).** Deposits and
withdrawals are computed in the browser and written straight to
`wallets/{uid}`, so the owner of an account can set their own balance to any
value. This is tracked as **S1** in `ACTION_PLAN.md` and was consciously
deferred while the balance is play money and no payment processor is connected.
Fixing it means moving every wallet and transaction write into Cloud Functions
and making both collections read-only for clients. **This must be done before
the platform handles real money.** There is no `functions/` directory yet.

**Payments are not live.** The Skrill flow is a mock settlement recorded from
the client session. No processor is integrated, no funds move.

**One WCAG AA violation is outstanding.** An external accessibility audit
reported 4 violations, 1 of them level AA, but delivered no breakdown of which
criteria or elements. The detail must be requested from the auditor before it
can be fixed.

**The CSP still allows `unsafe-inline` and `unsafe-eval` in `script-src`.**
Required by the Next.js App Router runtime as configured. Tightening it means a
nonce-based CSP issued from middleware.

**Test coverage is thin outside the rules.** 40 unit tests and 51 rule tests; no
end-to-end suite.

**No Cloud Functions, no server-side validation.** Every write is a direct
client-to-Firebase call. The security rules are the only enforcement layer,
which is why §5 matters as much as it does.

## 7. Running costs

Firebase Spark (free) covers the current usage; Blaze (pay-as-you-go) becomes
necessary for Cloud Functions when S1 is addressed. Vercel Hobby covers the
current traffic; commercial use requires Pro. Domain renewal runs roughly
USD 40–70/year at Hostinger. Cloudflare Free is sufficient for the DNS zone.

## 8. Transfer checklist

- [ ] Buyer creates their own Firebase project, or is added as Owner and the seller's access is removed
- [ ] Firestore data exported and imported, if any production data is in scope
- [ ] `npm run deploy:rules` run against the destination project
- [ ] Environment variables set in the buyer's Vercel project
- [ ] Vercel project transferred or redeployed from the buyer's account
- [ ] Cloudflare zone moved; Vercel records verified as DNS-only; Email Routing off
- [ ] Registrar transfer initiated at Hostinger (auth code released)
- [ ] Google Workspace ownership transferred, or mailboxes migrated
- [ ] Repository transferred and seller's access revoked
- [ ] Personal data in scope reviewed: `users` (emails), `identity/` in Storage
      (identity documents), `payoutMethods`. Transferring these means
      transferring personal data — get consent or purge before handover
- [ ] Seller's admin accounts removed from `users` (`role: ADMIN` / `isSuperUser`)
