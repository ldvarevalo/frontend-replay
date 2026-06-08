import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Typography } from '#/components/ui/typography';
import type { ManualEntryData } from '#/types/domain';
import { ArtworkPreview } from './artwork-preview';

/**
 * Types
 */

interface ManualEntryFormField {
  key: keyof ManualEntryData;
  label: string;
  placeholder: string;
  width: 'full' | 'half';
}

interface ManualEntryFormProps {
  values: ManualEntryData;
  onFieldChange: (field: keyof ManualEntryData, value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  isPending?: boolean;
}

/**
 * Constants
 */

const FULL_FIELDS: ManualEntryFormField[] = [
  {
    key: 'title',
    label: 'RELEASE TITLE',
    placeholder: 'e.g. A Love Supreme',
    width: 'full',
  },
  {
    key: 'artist',
    label: 'ARTIST',
    placeholder: 'e.g. John Coltrane',
    width: 'full',
  },
];

const HALF_FIELDS: ManualEntryFormField[] = [
  {
    key: 'year',
    label: 'RELEASE YEAR',
    placeholder: '1965',
    width: 'half',
  },
  {
    key: 'genre',
    label: 'GENRE',
    placeholder: 'Jazz',
    width: 'half',
  },
];

/**
 * ManualEntryForm
 */

export const ManualEntryForm: FunctionComponent<ManualEntryFormProps> = ({
  values,
  onFieldChange,
  onSubmit,
  isValid,
  isPending = false,
}) => (
  <div className="space-y-4">
    {FULL_FIELDS.map(({ key, label, placeholder }) => (
      <div key={key}>
        <Typography
          size="xs"
          weight="black"
          tracking="widest"
          transform="uppercase"
          className="mb-2 text-primary"
        >
          {label}
        </Typography>
        <Input
          value={values[key]}
          onChange={e => onFieldChange(key, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    ))}

    <div className="flex gap-4">
      {HALF_FIELDS.map(({ key, label, placeholder }) => (
        <div key={key} className="flex-1">
          <Typography
            size="xs"
            weight="black"
            tracking="widest"
            transform="uppercase"
            className="mb-2 text-primary"
          >
            {label}
          </Typography>
          <Input
            value={values[key]}
            onChange={e => onFieldChange(key, e.target.value)}
            placeholder={placeholder}
          />
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-4">
      <Typography
        size="xs"
        weight="black"
        tracking="widest"
        transform="uppercase"
        className="mb-2 text-primary"
      >
        ARTWORK URL
      </Typography>
      <div className="flex flex-1 flex-col gap-4">
        <Input
          value={values.artworkUrl}
          onChange={e => onFieldChange('artworkUrl', e.target.value)}
          placeholder="https://..."
        />
        <div className="w-full shrink-0">
          <ArtworkPreview imageUrl={values.artworkUrl} />
        </div>
      </div>
    </div>

    <Button variant="primary" size="lg" onClick={onSubmit} disabled={!isValid || isPending}>
      {isPending ? 'SAVING…' : 'SAVE'}
    </Button>
  </div>
);
