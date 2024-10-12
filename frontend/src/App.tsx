import React, { useState, ChangeEvent } from 'react';
import { AlertCircle, Check, Loader2, FileText, Settings, List, Home, Bell, Search, User, X, Command, ArrowLeft } from 'lucide-react';
import logo from './serenity-logo.png';

const Alert = ({ children }: { children: React.ReactNode }) => <div className="bg-gray-700 border-l-4 border-blue-500 text-blue-300 p-4" role="alert">{children}</div>;
const AlertTitle = ({ children }: { children: React.ReactNode }) => <p className="font-bold">{children}</p>;
const AlertDescription = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
const Button = ({ children, variant, size, className, ...props }: any) => <button className={`px-4 py-2 bg-blue-200 text-black rounded ${className}`} {...props}>{children}</button>;
const Card = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <div className={`bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 ${className || ''}`} onClick={onClick}>
    {children}
  </div>
);const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold text-black">{children}</h2>;
const CardDescription = ({ children }: { children: React.ReactNode }) => <p className="text-gray-400">{children}</p>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const Input = (props: any) => <input className="bg-blue-200 shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline" {...props} />;
const ScrollArea = ({ children, className }: { children: React.ReactNode, className: string }) => <div className={`overflow-auto ${className}`}>{children}</div>;

interface AuthRequest {
  id: string;
  patient: string;
  service: string;
  status: 'pending' | 'approved' | 'denied';
  date: string;
  details?: string;
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg p-8 max-w-3xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const AICommandInput: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [patientInfo, setPatientInfo] = useState('');
  const [procedure, setProcedure] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_info: patientInfo,
          procedure: procedure
        })
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate request.');
      }

      const data = await response.json();
      // Assuming the API returns a field called 'message' with the result
      setResult(data.message || 'Request generated successfully.');
      
      // Optionally, trigger success callback after a short delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      // Handle network or parsing errors
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientInfo" className="block text-sm font-medium text-gray-700">
            Patient Name or ID
          </label>
          <Input
            id="patientInfo"
            value={patientInfo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPatientInfo(e.target.value)}
            placeholder="Enter patient name or ID"
            className="w-full p-4 bg-gray-200 outline-none text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">
            Procedure
          </label>
          <Input
            id="procedure"
            value={procedure}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setProcedure(e.target.value)}
            placeholder="Enter procedure"
            className="w-full p-4 bg-gray-200 outline-none text-black"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-gray-900 p-4 text-white" disabled={isProcessing}>
          {isProcessing ? <Loader2 className="h-6 w-4 animate-spin mx-auto" /> : 'Generate'}
        </Button>
      </form>
      {result && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert>
          <X className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const RequestDetails: React.FC<{ request: AuthRequest; onBack: () => void }> = ({ request, onBack }) => {
  return (
    <div>
      <Button onClick={onBack} className="mb-4 flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{request.patient}</CardTitle>
          <CardDescription>{request.service}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-black mb-2">Date: {request.date}</p>
          <p className="text-black mb-2">
            Status: <span className={`px-2 py-1 rounded ${getStatusColor(request.status)}`}>{capitalizeFirstLetter(request.status)}</span>
          </p>
          <p className="text-black mb-2">Details: {request.details || 'No additional details available.'}</p>
        </CardContent>
      </Card>
    </div>
  );
};


const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-200 text-yellow-800';
    case 'approved':
      return 'bg-green-200 text-green-800';
    case 'denied':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const getDotColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'approved':
      return 'bg-green-500';
    case 'denied':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const ActiveRequests: React.FC<{ requests: AuthRequest[], onSelectRequest: (id: string) => void }> = ({ requests, onSelectRequest }) => {
  return (
    <ScrollArea className="h-max">
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} onClick={() => onSelectRequest(request.id)} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <CardHeader>
                  <CardTitle>{request.patient}</CardTitle>
                  <CardDescription>{request.service}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-black">Date: {request.date}</p>
                </CardContent>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)} flex items-center space-x-2 w-28 justify-center`}>
                <span className={`w-2 h-2 rounded-full ${getDotColor(request.status)}`}></span>
                <span>{capitalizeFirstLetter(request.status)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

const Header: React.FC<{ activeTab: string, setActiveTab: (tab: string) => void, openModal: () => void }> = ({ activeTab, setActiveTab, openModal}) => (
  <header className="bg-gray-50 border border-gray-200 p-3 flex justify-between items-center">
    <div className="flex items-center space-x-4">
    <img src={logo} alt="Logo" className="h-8 w-auto mr-4" />
      {[
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'active-requests', icon: List, label: 'Active Requests' },
        { id: 'new-request', icon: Command, label: 'New Request' }
        ,
      ].map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? "secondary" : "ghost"}
          className={`flex p-0 items-center text-sm text-left ${activeTab === item.id ? 'bg-blue-200 bg-opacity-50 text-blue-500' : 'hover:text-blue-500 bg-gray-50 text-black'}`}
          onClick={() => {
            if (item.id === 'new-request') {
              openModal();
            } else {
              setActiveTab(item.id);
            }
          }}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </div>

    {/* Right-aligned section */}
    <div className="ml-auto flex items-center space-x-4">
      {/* Search input */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search"
          className="pl-10 pr-4 text-xs py-2 outline-none border w-full bg-gray-100 text-black "
        />
      </div>

      {/* Notification and User buttons */}
      <Button variant="ghost" className='bg-gray-50' size="icon">
        <Bell className="h-5 w-5 text-black" />
      </Button>
      <Button variant="ghost" className='bg-gray-50'  size="icon">
        <User className="h-5 w-5 text-black" />
      </Button>
    </div>
  </header>
);


const PriorAuthRequestApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requests] = useState<AuthRequest[]>([
    { id: '1', patient: 'Jane Doe', service: 'PET/CT skull thigh', status: 'pending', date: '2024-10-11', details: 'Awaiting insurance approval.' },
    { id: '2', patient: 'John Smith', service: 'MRI lower back', status: 'approved', date: '2024-10-10', details: 'Approved for next week.' },
    { id: '3', patient: 'Alice Johnson', service: 'Chest X-ray', status: 'denied', date: '2024-10-09', details: 'Insufficient medical necessity demonstrated.' },
    { id: '4', patient: 'Bob Williams', service: 'Ultrasound abdomen', status: 'pending', date: '2024-10-08', details: 'Additional information requested from referring physician.' }
  ]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuccessfulGeneration = () => {
    closeModal();
    setActiveTab('active-requests');
  };

  const handleBackToRequests = () => {
    setSelectedRequestId(null);
    setActiveTab('active-requests');
  };

  const handleSelectRequest = (id: string) => {
    setSelectedRequestId(id);
    setActiveTab('request-details');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="text-black">Dashboard content goes here</div>;
      case 'active-requests':
        return <ActiveRequests requests={requests} onSelectRequest={handleSelectRequest} />;
      case 'request-details':
        const selectedRequest = requests.find((request) => request.id === selectedRequestId);
        if (!selectedRequest) {
          return <div className="text-black">Request not found.</div>;
        }
        return <RequestDetails request={selectedRequest} onBack={handleBackToRequests} />;
      case 'settings':
        return <div className="text-black">Settings content goes here</div>;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} openModal={openModal} />
        <main className="flex-1 p-8 overflow-auto">
          <h2 className="text-2xl font-semibold text-black mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
          </h2>
          {renderContent()}
        </main>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-semibold text-black mb-4">New Request</h2>
        <AICommandInput onSuccess={handleSuccessfulGeneration} />
      </Modal>
    </div>
  );
};

export default PriorAuthRequestApp;