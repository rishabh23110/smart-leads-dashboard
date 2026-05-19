import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export const LeadForm = ({ defaultValues, onSubmit, onCancel, isLoading, mode }: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name ?? '',
        email: defaultValues.email ?? '',
        status: defaultValues.status ?? 'New',
        source: defaultValues.source ?? 'Website',
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        {...register('name')}
        label="Full Name"
        placeholder="Jane Smith"
        error={errors.name?.message}
      />
      <Input
        {...register('email')}
        label="Email Address"
        type="email"
        placeholder="jane@company.com"
        error={errors.email?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          {...register('status')}
          label="Status"
          options={[
            { value: 'New', label: 'New' },
            { value: 'Contacted', label: 'Contacted' },
            { value: 'Qualified', label: 'Qualified' },
            { value: 'Lost', label: 'Lost' },
          ]}
          error={errors.status?.message}
        />
        <Select
          {...register('source')}
          label="Source"
          options={[
            { value: 'Website', label: 'Website' },
            { value: 'Instagram', label: 'Instagram' },
            { value: 'Referral', label: 'Referral' },
          ]}
          error={errors.source?.message}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Add Lead' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
