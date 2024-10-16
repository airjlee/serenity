import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Loader2, FileText, Settings, List, Home, Bell, Search, User, X, Command, ArrowLeft, Save, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import logo from './serenity-logo.png';
import { patients, Patient } from './Patient';
import { createInterface } from 'readline';

const Alert = ({ children }: { children: React.ReactNode }) => <div className="bg-red-200 border-l-4 border-red-500 text-black p-4" role="alert">{children}</div>;
const AlertS = ({ children }: { children: React.ReactNode }) => <div className="bg-green-200 border-l-4 border-green-500 text-black p-4" role="alert">{children}</div>;
const AlertTitle = ({ children }: { children: React.ReactNode }) => <p className="font-bold">{children}</p>;
const AlertDescription = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
const Button = ({ children, variant, size, className, ...props }: any) => <button className={`px-4 py-2 bg-blue-200 text-black rounded ${className}`} {...props}>{children}</button>;
const Card = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <div className={`bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 ${className || ''}`} onClick={onClick}>
    {children}
  </div>
);
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold text-black">{children}</h2>;
const CardDescription = ({ children }: { children: React.ReactNode }) => <p className="text-gray-400">{children}</p>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const Input = (props: any) => <input className="bg-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" {...props} />;
const ScrollArea = ({ children, className }: { children: React.ReactNode, className: string }) => <div className={`overflow-auto ${className}`}>{children}</div>;

interface AuthRequest {
  id: string;
  patient: string;
  service: string;
  status: 'pending' | 'approved' | 'denied';
  date: string;
  details?: string;
  patientName: string;
  patientDOB: string;
  patientGender: string;
  patientAddress: string;
  patientCity: string;
  patientState: string;
  patientZip: string;
  patientPhone: string;
  patientEmail: string;
  patientInsuranceId: string;
  patientInsuranceName: string;
  referringProviderName: string;
  referringProviderNPI: string;
  referringProviderRelationship: string;
  servicingProviderName: string;
  servicingProviderNPI: string;
  serviceType: string;
  serviceStartDate: string;
  cptCodes: string;
  icdCodes: string;
  summaryMedicalNeed: string;
  reasonsRequestedMedication: string;
}

interface RequestDetailsProps {
  request: AuthRequest;
  onBack: () => void;
  onUpdate: (updatedRequest: AuthRequest) => void;
  onRequestUpdate: (id: string) => void;
}

interface DashboardProps {
  requests: Request[];
  onSelectRequest: (id: string) => void;
  onRequestUpdate: (id: string) => void;
  setActiveTab: () => void;
}

interface RequestCardProps {
  patient: string;
  service: string;
  date: string;
  status: string;
}

interface Request {
  id: string;
  patient: string;
  service: string;
  date: string;
  status: string;
}

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@providence.com' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center space-y-6 mb-8">
          <img src={logo} alt="Logo" className="h-12 w-auto mx-auto" />
          <p className="text-gray-600 text-sm">Sign-in with your organization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-center" role="alert">
              <AlertCircle className="text-red-400 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};


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

interface AICommandInputProps {
  onSuccess: (data: any) => void;
  requests: Patient[];
}

const AICommandInput: React.FC<AICommandInputProps> = ({ onSuccess, requests }) => {
  const [patientInfo, setPatientInfo] = useState('');
  const [procedure, setProcedure] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<Patient[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Patient | null>(null);

  useEffect(() => {
    if (patientInfo.length > 2) {
      const filtered = requests.filter(request =>
        request.patientName.toLowerCase().includes(patientInfo.toLowerCase()) ||
        request.patientDateOfBirth.includes(patientInfo)
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests([]);
    }
  }, [patientInfo, requests]);

  const handlePatientSelect = (request: Patient) => {
    setSelectedRequest(request);
    setPatientInfo(`${request.patientName} (${request.patientDateOfBirth})`);
    setFilteredRequests([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      const requestBody = {
        patient_info: selectedRequest ? {
          patientName: selectedRequest.patientName,
          patientDOB: selectedRequest.patientDateOfBirth,
          patientGender: selectedRequest.patientGender,
          patientAddress: selectedRequest.patientAddress,
          patientEmail: selectedRequest.patientEmail,
          patientInsuranceId: selectedRequest.healthInsuranceIDNumber,
          patientInsuranceName: selectedRequest.healthInsuranceName,
        } : patientInfo,
        procedure: procedure,
      };

      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate request.');
      }

      const data = await response.json();
      setResult('Request generated successfully.');
      onSuccess(data);
    } catch (err: any) {
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
          <div className="relative">
            <Input
              id="patientInfo"
              value={patientInfo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientInfo(e.target.value)}
              placeholder="Enter patient name or ID"
              className="w-full p-4 bg-gray-200 outline-none text-black"
              required
            />
            {filteredRequests.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                {filteredRequests.map((request) => (
                  <li
                    key={request.patientName}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePatientSelect(request)}
                  >
                    {request.patientName} ({request.patientDateOfBirth})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">
            Procedure
          </label>
          <Input
            id="procedure"
            value={procedure}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProcedure(e.target.value)}
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

const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onBack, onUpdate, onRequestUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<AuthRequest>(request);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(request);
    setEditMode(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
        </Button>
        {!editMode && (
          <Button onClick={() => setEditMode(true)}>Edit Request</Button>
        )}
      </div>
      <Card>
        <div className="flex flex-row items-center justify-between">
          <CardHeader>
            <div>
              <CardTitle>{formData.patientName}</CardTitle>
              <CardDescription>{formData.service}</CardDescription>
            </div>
          </CardHeader>
              <div className="relative mr-4">
                <div
                  className={`px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(request.status)} flex items-center space-x-2 justify-center cursor-pointer`}
                  style={{ minWidth: '140px', height: '40px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(request.id);
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${getDotColor(request.status)}`} style={{ minWidth: '12px' }}></div>
                  <span>{capitalizeFirstLetter(request.status)}</span>
                  {request.status === 'pending' && (
                    <ChevronDown
                      className="h-5 w-5 ml-1"
                    />
                  )}
                </div>
                {request.status === 'pending' && openDropdown === request.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          onRequestUpdate(request.id);
                          setOpenDropdown(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Request Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Request Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Name</label>
                  <Input
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <Input
                    name="patientDOB"
                    type="date"
                    value={formData.patientDOB}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                {/* Add other patient information fields here */}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Provider Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Referring Provider Name</label>
                  <Input
                    name="referringProviderName"
                    value={formData.referringProviderName}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Referring Provider NPI</label>
                  <Input
                    name="referringProviderNPI"
                    value={formData.referringProviderNPI}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                {/* Add other provider information fields here */}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Clinical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Service Type</label>
                  <Input
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Start Date</label>
                  <Input
                    name="serviceStartDate"
                    type="date"
                    value={formData.serviceStartDate}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
                {/* Add other clinical information fields here */}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Rationale for Treatment</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Summary of Medical Need</label>
                <textarea
                  name="summaryMedicalNeed"
                  value={formData.summaryMedicalNeed}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editMode}
                />
              </div>
              <div>
                <label htmlFor="reasonsRequestedMedication" className="block text-sm font-medium mb-1">Reasons for Requested Medication or Service</label>
                <textarea
                  name="reasonsRequestedMedication"
                  value={formData.reasonsRequestedMedication}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {/* Add other rationale fields here */}
            </div>

            {/* Add remaining sections (Patient Diagnosis, Patient Medical Records, Patient History, Physician Opinion) following the same pattern */}

            {editMode && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Please ensure all information is accurate and complete before saving. Inaccurate or incomplete information may delay the authorization process.
                </AlertDescription>
              </Alert>
            )}

            {editMode && (
              <div className="flex justify-end space-x-4">
                <Button type="button" onClick={handleCancel} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            )}
          </form>
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

const mockApprovalData = [
  { date: '7/1/24', value: 1000 },
  { date: '7/2/24', value: 1200 },
  { date: '7/3/24', value: 800 },
  { date: '7/4/24', value: 1400 },
];

const mockSubmissionData = [
  { date: '7/1/24', value: 400 },
  { date: '7/2/24', value: 30 },
  { date: '7/3/24', value: 150 },
  { date: '7/4/24', value: 220 },
];

const ChartCard = ({ title, data }: { title: string; data: any[] }) => (
  <Card className="w-[500px]">
    <div >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </div>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const RequestCard = ({ patient, service, date, status }: RequestCardProps) => (
  <Card className="w-full mb-4">
    <div className="flex justify-between items-center p-4">
      <CardContent>
        <div>
          <h3 className="font-semibold">{patient}</h3>
          <p className="text-sm text-gray-500">{service}</p>
          <p className="text-sm">Date: {date}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 
          status === 'Approved' ? 'bg-green-200 text-green-800' : 
          'bg-red-200 text-red-800'
        }`}>
          {status}
        </span>
      </CardContent>
    </div>
  </Card>
);

interface LeftMenuProps{
  setActiveTab: (string: string) => void;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ setActiveTab }) => (
  <div className="w-64 bg-[#f9fafb] p-2">
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Requests</h2>
        <ul className="space-y-2 text-sm">
          {['Pending Requests', 'Recent Requests', 'Approved Requests', 'Denied Requests', 'Archived Requests'].map((item) => (
            <li key={item} className="hover:bg-gray-100 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Providers</h2>
        <ul className="space-y-2 text-sm">
          {['Manage Providers', 'Provider Directory', 'Provider Performance Metrics'].map((item) => (
            <li key={item} className="hover:bg-gray-100 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Patients</h2>
        <ul className="space-y-2 text-sm">
          {['Patient Directory', 'Patient Profiles', 'Request History by Patient'].map((item) => (
            <li key={item} className="hover:bg-gray-100 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Reports</h2>
        <ul className="space-y-2 text-sm">
          {['Request Trends', 'Approval Rates', 'Denial Reasons', 'Custom Reports'].map((item) => (
            <li key={item} className="hover:bg-gray-100 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Settings</h2>
        <ul className="space-y-2 text-sm">
          {['User Preferences', 'EHR Settings', 'Account', 'Sign Out'].map((item) => (
            <li key={item} className="hover:bg-gray-100 cursor-pointer" onClick={() => setActiveTab('user-preferences')}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);


const Dashboard = ({ requests, onSelectRequest, onRequestUpdate, setActiveTab }: DashboardProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="flex">
      <LeftMenu setActiveTab={setActiveTab} />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6 ">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Average Prior Auth Approval Time" data={mockApprovalData} />
          <ChartCard title="Average Prior Auth Submission Time" data={mockSubmissionData} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
        <div className="space-y-4">
          {requests.slice(0, 2).map((request) => (
            <Card
              key={request.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectRequest(request.id)}
            >
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
                <div className="relative mr-4">
                  <div
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      request.status
                    )} flex items-center space-x-2 justify-center cursor-pointer`}
                    style={{ width: '110px', height: '28px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(request.id);
                    }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${getDotColor(request.status)}`}
                      style={{ minWidth: '8px' }}
                    ></div>
                    <span>{capitalizeFirstLetter(request.status)}</span>
                    {request.status === 'pending' && (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                  {request.status === 'pending' && openDropdown === request.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestUpdate(request.id);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          Request Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActiveRequests: React.FC<{ requests: AuthRequest[], onSelectRequest: (id: string) => void, onRequestUpdate: (id: string) => void }> = ({ requests, onSelectRequest, onRequestUpdate }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <ScrollArea className="h-max">
      <div className="space-y-4">
        {[...requests].reverse().map((request: Request) => (
          <Card 
            key={request.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectRequest(request.id)}
          >
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
              <div className="relative">
              <div
                className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)} flex items-center space-x-2 justify-center cursor-pointer`}
                style={{ width: '110px', height: '28px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(request.id);
                }}
              >
                <div className={`w-2 h-2 rounded-full ${getDotColor(request.status)}`} style={{ minWidth: '8px' }}></div>
                <span>{capitalizeFirstLetter(request.status)}</span>
                {request.status === 'pending' && <ChevronDown className="h-4 w-4 ml-1" />}
              </div>
                {request.status === 'pending' && openDropdown === request.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          onRequestUpdate(request.id);
                          setOpenDropdown(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Request Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

const SuccessAlert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 w-72">
      <AlertS >
        <Check className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </AlertS >
    </div>
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

interface PriorAuthFormProps {
  initialData?: any;
  onSubmit: (newRequest: AuthRequest) => void;
}

const PriorAuthForm: React.FC<PriorAuthFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Patient Information
    patientName: '',
    patientDOB: '',
    patientGender: '',
    patientAddress: '',
    patientCity: '',
    patientState: '',
    patientZip: '',
    patientEmail: '',
    patientPhone: '',
    patientInsuranceId: '',
    patientInsuranceName:'',

    // Provider Information
    referringProviderName: '',
    referringProviderNPI: '',
    referringProviderRelationship: '',
    servicingProviderName: '',
    servicingProviderNPI: '',
    
    // Clinical Information
    serviceType: '',
    serviceStartDate: '',
    cptCodes: '',
    icdCodes: '',
    
    // Rationale for Treatment
    summaryMedicalNeed: '',
    reasonsRequestedMedication: '',
    
    // // Patient Diagnosis
    // diagnosisICD10: '',
    // diagnosisDate: '',
    
    // // Patient Medical Records
    // diagnosticTestResults: '',
    // imagingResults: '',
    
    // // Patient History
    // previousTreatments: '',
    // treatmentResponse: '',
    // recentSymptoms: '',
    // currentCondition: '',
    
    // // Physician Opinion
    // physicianPrognosis: '',
    // diseaseProgression: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prevState => ({
        ...prevState,
        ...initialData.content
      }));
    }

    console.log("insruancename:", initialData.content.patientInsuranceName);
   
  }, [initialData]);

  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onSubmit({
      id: `req${Date.now()}`, // Generate a unique ID
      patient: formData.patientName,
      service: formData.serviceType,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      ...formData
    });
  };
  

  return (
    <Card >
      <CardHeader>
        <CardTitle>Prior Authorization Request Form</CardTitle>
        <CardDescription>Please fill out all fields to submit a detailed prior authorization request.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium mb-1">Patient Name</label>
                <Input name="patientName" value={formData.patientName} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="patientDOB" className="block text-sm font-medium mb-1">Date of Birth</label>
                <Input name="patientDOB" type="date" value={formData.patientDOB} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="patientGender" className="block text-sm font-medium mb-1">Gender</label>
                <Input name="patientGender" value={formData.patientGender} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="patientAddress" className="block text-sm font-medium mb-1">Address</label>
                <Input name="patientAddress" value={formData.patientAddress} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="patientInsuranceId" className="block text-sm font-medium mb-1">Health Insurance ID Number</label>
                <Input name="patientInsuranceId" value={formData.patientInsuranceId} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="patientInsuranceName" className="block text-sm font-medium mb-1">Health Insurance Name</label>
                <Input name="patientInsuranceName" value={formData.patientInsuranceName} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Provider Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="referringProviderName" className="block text-sm font-medium mb-1">Referring Provider Name</label>
                <Input name="referringProviderName" value={formData.referringProviderName} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="referringProviderNPI" className="block text-sm font-medium mb-1">Referring Provider NPI</label>
                <Input name="referringProviderNPI" value={formData.referringProviderNPI} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="referringProviderRelationship" className="block text-sm font-medium mb-1">Relationship to the Patient</label>
                <Input name="referringProviderRelationship" value={formData.referringProviderRelationship} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="servicingProviderName" className="block text-sm font-medium mb-1">Servicing Provider Name</label>
                <Input name="servicingProviderName" value={formData.servicingProviderName} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="servicingProviderNPI" className="block text-sm font-medium mb-1">Servicing Provider NPI</label>
                <Input name="servicingProviderNPI" value={formData.servicingProviderNPI} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          {/* Continue with similar structure for other sections... */}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Clinical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium mb-1">Type of Service Requested</label>
                <Input name="serviceType" value={formData.serviceType} onChange={handleInputChange} required />
              </div>
              {/* <div>
                <label htmlFor="serviceStartDate" className="block text-sm font-medium mb-1">Service Start Date</label>
                <Input name="serviceStartDate" type="date" value={formData.serviceStartDate} onChange={handleInputChange} required />
              </div> */}
              <div>
                <label htmlFor="cptCodes" className="block text-sm font-medium mb-1">CPT Codes</label>
                <Input name="cptCodes" value={formData.cptCodes} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="icdCodes" className="block text-sm font-medium mb-1">ICD Codes</label>
                <Input name="icdCodes" value={formData.icdCodes} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rationale for Treatment</h3>
            <div>
              <label htmlFor="summaryMedicalNeed" className="block text-sm font-medium mb-1">Summary of Medical Need</label>
              <textarea
                name="summaryMedicalNeed"
                value={formData.summaryMedicalNeed}
                onChange={handleInputChange}
                rows={4}
                className="bg-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="reasonsRequestedMedication" className="block text-sm font-medium mb-1">Reasons for Requested Medication or Service</label>
              <textarea
                name="reasonsRequestedMedication"
                value={formData.reasonsRequestedMedication}
                onChange={handleInputChange}
                rows={4}
                className="bg-white shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>

          {/* Add remaining sections (Patient Diagnosis, Patient Medical Records, Patient History, Physician Opinion) following the same pattern */}

          <Alert>
            <div className="flex items-center">
          <AlertCircle className="h-4 mr-2 w-4" />
          <span className="ml-2">
            <AlertTitle>Important</AlertTitle>
          </span>
    </div>

            <AlertDescription>
              Please ensure all information is accurate and complete before submission. Inaccurate or incomplete information may delay the authorization process.
            </AlertDescription>
            
          </Alert>

         <div className="flex justify-center">
  <Button type="submit" className="bg-blue-20  h-16 w-full">
    Submit Request
  </Button>
</div>
        </form>
      </CardContent>

    </Card>
  );
};

interface EHRConfigPageProps {
  onBack: () => void;
}
const EHRConfigPage: React.FC<EHRConfigPageProps> = ({onBack}) => {
  const [config, setConfig] = useState({
    ehrSystem: 'Epic',
    apiEndpoint: "https://api.epichealth.example.com/v1/fhir/Patient",
    apiKey: "123e4567-e89b-12d3-a456-426614174000",
    dataFormat: 'HL7',
    autoSync: true,
    syncInterval: '15',
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name:any, value:any) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name:any, checked:any) => {
    setConfig((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Here you would typically save the configuration to your backend
    console.log('Saving EHR configuration:', config);
    // For demo purposes, we'll just show an alert
    alert('EHR configuration saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
       <Button onClick={onBack} className="bg-gray-900 text-white flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      <Card>
        <CardHeader>
          <CardTitle>EHR Configuration</CardTitle>
          <CardDescription>Configure your Electronic Health Record system integration settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="ehrSystem" className="block text-sm font-medium mb-1">EHR System</label>
                <Input
                  id="ehrSystem"
                  name="ehrSystem"
                  value={config.ehrSystem}
                  onChange={handleInputChange}
                  placeholder="e.g., Epic, Cerner, Allscripts"
                  required
                />
              </div>
              <div>
                <label htmlFor="apiEndpoint" className="block text-sm font-medium mb-1">API Endpoint</label>
                <Input
                  id="apiEndpoint"
                  name="apiEndpoint"
                  value={config.apiEndpoint}
                  onChange={handleInputChange}
                  placeholder="https://api.ehrsystem.com/v1/"
                  required
                />
              </div>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium mb-1">API Key</label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  value={config.apiKey}
                  onChange={handleInputChange}
                  placeholder="Enter your API key"
                  required
                />
              </div>
              {/* <div>
                <label htmlFor="dataFormat" className="block text-sm font-medium mb-1">Data Format</label>
                <Select name="dataFormat" value={config.dataFormat} onValueChange={(value) => handleSelectChange('dataFormat', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HL7">HL7</SelectItem>
                    <SelectItem value="FHIR">FHIR</SelectItem>
                    <SelectItem value="CDA">CDA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="autoSync" className="text-sm font-medium">Auto-sync</label>
                <Switch
                  id="autoSync"
                  name="autoSync"
                  checked={config.autoSync}
                  onCheckedChange={(checked) => handleSwitchChange('autoSync', checked)}
                />
              </div> */}
              {config.autoSync && (
                <div>
                  <label htmlFor="syncInterval" className="block text-sm font-medium mb-1">Sync Interval (minutes)</label>
                  <Input
                    id="syncInterval"
                    name="syncInterval"
                    type="number"
                    value={config.syncInterval}
                    onChange={handleInputChange}
                    min="5"
                    max="60"
                    required
                  />
                </div>
              )}
            </div>

            {/* <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Ensure that your EHR system's API endpoint and key are correct. Incorrect configuration may result in sync failures or data discrepancies.
              </AlertDescription>
            </Alert> */}

            <Button type="submit" className="w-full bg-gray-900 text-white">
               Save Configuration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const PriorAuthRequestApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [formData, setFormData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // New state for tracking login status
  const [requests, setRequests] = useState<AuthRequest[]>([
    {
      id: "req1",
      patient: "Michael Penix Jr.",
      service: "Laparoscopic Cholecystectomy",
      status: "pending",
      date: "2024-10-12",
      details: "Patient requires MRI for persistent headaches.",
      
      patientName: "John Doe",
      patientDOB: "1985-02-15",
      patientGender: "Male",
      patientAddress: "123 Elm St",
      patientCity: "Springfield",
      patientState: "IL",
      patientZip: "62704",
      patientPhone: "555-1234",
      patientEmail: "johndoe@example.com",
      patientInsuranceId: "A123456789",
      patientInsuranceName: "HealthFirst",
  
      referringProviderName: "Dr. Jane Smith",
      referringProviderNPI: "1234567890",
      referringProviderRelationship: "Primary Care",
      servicingProviderName: "Dr. Mark Johnson",
      servicingProviderNPI: "0987654321",
  
      serviceType: "Diagnostic Imaging",
      serviceStartDate: "2024-10-20",
      cptCodes: "70551",
      icdCodes: "R51",
      summaryMedicalNeed: "MRI needed to assess potential neurological causes of chronic headaches.",
      reasonsRequestedMedication: "None",
    },
    {
      id: "req2",
      patient: "Ronald Luong",
      service: "Specialty Medications",
      status: "denied",
      date: "2024-09-25",
      details: "Patient recovering from knee surgery, requires PT sessions.",
  
      patientName: "Jane Doe",
      patientDOB: "1990-08-12",
      patientGender: "Female",
      patientAddress: "456 Oak St",
      patientCity: "Lincoln",
      patientState: "NE",
      patientZip: "68510",
      patientPhone: "555-5678",
      patientEmail: "janedoe@example.com",
      patientInsuranceId: "B987654321",
      patientInsuranceName: "WellCare",
  
      referringProviderName: "Dr. Emily White",
      referringProviderNPI: "2345678901",
      referringProviderRelationship: "Orthopedic Surgeon",
      servicingProviderName: "Dr. Michael Green",
      servicingProviderNPI: "1098765432",
  
      serviceType: "Physical Therapy",
      serviceStartDate: "2024-10-01",
      cptCodes: "97110",
      icdCodes: "S83.511A",
      summaryMedicalNeed: "Post-operative rehabilitation for right knee ACL reconstruction.",
      reasonsRequestedMedication: "Pain management post-surgery.",
    },
    {
      id: "req3",
      patient: "Chloe Lee",
      service: "Spinal Fusion Surgery",
      status: "approved",
      date: "2024-10-01",
      details: "Request for chemotherapy treatment for lung cancer.",
  
      patientName: "Mike Brown",
      patientDOB: "1975-04-05",
      patientGender: "Male",
      patientAddress: "789 Pine St",
      patientCity: "Columbus",
      patientState: "OH",
      patientZip: "43210",
      patientPhone: "555-9012",
      patientEmail: "mikebrown@example.com",
      patientInsuranceId: "C456789012",
      patientInsuranceName: "Blue Cross",
  
      referringProviderName: "Dr. Lisa Black",
      referringProviderNPI: "3456789012",
      referringProviderRelationship: "Oncologist",
      servicingProviderName: "Dr. George Harris",
      servicingProviderNPI: "2109876543",
  
      serviceType: "Chemotherapy",
      serviceStartDate: "2024-10-15",
      cptCodes: "96413",
      icdCodes: "C34.90",
      summaryMedicalNeed: "Chemotherapy needed for stage II non-small cell lung cancer.",
      reasonsRequestedMedication: "Treat and manage lung cancer progression.",
    },
    {
      id: "req3",
      patient: "Daniel Le",
      service: "Computed Tomography (CT) Angiography",
      status: "pending",
      date: "2024-10-01",
      details: "Request for chemotherapy treatment for lung cancer.",
  
      patientName: "Mike Brown",
      patientDOB: "1975-04-05",
      patientGender: "Male",
      patientAddress: "789 Pine St",
      patientCity: "Columbus",
      patientState: "OH",
      patientZip: "43210",
      patientPhone: "555-9012",
      patientEmail: "mikebrown@example.com",
      patientInsuranceId: "C456789012",
      patientInsuranceName: "Blue Cross",
  
      referringProviderName: "Dr. Lisa Black",
      referringProviderNPI: "3456789012",
      referringProviderRelationship: "Oncologist",
      servicingProviderName: "Dr. George Harris",
      servicingProviderNPI: "2109876543",
  
      serviceType: "Chemotherapy",
      serviceStartDate: "2024-10-15",
      cptCodes: "96413",
      icdCodes: "C34.90",
      summaryMedicalNeed: "Chemotherapy needed for stage II non-small cell lung cancer.",
      reasonsRequestedMedication: "Treat and manage lung cancer progression.",
    }
  ]);

  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuccessfulGeneration = (data: any) => {
    setFormData(data);
    closeModal();
    setActiveTab('new-request');
    setAlertMessage('Prior auth form successfully generated!');
    setShowAlert(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRequestUpdate = (id: string) => {
    setAlertMessage('Update request sent to insurance provider.');
    setShowAlert(true);
    // add insurance company bump logic
  };

  const handleNewRequestSubmit = (newRequest: AuthRequest) => {
    setRequests(prevRequests => [...prevRequests, newRequest]);
    setActiveTab('active-requests');
    setAlertMessage('Request successfully submitted!');
    setShowAlert(true);
  };

  const handleBackToRequests = () => {
    setSelectedRequestId(null);
    setActiveTab('active-requests');
  };

  const handleBackToDash = () => {
    setSelectedRequestId(null);
    setActiveTab('dashboard');
  };

  const handleSelectRequest = (id: string) => {
    setSelectedRequestId(id);
    setActiveTab('request-details');
  };

  const handleUpdateRequest = (updatedRequest: AuthRequest) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
  };
  
  const handleEHRChange = () => {
    setActiveTab('ehr-setting');
  }

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    } 

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          requests={requests}
          onSelectRequest={handleSelectRequest}
          onRequestUpdate={handleRequestUpdate}
          setActiveTab={handleEHRChange}
        />;
      case 'ehr-setting':
        return <EHRConfigPage onBack={handleBackToDash}/>;
      case 'new-request':
        return <PriorAuthForm initialData={formData} onSubmit={handleNewRequestSubmit}/>;
      case 'active-requests':
        return <ActiveRequests 
          requests={requests} 
          onSelectRequest={handleSelectRequest} 
          onRequestUpdate={handleRequestUpdate}
        />;
      case 'request-details':
        const selectedRequest = requests.find((request) => request.id === selectedRequestId);
        if (!selectedRequest) {
          return <div className="text-black">Request not found.</div>;
        }
        return (
          <RequestDetails
            request={selectedRequest}
            onBack={handleBackToRequests}
            onUpdate={handleUpdateRequest}
            onRequestUpdate={handleRequestUpdate}
          />
        );
      case 'settings':
        return <div className="text-black">Settings content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      {isLoggedIn && (
        <div className="flex-1 flex flex-col">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} openModal={openModal} />
          <main className="flex-1 p-8 overflow-auto">
            <h2 className="text-2xl font-semibold text-black mb-6">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </h2>
            {renderContent()}
          </main>
        </div>
      )}
      {!isLoggedIn && renderContent()}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-semibold text-black mb-4">New Request</h2>
        <AICommandInput onSuccess={handleSuccessfulGeneration} requests={patients} />
      </Modal>
      {showAlert && (
        <SuccessAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default PriorAuthRequestApp;