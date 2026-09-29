// Single source of truth for the data model. Tables, validation and the
// generic CRUD routes are all generated from this.
const t = 'text';
const n = 'number';

export const ENTITIES = {
  projects: {
    table: 'projects',
    fields: { title: t, description: t, image_url: t, category: t, link: t, order_index: n },
    required: ['title'],
    access: { list: 'public', create: 'admin', update: 'admin', delete: 'admin' },
  },
  testimonials: {
    table: 'testimonials',
    fields: { client_name: t, role: t, quote: t, rating: n, order_index: n },
    required: ['client_name', 'quote'],
    defaults: { rating: 5 },
    access: { list: 'public', create: 'admin', update: 'admin', delete: 'admin' },
  },
  settings: {
    table: 'site_settings',
    fields: {
      hero_name: t, hero_subtext: t, cover_image_url: t, about_text_1: t, about_text_2: t,
      resume_url: t, email: t, phone: t, whatsapp: t, location: t,
      hourly_price: t, hourly_features: t, project_price: t, project_features: t,
      fulltime_price: t, fulltime_features: t,
    },
    required: [],
    access: { list: 'public', create: 'admin', update: 'admin', delete: 'admin' },
  },
  bookings: {
    table: 'bookings',
    fields: { client_name: t, client_email: t, service: t, date: t, time: t, message: t, status: t },
    required: ['client_name', 'client_email', 'date', 'time'],
    defaults: { status: 'pending' },
    access: { list: 'admin', create: 'public', update: 'admin', delete: 'admin' },
  },
  messages: {
    table: 'messages',
    fields: { name: t, email: t, mode: t, service: t, message: t },
    required: ['name', 'email', 'message'],
    access: { list: 'admin', create: 'public', update: 'admin', delete: 'admin' },
  },
};

export const MAX_TEXT = 5000;
