import Joi from 'joi';
import { IssuerProfileFormContextType } from './IssuerProfileFormContextType';

export const IssuerProfileFormSchema =
  Joi.object<IssuerProfileFormContextType>().keys({
    domain: Joi.string()
      .domain({ tlds: false })
      .label('Web domain')
      .optional()
      .allow(''),
    description: Joi.string()
      .label('Description')
      .max(500)
      .optional()
      .allow(''),
    email: Joi.string()
      .email({ tlds: false })
      .label('E-mail')
      .optional()
      .allow(''),
    companyName: Joi.string()
      .label('Company name')
      .max(100)
      .optional()
      .allow(''),
  });
