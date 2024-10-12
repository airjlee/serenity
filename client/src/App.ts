import React, { useState } from 'react';
import { AlertCircle, Check, Loader2, FileText, Settings, List, Home, Bell, Search, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AuthRequest {
  id: string;
  patient: string;
  service: string;
  status: 'pending' | 'approved' | 'denied';
  date: string;
}

const AICommandInput: React.FC = () => {
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
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="/req [service] for [patient]"
          className="flex-grow"
        />
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
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
  ]);

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle>{request.patient}</CardTitle>
              <CardDescription>{request.service}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {request.status}</p>
              <p>Date: {request.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

const Header: React.FC = () => (
  <header className="bg-white border-b p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4 flex-1 max-w-xl">
      <Search className="h-5 w-5 text-gray-400" />
      <Input
        placeholder="Search..."
        className="flex-1"
      />
    </div>
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
    </div>
  </header>
);

const PriorAuthRequestApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div>Dashboard content goes here</div>;
      case 'new-request':
        return <AICommandInput />;
      case 'active-requests':
        return <ActiveRequests />;
      case 'settings':
        return <div>Settings content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">AuthAI</h1>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'new-request', icon: FileText, label: 'New Request' },
            { id: 'active-requests', icon: List, label: 'Active Requests' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
          </h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PriorAuthRequestApp;