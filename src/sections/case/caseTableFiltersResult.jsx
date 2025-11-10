import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { fDateRangeShortLabel } from 'src/utils/format-time';
import { useCodes } from 'src/hooks/useCodes';
// ----------------------------------------------------------------------

export function CaseTableFiltersResult({ filters, onResetPage, totalResults, sx }) {
  const { codes: smallClassCodes } = useCodes('SMALL_CLASS'); // ✅ 추가
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);
  
  console.log("@@@@@@@@@@ :: " + JSON.stringify(currentFilters, null, 2));
  
  const handleRemoveSmallClass = useCallback(
    (inputValue) => {
      const newValue = currentFilters.smallClass.filter((item) => item !== inputValue);

      onResetPage();
      updateFilters({ smallClass: newValue });
    },
    [onResetPage, updateFilters, currentFilters.smallClass]
  );

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    updateFilters({ startDate: null, endDate: null });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="소분류:" isShow={!!currentFilters.smallClass.length}>
        {currentFilters.smallClass.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={smallClassCodes.find((c) => c.code === item)?.code_nm ?? item}
            onDelete={() => handleRemoveSmallClass(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Date:"
        isShow={Boolean(currentFilters.startDate && currentFilters.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(currentFilters.startDate, currentFilters.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
