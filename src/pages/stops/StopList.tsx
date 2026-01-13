import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Edit, Trash2, MapPin, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { useListPage } from '@/hooks/useListPage';
import { stopApiService } from '@/services/stopApiService';
import type { StopListDto } from '@/types';
import { StopType } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { type ColumnDefinition } from '@/components/organisms/DataTable';

export default function StopList() {
  const { t } = useTranslation();

  const {
    filteredItems: filteredStops,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterValue: typeFilter,
    setFilterValue: setTypeFilter,
    deleteId,
    setDeleteId,
    loadItems,
    handleDelete,
    clearFilters,
    hasFilters,
  } = useListPage<StopListDto>({
    searchFields: ['address', 'lineName', 'sequenceOrder'],
    filterField: 'stopType',
    entityName: 'stop',
    getAll: stopApiService.getAll,
    deleteItem: stopApiService.delete,
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // معالجة البيانات للعرض - تحويل stopType إلى تنسيق متسق للمقارنة
  const processedStops = useMemo(() => {
    return filteredStops.map(stop => {
      let stopTypeValue: number;
      
      // تحويل قيمة stopType إلى عدد بغض النظر عن نوعها
      if (typeof stop.stopType === 'string') {
        // إذا كانت القيمة نصية، حولها إلى رقم بناءً على المحتوى
        const stopTypeString = String(stop.stopType);
        if (stopTypeString.toLowerCase().includes('terminus') || stopTypeString === '1') {
          stopTypeValue = StopType.Terminus;
        } else {
          stopTypeValue = StopType.Intermediate;
        }
      } else {
        // إذا كانت القيمة بالفعل رقم
        stopTypeValue = Number(stop.stopType);
      }
      
      return {
        ...stop,
        stopType: stopTypeValue,
      };
    });
  }, [filteredStops]); // تم تصحيح dependency إلى filteredStops

  // فلترة إضافية لمعالجة مشكلة matchCase في useListPage
  const finalStops = useMemo(() => {
    if (!typeFilter) return processedStops;
    
    const filterNum = parseInt(typeFilter, 10);
    if (isNaN(filterNum)) return processedStops;
    
    return processedStops.filter(stop => stop.stopType === filterNum);
  }, [processedStops, typeFilter]);

  const typeFilterOptions = [
    { value: StopType.Intermediate.toString(), label: t('stop.types.intermediate') },
    { value: StopType.Terminus.toString(), label: t('stop.types.terminus') },
  ];

  const columns: ColumnDefinition<(typeof finalStops)[0]>[] = [
    {
      key: 'address',
      header: t('stop.address'),
      cell: (stop) => (
        <div className="flex items-center gap-2">
          {stop.stopType === StopType.Terminus ? (
            <Terminal className="h-4 w-4 text-green-600" />
          ) : (
            <MapPin className="h-4 w-4 text-blue-600" />
          )}
          <span>{stop.address}</span>
        </div>
      ),
    },
    { 
      key: 'lineName', 
      header: t('stop.lineName'),
      cell: (stop) => (
        <span className="font-medium">{stop.lineName}</span>
      )
    },
    { 
      key: 'sequenceOrder', 
      header: t('stop.sequence'),
      cell: (stop) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
          {stop.sequenceOrder}
        </div>
      )
    },
    {
      key: 'stopType',
      header: t('stop.type'),
      cell: (stop) => {
        const isTerminus = stop.stopType === StopType.Terminus;
        
        return (
          <div className={`
            inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
            transition-all duration-200
            ${isTerminus 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-blue-100 text-blue-800 border border-blue-200'
            }
            hover:scale-105
          `}>
            {isTerminus ? (
              <>
                <Terminal className="h-3 w-3" />
                {t('stop.types.terminus')}
              </>
            ) : (
              <>
                <MapPin className="h-3 w-3" />
                {t('stop.types.intermediate')}
              </>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (stop) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
          >
            <Link to={`/stops/${stop.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDeleteId(stop.id)}
            className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text={t('common.messages.loadingData')} />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ListLayout
      title={t('stop.list')}
      createRoute={ROUTES.STOP_CREATE}
      searchPlaceholder={t('stop.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('stop.noStops')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.messages.confirmDeleteTitle')}
      deleteDescription={t('common.messages.confirmDeleteItem', { item: t('stop.singular') })}
      items={[]}
      filteredItems={finalStops}
      loading={loading}
      error={error}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue={typeFilter}
      onFilterChange={(value) => {
        setTypeFilter(value?.toString() || '');
      }}
      filterOptions={typeFilterOptions}
      onClearFilters={clearFilters}
      hasFilters={hasFilters}
      showFilter={true}
      filterPlaceholder={t('stop.filterByType')}
      deleteId={deleteId}
      onDeleteClose={() => setDeleteId(null)}
      onDeleteConfirm={() => deleteId && handleDelete(deleteId)}
      countLabel={t('stop.stops')}
    />
  );
}