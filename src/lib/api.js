// Thin fetch wrapper around our own backend (server/). No third-party SDK.
async function request(path, { method = 'GET', body, form } = {}) {
  const opts = { method, credentials: 'same-origin', headers: {} };
  if (form) {
    opts.body = form;
  } else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`/api${path}`, opts);
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const entity = (route) => ({
  list: (sort = '-created_date', limit = 100) =>
    request(`/${route}?sort=${encodeURIComponent(sort)}&limit=${limit}`),
  create: (data) => request(`/${route}`, { method: 'POST', body: data }),
  update: (id, data) => request(`/${route}/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/${route}/${id}`, { method: 'DELETE' }),
});

export const api = {
  entities: {
    Project: entity('projects'),
    Testimonial: entity('testimonials'),
    SiteSetting: entity('settings'),
    Booking: entity('bookings'),
    Message: entity('messages'),
  },
  bookings: {
    taken: () => request('/bookings/taken'),
  },
  contact: {
    send: (data) => request('/messages', { method: 'POST', body: data }),
  },
  auth: {
    me: () => request('/auth/me'),
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
  integrations: {
    Core: {
      UploadPublicFile: ({ file }) => {
        const form = new FormData();
        form.append('file', file);
        return request('/upload', { method: 'POST', form });
      },
    },
  },
};
