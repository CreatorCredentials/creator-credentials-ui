/**
 * Workaround config: issuers listed here are treated as "data supplier" issuers
 * in the UI — their sidebar label, connection-request headers, and creator badges
 * are replaced with "Data Supplier" equivalents.
 *
 * To add a new issuer, append its exact companyName to the list below.
 */
export const DATA_SUPPLIER_ISSUER_NAMES: string[] = [
  'Open Future Foundation',
  'YK TEST Issuer 80',
];
