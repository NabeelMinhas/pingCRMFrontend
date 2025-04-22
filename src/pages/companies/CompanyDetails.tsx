import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Company, Contact } from '../../types';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  
  // Fetch company data
  const { isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await axios.get(`/api/companies/${id}`);
      setCompany(response.data);
      return response.data;
    },
  });
  
  // Fetch contacts for this company
  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ['companyContacts', id],
    queryFn: async () => {
      const response = await axios.get('/api/contacts', {
        params: { company_id: id, limit: 100 }
      });
      return response.data.items;
    },
    enabled: !!id,
  });

  // Handle company update
  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      return axios.put(`/api/companies/${id}`, updatedCompany);
    },
    onSuccess: () => {
      alert('Company updated successfully');
    },
  });
  
  // Handle soft delete
  const softDeleteMutation = useMutation({
    mutationFn: async () => {
      return axios.patch(`/api/companies/${id}/soft-delete`);
    },
    onSuccess: () => {
      navigate('/companies');
    },
    onError: (error) => {
      console.error('Error soft deleting company:', error);
      alert('Failed to delete organization. Please try again.');
    }
  });
  
  // Handle restore
  const restoreMutation = useMutation({
    mutationFn: async () => {
      return axios.patch(`/api/companies/${id}/restore`);
    },
    onSuccess: (data) => {
      setCompany(data.data);
    },
    onError: (error) => {
      console.error('Error restoring company:', error);
      alert('Failed to restore organization. Please try again.');
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (company) {
      setCompany({ ...company, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      updateMutation.mutate(company);
    }
  };

  const handleSoftDelete = async () => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await softDeleteMutation.mutateAsync();
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete organization');
      }
    }
  };
  
  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync();
    } catch (error) {
      console.error('Error restoring company:', error);
      alert('Failed to restore organization');
    }
  };

  const handlePermanentDelete = async () => {
    if (window.confirm('Are you sure you want to PERMANENTLY delete this organization? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/companies/${id}`);
        navigate('/companies');
      } catch (error) {
        console.error('Error permanently deleting company:', error);
        alert('Failed to permanently delete organization');
      }
    }
  };

  if (isLoadingCompany) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!company) {
    return <div className="text-center py-10 text-red-600">Company not found</div>;
  }

  const isDeleted = !!company.deletedAt;

  return (
    <div>
      <div className="mb-6">
        <Link to="/companies" className="text-indigo-600 hover:text-indigo-900">
          Organizations
        </Link>
        <span className="mx-2">/</span>
        <span>{company.name}</span>
        {isDeleted && (
          <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            <TrashIcon className="mr-1 h-3 w-3" />
            Deleted
          </span>
        )}
      </div>

      <div className="bg-white shadow rounded-lg mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2 p-6">
            <div className="col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={company.name}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={company.email}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={company.phone || ''}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={company.address || ''}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={company.city || ''}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">Province/State:</label>
              <input
                type="text"
                id="region"
                name="region"
                value={company.region || ''}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={company.country || ''}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={company.postalCode || ''}
                onChange={handleInputChange}
                disabled={isDeleted}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${isDeleted ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          <div className="flex justify-between px-6 py-3 bg-gray-50 rounded-b-lg">
            {isDeleted ? (
              <>
                <button 
                  type="button"
                  onClick={handlePermanentDelete}
                  className="text-red-600 hover:text-red-900 font-medium"
                >
                  Permanently Delete
                </button>
                <button
                  type="button"
                  onClick={handleRestore}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Restore Organization
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button"
                  onClick={handleSoftDelete}
                  className="text-red-600 hover:text-red-900 font-medium"
                >
                  Delete Organization
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Organization
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Contacts</h2>
      
      {isLoadingContacts ? (
        <div className="text-center py-4">Loading contacts...</div>
      ) : contacts && contacts.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact: Contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/contacts/${contact.id}`} className="text-indigo-600 hover:text-indigo-900">
                      ›
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow text-center">
          No contacts found.
        </div>
      )}
    </div>
  );
} 