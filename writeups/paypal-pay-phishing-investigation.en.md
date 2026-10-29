## Summary

Investigation of a phishing kit impersonating PayPal (`paypal-pay.com`) and targeting German-speaking users. The kit runs in three stages (credentials → 2FA code → fake payment confirmation) and exfiltrates stolen data in real time through a Discord webhook. The analysis also shows that the domain, re-registered in early September 2026, has in fact existed since at least 2011: unused and then abandoned for years, it was taken over and weaponised in under 48 hours.

> **Disclaimer**: this investigation relies solely on open sources (OpenPhish, urlscan.io, crt.sh, Wayback Machine, WHOIS) and on passive reading of the pages' source code. No form was submitted and there was no active interaction with the infrastructure. The exfiltration webhook token is deliberately redacted.

## Investigation question

A domain reported in a public phishing feed, `paypal-pay.com`, impersonates the PayPal brand. The investigation aims to answer three questions:

1. How does the setup work and what data does it steal?
2. Where does the domain come from and how long has it been active?
3. Can it be linked to a campaign or an actor?

## Key findings

| # | Finding | Confidence |
|---|---|---|
| 1 | `paypal-pay.com` is an active phishing site targeting German-speaking PayPal users | **High** |
| 2 | The kit steals, in three stages, the login, password, a 2FA code and a device fingerprint, and sends everything in real time to a single Discord webhook | **High** |
| 3 | The domain has existed since at least 2011, stayed unused and then abandoned, was re-registered on 9 September 2026, and the kit was online two days later | **High** |
| 4 | The speed of deployment and an inconsistency in the code point to a reused off-the-shelf kit rather than custom development | **Medium** |
| 5 | No actor or campaign is attributed at this stage; a potential kit signature remains an open lead | **Not attributed** |

## Method

The approach follows an observation → hypothesis → verification → conclusion chain, with a confidence level assigned to each conclusion.

| Step | Source / tool | Purpose |
|---|---|---|
| Indicator selection | OpenPhish | Start from a recent public report |
| Page analysis | urlscan.io, source code | Understand the scenario and the data collected |
| Infrastructure | WHOIS, urlscan.io | Registrar, hosting, ASN, registration date |
| TLS history | crt.sh | Date the domain's existence through its certificates |
| Content history | Wayback Machine | Reconstruct the domain's past use |
| Linking | urlscan.io, GitHub | Look for other deployments of the same kit |

**Documented dead end**: a first candidate, `checkouts-paypal.lat`, was discarded. The domain no longer resolved (NXDOMAIN) and left no usable historical data. The investigation moved to `paypal-pay.com`.

## How the kit works

`signin.html` (credentials + fingerprint) → `verification.html` (fake 2FA code) → `completed.html` (fake confirmation, then redirect to paypal.com)

### Stage 1 — Credential theft (`signin.html`)

The page reproduces the PayPal login by loading the brand's genuine visual assets from `paypalobjects.com`, which boosts credibility without having to host them. The form collects the email or phone number, the password and a device fingerprint: browser, language, platform, screen resolution, time zone and local IP address obtained through WebRTC.

```js
function gatherDeviceInfo() {
    const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...
    };
    // + local IP leak via WebRTC ICE candidate
}
```

All collected data is sent by POST to a **Discord webhook**:

```js
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1547269048566292661/[REDACTED]";
```

### Stage 2 — 2FA code theft (`verification.html`)

The victim is redirected to a page asking for a six-digit code. Three events are sent to the **same Discord webhook**: page load, a click on "resend code" and code submission. The attacker therefore follows the victim's progress live.

The same webhook being used in stages 1 and 2 establishes that this is a single deployment, not two separate campaigns.

### Stage 3 — Closing the scenario (`completed.html`)

A fake payment confirmation is displayed (a fictitious €5.00 transfer to a payee named "Lena Lauerbach"), with a transaction ID generated client-side and a success sound. After ten seconds, the victim is sent to the real `paypal.com`, which delays the realisation that they have been robbed.

The message sent to Discord when clicking "Back to PayPal" shows a different amount from the one displayed on screen. This inconsistency betrays a reused, poorly adapted template rather than development tailored to this target.

## Infrastructure

| Item | Value |
|---|---|
| Domain | `paypal-pay.com` |
| IP | `216.198.79.65` |
| ASN | AS16509 — AMAZON-02 (Amazon.com, Inc.) |
| Registrar | Name.com, Inc. |
| WHOIS (re-)registration | 2026-09-09 |
| Current TLS certificate | Issued 2026-09-09, valid for 3 months |
| urlscan.io verdict | *Potentially Malicious* — targeted brand: PayPal (Financial) |

Hosting relies on shared cloud infrastructure (AWS). Pivoting on the IP address would therefore add little value: the address is most likely not dedicated to the actor.

## Domain timeline

The sources initially contradicted each other: WHOIS shows a creation in September 2026, while crt.sh lists certificates as early as 2017. Cross-checking with the Wayback Machine reconstructs the actual timeline:

| Date | Event |
|---|---|
| 2011 | First Wayback capture: a simple test page ("hello"), no real use |
| 2017 | First TLS certificates listed on crt.sh |
| ~2024–2025 | HTTP 521 error (Cloudflare): proxied domain whose origin server no longer responds, a sign of abandonment |
| 2026-09-09 | Re-registration by a new owner and new certificate |
| 2026-09-11 | The phishing kit is online, two days after the domain was taken over |

**Reading**: the actor took over an old domain with a suggestive name and no malicious history, then weaponised it in under 48 hours. An old domain can enjoy a better reputation with some filters than a newly created one.

## Linking to a campaign

The name "Lena Lauerbach", hard-coded in the confirmation page, is most likely fictitious and is a potential signature of the kit. It is not treated as a lead to a real person. Together with the webhook ID and some distinctive strings in the code, it makes it possible to search for other deployments of the same template. This lead has not yet been cross-checked and remains open.

## Findings and confidence levels

| Status | Finding | Basis |
|---|---|---|
| **Established** | The site collects credentials, 2FA codes and device fingerprints and exfiltrates them to Discord | Direct reading of the source code; urlscan.io and Google Safe Browsing verdicts |
| **Established** | The three pages form a single deployment | Same webhook in stages 1 and 2, chained redirects |
| **Established** | Old, abandoned domain, re-registered on 2026-09-09 and weaponised within 48 h | Cross-check of WHOIS, crt.sh and Wayback Machine |
| **Likely** | Reused off-the-shelf kit rather than custom development | Amount inconsistency; speed of deployment |
| **Likely** | German-speaking target | Language of the kit's pages |
| **Unverified** | Link to other deployments or an identified actor | Kit signature not yet cross-checked |

## Risks and recommendations

**Risks**

- **For victims**: real-time notification lets the attacker use the 2FA code while it is still valid and take over the account, which gives access to payment methods.
- **For the brand**: the use of its genuine visual assets and the final redirect to the official site make the fraud hard to spot. Customer trust is damaged even though the service itself is not compromised.
- **More broadly**: reusing expired domains with suggestive names bypasses part of the filters based on domain age.

**Recommendations**

- Report the domain to the registrar (Name.com), the hosting provider (AWS) and the brand's anti-fraud team to have it taken down.
- Report the webhook to Discord to cut off the exfiltration channel.
- Add the domain, URLs and IP to blocklists, bearing in mind that the IP address is shared.
- For a brand: monitor domains containing its name, including expired domains put back on sale, not only new registrations.

## Limitations

- The analysis stops at client-side code: how the Discord channel operates and how the data is used cannot be observed.
- The domain's new owner cannot be identified through public WHOIS.
- The number of victims is unknown.
- As the site is likely to be taken down, some observations can no longer be reproduced live; they rely on the scans and archives cited.

## IOCs

| Type | Value | Context |
|---|---|---|
| Domain | `paypal-pay.com` | Main kit domain |
| URL | `paypal-pay.com/signin.html` | Stage 1 — credential theft |
| URL | `paypal-pay.com/verification.html` | Stage 2 — 2FA code theft |
| URL | `paypal-pay.com/completed.html` | Stage 3 — scenario closing |
| IP | `216.198.79.65` | Shared AWS hosting |
| Webhook ID | `1547269048566292661` | Discord exfiltration channel (token not published) |

## Sources

| Source | Use |
|---|---|
| OpenPhish | Initial URL report |
| urlscan.io | Page scans, loaded resources, verdict, infrastructure |
| WHOIS (Name.com) | Registrar and re-registration date |
| crt.sh | TLS certificate history |
| Wayback Machine | Domain content history |
| Google Safe Browsing | Confirmation of malicious status |

## Conclusion

`paypal-pay.com` is a three-stage PayPal phishing kit that exfiltrates credentials, 2FA codes and device fingerprints to Discord in real time. Its old, abandoned domain was taken over and weaponised in under 48 hours, which, together with the inconsistency found in the code, points to a reused off-the-shelf kit.

**Confidence level**: high on the nature and workings of the setup and on the domain timeline; no actor or campaign attribution at this stage, as the potential kit signature has yet to be cross-checked.
