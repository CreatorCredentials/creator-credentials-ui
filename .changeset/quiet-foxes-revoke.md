---
'creator-credentials-ui': minor
---

- Replaced issued-credential deletion with revocation: reason field, awaited mutation with success and error toasts, inline banner on a failed list refetch
- Added search, sorting, Issued/Revoked status filter and a table view to the issued credentials page; creator identity is read from the credentials payload
- Added the Verified Creator credential type and a Revoked tab on the creator credentials page
- Moved ConfirmationModal labels to the common namespace and added missing translation keys
