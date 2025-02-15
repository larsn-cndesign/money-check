/** Defines all months of the year includning the option to combine all months */
export const MONTHS = [
  { id: -1, name: 'All months' },
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' },
];

/** Defines the localStorage budget state item */
export const LS_BUDGET_STATE = 'budgetState';

/** Defines the localStorage filter item */
export const LS_FILTER = 'filter';

/** Defines the localStorage token item */
// export const LS_ACCESS_TOKEN = 'access_token'; // Uncomment if using a real backend.
export const LS_ACCESS_TOKEN = 'test_token'; // @Test - Only for testing
