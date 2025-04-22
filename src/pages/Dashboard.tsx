export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Welcome to PingCRM, a CRM application built with modern web technologies.</p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-indigo-50">
          <h2 className="text-xl font-semibold text-gray-900">About This Project</h2>
          <p className="mt-1 text-sm text-gray-600">A lightweight CRM system for managing contacts and organizations</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-base text-gray-700 mb-4">
            PingCRM is a demonstration of a modern full-stack web application built with React, FastAPI, and SQLite. 
            It implements core CRM functionality including contact and organization management with a clean, 
            responsive user interface.
          </p>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-3">Key Features</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Contact management with full CRUD operations</li>
            <li>Organization/company management</li>
            <li>Responsive design that works on mobile and desktop</li>
            <li>Search and filter functionality</li>
            <li>Soft-delete capability with restore options</li>
            <li>Clean, modern user interface</li>
          </ul>
          
          <h3 className="font-semibold text-gray-900 mt-6 mb-3">Tech Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-indigo-600">Frontend</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>React with TypeScript</li>
                <li>TailwindCSS for styling</li>
                <li>React Query for data fetching</li>
                <li>React Router for navigation</li>
                <li>Vite for build tooling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-indigo-600">Backend</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Python with FastAPI</li>
                <li>SQLite database</li>
                <li>SQLAlchemy ORM</li>
                <li>Pydantic for data validation</li>
                <li>Uvicorn ASGI server</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-green-50">
          <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
          <p className="mt-1 text-sm text-gray-600">Use the sidebar navigation to explore the application</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-base text-gray-700 mb-4">
            Navigate to the Contacts or Organizations pages to start managing your CRM data. You can add new entries,
            edit existing ones, or remove them as needed. The search functionality allows you to quickly find what
            you're looking for.
          </p>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-indigo-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-indigo-800">Manage Contacts</h3>
                  <div className="mt-2 text-sm text-indigo-700">
                    <p>Create, update, and manage your contacts with detailed information.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-indigo-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-indigo-800">Organize Companies</h3>
                  <div className="mt-2 text-sm text-indigo-700">
                    <p>Keep track of organizations and associate contacts with their respective companies.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 