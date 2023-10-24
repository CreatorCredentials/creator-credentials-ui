import { CustomFlowbiteTheme } from 'flowbite-react';

export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      secondary:
        'text-white bg-secondary border border-secondary hover:bg-secondary-hover focus:ring-4 focus:ring-secondary-hover disabled:bg-grey-3 disabled:border-grey-3',
      primary:
        'text-white bg-primary border border-primary hover:bg-primary-hover focus:ring-4 focus:ring-primary-hover disabled:bg-grey-3 disabled:border-grey-3',
      outline:
        'text-primary bg-white border border-primary hover:border-primary-hover hover:text-primary-hover focus:ring-4 focus:ring-primary-hover disabled:text-grey-3 disabled:border-grey-3 disabled:bg-white',
      'outline-secondary':
        'text-secondary bg-white border border-secondary hover:border-secondary-hover hover:text-secondary-hover focus:ring-4 focus:ring-secondary-hover disabled:text-grey-3 disabled:border-grey-3 disabled:bg-white',
    },
    size: {
      md: 'text-sm px-3 py-1.5 font-normal',
    },
    disabled: 'cursor-not-allowed bg-grey-3 hover:bg-grey-3 border-grey-3',
  },
  textInput: {
    field: {
      input: {
        base: 'block w-full border border-grey-2 disabled:cursor-not-allowed disabled:opacity-50',
        sizes: {
          md: 'py-2 text-sm px-4',
        },
      },
    },
  },
  label: {
    root: {
      base: 'text-sm',
    },
  },
  checkbox: {
    root: {
      base: 'h-4 w-4 rounded focus:ring-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 bg-white',
      color: {
        default:
          'focus:ring-primary dark:ring-offset-primary dark:focus:ring-primary text-primary disabled:text-grey-3 hover:text-primary-hover',
        primary:
          'focus:ring-primary dark:ring-offset-primary dark:focus:ring-primary text-primary disabled:text-grey-3 hover:text-primary-hover',
        secondary:
          'focus:ring-secondary dark:ring-offset-secondary dark:focus:ring-secondary text-secondary disabled:text-grey-3 hover:text-secondary-hover',
      },
    },
  },
  card: {
    root: {
      base: 'flex rounded-lg shadow border border-neutral-100 bg-white dark:border-gray-700 dark:bg-gray-800',
    },
  },
};
