import { CredentialTemplateType } from '@/shared/typings/CredentialTemplateType';
import { VerifiedCredentialsTemplate } from '@/shared/typings/Templates';

export const MEMBER_TEMPLATE_NAME = 'Member Credential';

/** Templates a creator may request on `/v1/templates/creator`. */
export const CREATOR_TEMPLATES: VerifiedCredentialsTemplate[] = [
  {
    id: 't-member',
    templateType: CredentialTemplateType.Member,
    name: MEMBER_TEMPLATE_NAME,
  },
];
