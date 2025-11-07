import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from 'src/lib/supabase/client';

export const useUsers = (codeCompany) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseBrowser();
        const { data, error } = await supabase
          .from('USER_BASE')
          .select('*')
          .eq('COMPANY_CD', codeCompany)
          .eq('WK_STAT_CD', 'W') // W: 근무중인 경우
          //.order('sort_order', { ascending: true });

        if (error) {
          console.error(`Failed to fetch ${codeCompany} codes`, error);
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
  }, [codeCompany]);

  return { codes, loading };
};