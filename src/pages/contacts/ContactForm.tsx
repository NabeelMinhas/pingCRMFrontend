import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface Contact {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  company_id: number | null;
}

interface Company {
  id: number;
  name: string;
}

export default function ContactForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<Contact>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    country: '',
    postal_code: '',
    company_id: null,
  });
  
  // Fetch contact data when in edit mode
  const { data: contactData, isLoading: isLoadingContact } = useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
      if (!isEditMode) return null;
      const response = await axios.get(`/api/contacts/${id}`);
      return response.data;
    },
    enabled: isEditMode,
  });
  
  // Fetch companies for dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await axios.get('/api/companies', { params: { limit: 100 } });
      return response.data.items || [];
    },
  });
  
  // Set form data when contact data is loaded
  useEffect(() => {
    if (contactData) {
      setFormData({
        first_name: contactData.first_name,
        last_name: contactData.last_name,
        email: contactData.email,
        phone: contactData.phone || '',
        address: contactData.address || '',
        city: contactData.city || '',
        region: contactData.region || '',
        country: contactData.country || '',
        postal_code: contactData.postal_code || '',
        company_id: contactData.company_id || null,
      });
    }
  }, [contactData]);
  
  // Handle create/update mutation
  const mutation = useMutation({
    mutationFn: async (data: Contact) => {
      if (isEditMode) {
        await axios.put(`/api/contacts/${id}`, data);
      } else {
        await axios.post('/api/contacts', data);
      }
    },
    onSuccess: () => {
      navigate('/contacts');
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'company_id' ? (value ? parseInt(value) : null) : value,
    }));
  };
  
  if (isEditMode && isLoadingContact) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900">
            {isEditMode ? 'Edit Contact' : 'Create Contact'}
          </h2>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="first_name"
                id="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="last_name"
                id="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <div className="mt-1">
              <select
                name="company_id"
                id="company_id"
                value={formData.company_id || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">No Company</option>
                {companies.map((company: Company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Street address
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              State / Province
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="region"
                id="region"
                value={formData.region}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
              ZIP / Postal code
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="postal_code"
                id="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/contacts')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
} 