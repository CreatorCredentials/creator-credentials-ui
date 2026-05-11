export enum CredentialTemplateType {
  Member = 'MEMBER',
  Student = 'STUDENT',
  ExternalKeypair = 'EXTERNAL_KEYPAIR',
}

export const KEYPAIR_REQUIRED_TEMPLATE_TYPES: CredentialTemplateType[] = [
  CredentialTemplateType.ExternalKeypair,
];

/**
 * Maps each template type to the credential type string that the backend
 * will create when this template is requested. Used to filter issuers by
 * what credential types they have configured in credentialsToIssue.
 */
export const TEMPLATE_TYPE_TO_CREDENTIAL_TYPE: Partial<
  Record<CredentialTemplateType, string>
> = {
  [CredentialTemplateType.Member]: 'MEMBER',
  [CredentialTemplateType.Student]: 'STUDENT',
  [CredentialTemplateType.ExternalKeypair]: 'DATASUPPLIER',
};
