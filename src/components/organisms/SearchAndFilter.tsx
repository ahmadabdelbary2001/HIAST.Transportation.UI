import { useTranslation } from 'react-i18next';
import { X, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterProps {
  searchPlaceholder: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterPlaceholder?: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions?: FilterOption[];
  onClearFilters: () => void;
  hasFilters: boolean;
  showFilter?: boolean;
  title?: string;
}

export function SearchAndFilter({
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  filterPlaceholder,
  filterValue,
  onFilterChange,
  filterOptions = [],
  onClearFilters,
  hasFilters,
  showFilter = false,
  title,
}: SearchAndFilterProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  return (
    <Card>
      <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0 max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          {showFilter && (
            <Select value={filterValue} onValueChange={onFilterChange}>
              <SelectTrigger className={`relative w-[200px] h-9 ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} bg-background border border-input rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2`}>
                <div className={`absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 flex items-center justify-center`}>
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </div>
                <SelectValue placeholder={filterPlaceholder} className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className={isRTL ? 'text-right' : 'text-left'}>All</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={isRTL ? 'text-right' : 'text-left'}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <X className="h-4 w-4" />
              <span>{t('common.clearFilters')}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
