import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { MagnifyingGlassIcon, XMarkIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Company {
  id: number;
  name: string;
  city: string;
  phone: string;
  deletedAt?: string | null;
}

interface CompanyFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}

interface PaginatedResponse {
  items: Company[];
  total: number;
  page: number;
  pages: number;
}

export default function Companies() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('active'); // 'active', 'trashed', 'all'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const pageSize = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    country: '',
    postalCode: '',
  });

  const { data, isLoading, refetch } = useQuery<PaginatedResponse>({
    queryKey: ['companies', search, currentPage, filterStatus],
    queryFn: async () => {
      const response = await axios.get('/api/companies', {
        params: { 
          search,
          skip: (currentPage - 1) * pageSize,
          limit: pageSize,
          status: filterStatus
        },
      });
      return response.data;
    },
  });

  const createCompany = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const response = await axios.post('/api/companies', data);
      return response.data;
    },
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
      resetForm();
    },
  });

  const softDeleteCompany = useMutation({
    mutationFn: async (id: number) => {
      // Using PATCH instead of DELETE for soft delete
      return axios.patch(`/api/companies/${id}/soft-delete`);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error soft deleting company:', error);
      alert('Failed to delete organization. Please try again.');
    }
  });

  const restoreCompany = useMutation({
    mutationFn: async (id: number) => {
      return axios.patch(`/api/companies/${id}/restore`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      region: '',
      country: '',
      postalCode: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany.mutateAsync(formData);
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSoftDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await softDeleteCompany.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreCompany.mutateAsync(id);
    } catch (error) {
      console.error('Error restoring company:', error);
    }
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
    setIsFilterOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || (data && page > data.pages)) return;
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    refetch();
  };

  const handleReset = () => {
    setSearch('');
    setCurrentPage(1);
    setFilterStatus('active');
    refetch();
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    if (!data) return [];
    const totalPages = data.pages;
    
    // If 5 or fewer pages, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Show current page, 2 before and 2 after when possible
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust if at the end
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Create Organization
        </button>
      </div>

      {/* Create Organization Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Create Organization</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email:
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone:
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address:
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City:
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                        Province/State:
                      </label>
                      <input
                        type="text"
                        id="region"
                        name="region"
                        value={formData.region || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country:
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                        Postal code:
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Create Organization
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // Auto-search as user types
              setCurrentPage(1);
            }}
            placeholder="Search..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span>{filterStatus === 'active' ? 'Active' : filterStatus === 'trashed' ? 'Trashed' : 'All'}</span>
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === 'active' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleFilterChange('active')}
              >
                Active
              </button>
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === 'trashed' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleFilterChange('trashed')}
              >
                Trashed
              </button>
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${filterStatus === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    City
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : data && data.items.length > 0 ? (
                  data.items.map((company: Company) => (
                    <tr key={company.id} className={company.deletedAt ? "bg-gray-50" : ""}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <div className="flex items-center">
                          {company.deletedAt && (
                            <TrashIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                          )}
                          {company.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.city}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.phone}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {company.deletedAt ? (
                          <button
                            onClick={() => handleRestore(company.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Restore
                          </button>
                        ) : (
                          <>
                            <Link to={`/companies/${company.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              <span className="sr-only">Edit {company.name}</span>
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => handleSoftDelete(company.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No organizations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
          <div className="-mt-px flex w-0 flex-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Previous
            </button>
          </div>
          
          <div className="hidden md:-mt-px md:flex">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                  page === currentPage
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data || currentPage >= data.pages}
              className={`inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium ${
                !data || currentPage >= data.pages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
} 