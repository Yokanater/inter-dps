'use client';

import { Globe } from 'lucide-react';
import { useAppStore, type Country } from '@/lib/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Country selection options with flags
 */
const countries: { value: Country; label: string; flag: string }[] = [
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'EU', label: 'European Union', flag: '🇪🇺' },
  { value: 'IN', label: 'India', flag: '🇮🇳' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺' },
];

/**
 * Country selector component for region-specific information
 */
export function CountrySelector() {
  const { selectedCountry, setCountry } = useAppStore();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedCountry} onValueChange={(value) => setCountry(value as Country)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
