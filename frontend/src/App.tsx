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
      setResult(data.content || 'Request generated successfully.');
      
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


const ActiveRequests: React.FC = () => {
  const [requests] = useState<AuthRequest[]>([
    { id: '1', patient: 'Jane Doe', service: 'PET/CT skull thigh', status: 'pending', date: '2024-10-11' },
    { id: '2', patient: 'John Smith', service: 'MRI lower back', status: 'approved', date: '2024-10-10' },
    { id: '3', patient: 'Alice Johnson', service: 'Chest X-ray', status: 'denied', date: '2024-10-09' },
    { id: '4', patient: 'Bob Williams', service: 'Ultrasound abdomen', status: 'pending', date: '2024-10-08' }
  ]);

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

const PriorAuthForm = () => {
  const [formData, setFormData] = useState({
    // Patient Information
    patientName: '',
    patientDOB: '',
    patientGender: '',
    patientAddress: '',
    patientCity: '',
    patientState: '',
    patientZip: '',
    patientPhone: '',
    patientEmail: '',
    patientInsuranceId: '',
    
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
    
    // Patient Diagnosis
    diagnosisICD10: '',
    diagnosisDate: '',
    
    // Patient Medical Records
    diagnosticTestResults: '',
    imagingResults: '',
    
    // Patient History
    previousTreatments: '',
    treatmentResponse: '',
    recentSymptoms: '',
    currentCondition: '',
    
    // Physician Opinion
    physicianPrognosis: '',
    diseaseProgression: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add logic here to handle form submission
  };

  return (
    <Card >

        

      <CardHeader>
        <CardTitle>Comprehensive Prior Authorization Request Form</CardTitle>
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
                <label htmlFor="patientPhone" className="block text-sm font-medium mb-1">Phone</label>
                <Input name="patientPhone" value={formData.patientPhone} onChange={handleInputChange} required />
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
              <div>
                <label htmlFor="serviceStartDate" className="block text-sm font-medium mb-1">Service Start Date</label>
                <Input name="serviceStartDate" type="date" value={formData.serviceStartDate} onChange={handleInputChange} required />
              </div>
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
                className="bg-blue-200 shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
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
                className="bg-blue-200 shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>

          {/* Add remaining sections (Patient Diagnosis, Patient Medical Records, Patient History, Physician Opinion) following the same pattern */}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Please ensure all information is accurate and complete before submission. Inaccurate or incomplete information may delay the authorization process.
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full">Submit Comprehensive Prior Authorization Request</Button>
        </form>
      </CardContent>

    </Card>
  );
};
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
      case 'new-request':
        return <PriorAuthForm />;
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