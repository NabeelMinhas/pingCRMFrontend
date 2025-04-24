import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define a type for the API response which might be different than our internal types
interface ContactData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}

export default function ContactDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: contact, isLoading } = useQuery<ContactData>({
    queryKey: ['contact', id],
    queryFn: async () => {
      const response = await axios.get(`/api/contacts/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!contact) {
    return <div className="text-center py-10 text-red-600">Contact not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {contact.firstName} {contact.lastName}
        </h1>
        <div className="flex space-x-3">
          <Link
            to={`/contacts/${id}/edit`}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </Link>
          <Link
            to="/contacts"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Back to Contacts
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {contact.firstName} {contact.lastName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.phone}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {contact.address}
                <br />
                {contact.city}, {contact.region} {contact.postalCode}
                <br />
                {contact.country}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 