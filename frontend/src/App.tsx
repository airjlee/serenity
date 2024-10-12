import React, { useState, ChangeEvent } from 'react';
import { AlertCircle, Check, Loader2, FileText, Settings, List, Home, Bell, Search, User, X, Command, Icon } from 'lucide-react';
import logo from './serenity-logo.png';

const Alert = ({ children }: { children: React.ReactNode }) => <div className="bg-gray-700 border-l-4 border-blue-500 text-blue-300 p-4" role="alert">{children}</div>;
const AlertTitle = ({ children }: { children: React.ReactNode }) => <p className="font-bold">{children}</p>;
const AlertDescription = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
const Button = ({ children, variant, size, className, ...props }: any) => <button className={`px-4 py-2 bg-blue-200 text-black rounded ${className}`} {...props}>{children}</button>;
const Card = ({ children }: { children: React.ReactNode }) => <div className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">{children}</div>;
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
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

const AICommandInput: React.FC<{onSuccess: () => void}> = ({ onSuccess }) => {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setResult('Prior authorization request for PET/CT skull thigh for Jane Doe has been generated and submitted.');
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  

  return (
    <div className="space-y-4 ">

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={command}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCommand(e.target.value)}
          placeholder="/req [service] for [patient]"
          className="flex-grow bg-gray-200 outline-none p-5 rounded-md"
        />
        <Button type="submit" className="bg-black" disabled={isProcessing}>
          {isProcessing ? <Loader2 className="h-4 w-16 animate-spin" /> : 'Generate'}
        </Button>
      </form>
      {result && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const ActiveRequests: React.FC = () => {
  const [requests] = useState<AuthRequest[]>([
    { id: '1', patient: 'Jane Doe', service: 'PET/CT skull thigh', status: 'pending', date: '2024-10-11' },
    { id: '2', patient: 'John Smith', service: 'MRI lower back', status: 'approved', date: '2024-10-10' },
    { id: '3', patient: 'Alice Johnson', service: 'Chest X-ray', status: 'denied', date: '2024-10-09' },
    {id: '4', patient: 'Alice Johnson', service: 'Chest X-ray', status: 'denied', date: '2024-10-09' }
  ]);

  return (
    <ScrollArea className="h-max">
      <div className="space-y-4">
        {requests.map((request) => (
         <Card key={request.id}>
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
           <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
             {request.status}
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuccessfulGeneration = () => {
    closeModal();
    setActiveTab('new-request');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="text-black">Dashboard content goes here</div>;
      // case 'new-request':
      //   return <AICommandInput />;
      case 'active-requests':
        return <ActiveRequests />;
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