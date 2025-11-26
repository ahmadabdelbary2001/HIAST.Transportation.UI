// src/lib/constants.ts

export const LOCAL_STORAGE_KEYS = {
  THEME: '2af_work_theme',
  DARK_MODE: '2af_work_dark_mode',
  LANGUAGE: '2af_work_language',
  SIDEBAR_COLLAPSED: '2af_work_sidebar_collapsed',
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
  BUS_DETAIL: '/buses/:id',
  BUS_CREATE: '/buses/create',
  BUS_EDIT: '/buses/:id/edit',
  LINES: '/lines',
  LINE_DETAIL: '/lines/:id',
  LINE_CREATE: '/lines/create',
  LINE_EDIT: '/lines/:id/edit',
  STOPS: '/stops',
  STOP_CREATE: '/stops/create',
  STOP_EDIT: '/stops/:id/edit',
  SUBSCRIPTIONS: '/subscriptions',
  SUBSCRIPTION_CREATE: '/subscriptions/create',
  SUBSCRIPTION_EDIT: '/subscriptions/:id/edit',
  SUPERVISORS: '/supervisors',
};

export const APP_CONFIG = {
  name: 'HIAST Transportation',
  fullName: 'Higher Institute Transportation Management System',
  version: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
  defaultTheme: 'syrian',
  dateFormat: 'yyyy-MM-dd',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'yyyy-MM-dd HH:mm',
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
};

export const API_ENDPOINTS = {
  EMPLOYEES: '/api/employees',
  DRIVERS: '/api/drivers',
  BUSES: '/api/buses',
  LINES: '/api/lines',
  STOPS: '/api/stops',
  SUBSCRIPTIONS: '/api/subscriptions',
  SUPERVISORS: '/api/supervisors',
  DASHBOARD: '/api/dashboard/stats',
};