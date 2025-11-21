// src/lib/constants.ts

export const LOCAL_STORAGE_KEYS = {
  THEME: '2af_work_theme',
  DARK_MODE: '2af_work_dark_mode',
  LANGUAGE: '2af_work_language',
  SIDEBAR_COLLAPSED: '2af_work_sidebar_collapsed',
  EMPLOYEES: '2af_work__employees',
  DRIVERS: '2af_work_drivers',
} as const;

export const ROUTES = {
  DASHBOARD: '/',
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',
  EMPLOYEE_CREATE: '/employees/create',
  EMPLOYEE_EDIT: '/employees/:id/edit',
  DRIVERS: '/drivers',
  DRIVER_DETAIL: '/drivers/:id',
  DRIVER_CREATE: '/drivers/create',
  DRIVER_EDIT: '/drivers/:id/edit',
  BUSES: '/buses',
  LINES: '/lines',
  STOPS: '/stops',
  SUBSCRIPTIONS: '/subscriptions',
  SUPERVISORS: '/supervisors',
};