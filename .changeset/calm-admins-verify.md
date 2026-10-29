---
'creator-credentials-ui': minor
---

- Added the `ADMIN` role with its own area under `/admin`: all credentials across issuers with status, type, issuer and search filters, server-side pagination, a details dialog, JSON download and revocation with a reason; a users page with counts and links to their credentials; and a credential verification page that calls the public verify endpoint and shows the signature, validity and revocation checks.
- `/admin/*` is protected by the proxy, other roles get a 404 there and admins are redirected away from the issuer and creator pages.
