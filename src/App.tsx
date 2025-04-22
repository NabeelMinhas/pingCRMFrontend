import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/contacts/Contacts';
import ContactDetails from './pages/contacts/ContactDetails';
import ContactForm from './pages/contacts/ContactForm';
import Companies from './pages/companies/Companies';
import CompanyDetails from './pages/companies/CompanyDetails';
import CompanyForm from './pages/companies/CompanyForm';
import Reports from './pages/Reports';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Contacts Routes */}
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/new" element={<ContactForm />} />
          <Route path="/contacts/:id" element={<ContactDetails />} />
          <Route path="/contacts/:id/edit" element={<ContactForm />} />

          {/* Companies Routes */}
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/new" element={<CompanyForm />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/companies/:id/edit" element={<CompanyForm />} />

          {/* Reports Route */}
          <Route path="/reports" element={<Reports />} />

          {/* Default Route */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
