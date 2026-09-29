import { api } from '@/lib/api';

import { useEffect, useState } from 'react';

import { DEFAULT_SETTINGS, mergedSettings } from '@/lib/siteDefaults';

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await api.entities.SiteSetting.list('-updated_date', 1);
        if (mounted) setSettings(list[0] ? mergedSettings(list[0]) : DEFAULT_SETTINGS);
      } catch {
        if (mounted) setSettings(DEFAULT_SETTINGS);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  return { settings, loading };
}