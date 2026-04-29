export enum CredentialTemplateType {
  Member = 'MEMBER',
  Student = 'STUDENT',
  ExternalKeypair = 'EXTERNAL_KEYPAIR',
  CertSigned = 'CERT_SIGNED',
}

export const KEYPAIR_REQUIRED_TEMPLATE_TYPES: CredentialTemplateType[] = [
  CredentialTemplateType.ExternalKeypair,
];
