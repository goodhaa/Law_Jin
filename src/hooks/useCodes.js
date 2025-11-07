import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from 'src/lib/supabase/client';

export const useCodes = (codeGroup) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseBrowser();
        const { data, error } = await supabase
          .from('CODE_INFO')
          .select('*')
          .eq('code_group', codeGroup)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error(`Failed to fetch ${codeGroup} codes`, error);
          setCodes([]);
        } else {
          setCodes(data);
        }
      } catch (err) {
        console.error(err);
        setCodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [codeGroup]);

  return { codes, loading };
};