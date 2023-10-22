import { CustomFlowbiteTheme } from 'flowbite-react';

export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      secondary: 'bg-secondary hover:bg-secondary-hover text-white',
      primary:
        'text-white bg-primary border border-primary hover:bg-primary-hover focus:ring-4 focus:ring-primary-hover disabled:bg-grey-3 disabled:border-grey-3',
      outline:
        'text-primary bg-white border border-primary hover:border-primary-hover hover:text-primary-hover focus:ring-4 focus:ring-primary-hover disabled:text-grey-3 disabled:border-grey-3 disabled:bg-white',
    },
    size: {
      md: 'text-md px-4 py-2 font-normal',
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
      color: {
        default:
          'focus:ring-primary dark:ring-offset-primary dark:focus:ring-primary text-primary disabled:text-grey-3 hover:text-primary-hover',
      },
    },
  },
  card: {
    root: {
      base: 'flex rounded-lg shadow border border-neutral-100 bg-white dark:border-gray-700 dark:bg-gray-800',
    },
  },
};
