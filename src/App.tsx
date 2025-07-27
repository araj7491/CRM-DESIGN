import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Menu,
  X,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  BarChart3,
  Users,
  Building,
  Phone,
  HeartHandshake,
  FileText,
  ShoppingCart,
  Package,
  Home,
  TrendingUp,
  Clock,
  Target,

  Settings,
  Bell,
  User,
  ChevronDown,
  UserPlus,
  Building2,
  FileText as QuoteIcon,
  ShoppingBag,
  Square,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Activity,
  MessageCircle,
  CheckSquare,
  Calendar as CalendarIcon,
  Mail as MailIcon,
  FileText as FileIcon,
  MoreVertical,
} from 'lucide-react';
import LeadsTable from './components/LeadsTable';
import LeadDetails from './components/LeadDetails';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCreateLeadPage, setShowCreateLeadPage] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [expandedWidgets, setExpandedWidgets] = useState<{ [key: string]: boolean }>({
    activities: true,
    notes: true,
    tasks: true,
    emails: false,
    meetings: false,
  });

  const toggleWidget = (widgetId: string) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  const handleSelectLead = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleActionMenuClick = (leadId: number) => {
    setShowActionMenu(showActionMenu === leadId ? null : leadId);
  };

  const handleActionClick = (action: string, lead: any) => {
    setShowActionMenu(null);
    switch (action) {
      case 'view':
        handleLeadClick(lead);
        break;
      case 'edit':
        // Handle edit action
        break;
      case 'delete':
        // Handle delete action
        break;
      default:
        break;
    }
  };

  const handleSortOption = (sortType: string) => {
    setShowSortMenu(false);
    switch (sortType) {
      case 'name-asc':
        setSortField('name');
        setSortDirection('asc');
        break;
      case 'name-desc':
        setSortField('name');
        setSortDirection('desc');
        break;
      case 'company-asc':
        setSortField('company');
        setSortDirection('asc');
        break;
      case 'company-desc':
        setSortField('company');
        setSortDirection('desc');
        break;
      case 'value-asc':
        setSortField('value');
        setSortDirection('asc');
        break;
      case 'value-desc':
        setSortField('value');
        setSortDirection('desc');
        break;
      case 'status-asc':
        setSortField('status');
        setSortDirection('asc');
        break;
      case 'status-desc':
        setSortField('status');
        setSortDirection('desc');
        break;
      case 'date-asc':
        setSortField('created');
        setSortDirection('asc');
        break;
      case 'date-desc':
        setSortField('created');
        setSortDirection('desc');
        break;
      default:
        break;
    }
  };

  // Sample data for demonstration
  const [leads, setLeads] = useState([
    { id: 1, name: 'John Smith', company: 'Tech Corp', email: 'john@techcorp.com', phone: '+1-555-0123', status: 'New', value: 5000, source: 'Website', created: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', company: 'Innovation Labs', email: 'sarah@innovlabs.com', phone: '+1-555-0124', status: 'Qualified', value: 12000, source: 'Referral', created: '2024-01-14' },
    { id: 3, name: 'Mike Davis', company: 'StartupXYZ', email: 'mike@startupxyz.com', phone: '+1-555-0125', status: 'Contacted', value: 8500, source: 'LinkedIn', created: '2024-01-13' },
    { id: 4, name: 'Emma Wilson', company: 'Global Solutions', email: 'emma@globalsol.com', phone: '+1-555-0126', status: 'Proposal', value: 25000, source: 'Cold Call', created: '2024-01-12' },
    { id: 5, name: 'James Brown', company: 'Digital Agency', email: 'james@digitalag.com', phone: '+1-555-0127', status: 'Negotiation', value: 18000, source: 'Website', created: '2024-01-11' },
    { id: 6, name: 'Linda Green', company: 'Eco Ventures', email: 'linda@ecoventures.com', phone: '+1-555-0128', status: 'New', value: 7000, source: 'Email Campaign', created: '2024-01-10' },
    { id: 7, name: 'Robert White', company: 'FinTech Ltd', email: 'robert@fintech.com', phone: '+1-555-0129', status: 'Qualified', value: 15000, source: 'LinkedIn', created: '2024-01-09' },
    { id: 8, name: 'Jessica Blue', company: 'Blue Ocean', email: 'jessica@blueocean.com', phone: '+1-555-0130', status: 'Contacted', value: 9500, source: 'Website', created: '2024-01-08' },
    { id: 9, name: 'David Black', company: 'Blackstone', email: 'david@blackstone.com', phone: '+1-555-0131', status: 'Proposal', value: 30000, source: 'Referral', created: '2024-01-07' },
    { id: 10, name: 'Sophia Red', company: 'Red Solutions', email: 'sophia@redsolutions.com', phone: '+1-555-0132', status: 'Negotiation', value: 22000, source: 'Cold Call', created: '2024-01-06' },
    { id: 11, name: 'Chris Yellow', company: 'Yellow Brick', email: 'chris@yellowbrick.com', phone: '+1-555-0133', status: 'New', value: 4000, source: 'Trade Show', created: '2024-01-05' },
    { id: 12, name: 'Patricia Purple', company: 'Purple Inc', email: 'patricia@purpleinc.com', phone: '+1-555-0134', status: 'Qualified', value: 17000, source: 'Website', created: '2024-01-04' },
    { id: 13, name: 'George Orange', company: 'Orange Tech', email: 'george@orangetech.com', phone: '+1-555-0135', status: 'Contacted', value: 12000, source: 'LinkedIn', created: '2024-01-03' },
    { id: 14, name: 'Helen Brown', company: 'Brownies', email: 'helen@brownies.com', phone: '+1-555-0136', status: 'Proposal', value: 27000, source: 'Referral', created: '2024-01-02' },
    { id: 15, name: 'Frank Silver', company: 'Silverline', email: 'frank@silverline.com', phone: '+1-555-0137', status: 'Negotiation', value: 19500, source: 'Website', created: '2024-01-01' },
  ]);

  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    value: '',
    source: '',
  });

  const [createLeadForm, setCreateLeadForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    status: 'New',
    value: '',
    source: '',
    industry: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    description: '',
    notes: '',
    assignedTo: '',
    priority: 'Medium',
    tags: '',
  });

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: Building },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'deals', label: 'Deals', icon: HeartHandshake },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
  ];

  // Chart data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['New', 'Qualified', 'Proposal', 'Won', 'Lost'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Leads Generated',
        data: [12, 19, 15, 25],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
    ],
  };

  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Handle form submission
  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = {
      id: leads.length + 1,
      ...newLead,
      value: parseInt(newLead.value) || 0,
      created: new Date().toISOString().split('T')[0],
    };
    setLeads([...leads, lead]);
    setNewLead({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'New',
      value: '',
      source: '',
    });
    setShowLeadModal(false);
  };

  // Handle comprehensive lead form submission
  const handleSubmitCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = {
      id: leads.length + 1,
      name: `${createLeadForm.firstName} ${createLeadForm.lastName}`,
      company: createLeadForm.company,
      email: createLeadForm.email,
      phone: createLeadForm.phone,
      status: createLeadForm.status,
      value: parseInt(createLeadForm.value) || 0,
      source: createLeadForm.source,
      created: new Date().toISOString().split('T')[0],
    };
    setLeads([...leads, lead]);
    setCreateLeadForm({
      firstName: '',
      lastName: '',
      company: '',
      jobTitle: '',
      email: '',
      phone: '',
      mobile: '',
      website: '',
      status: 'New',
      value: '',
      source: '',
      industry: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      description: '',
      notes: '',
      assignedTo: '',
      priority: 'Medium',
      tags: '',
    });
    setShowCreateLeadPage(false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleBackToLeads = () => {
    setShowLeadDetails(false);
    setSelectedLead(null);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      fontFamily: '"Inter", sans-serif',
      backgroundColor: '#ffffff',
      position: 'relative' as const,
    },
    mainLayout: {
      display: 'flex',
      marginLeft: sidebarCollapsed ? '50px' : '280px',
      marginTop: '73px', // Height of header
      height: 'calc(100vh - 73px)',
      transition: 'margin-left 0.3s ease',
    },
    sidebar: {
      position: 'fixed' as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: sidebarCollapsed ? '50px' : '280px',
      backgroundColor: '#1e40af',
      color: 'white',
      transition: 'width 0.3s ease',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: sidebarCollapsed ? 'center' : 'stretch',
      height: '100vh',
      zIndex: 90,
    },
    sidebarHeader: {
      padding: sidebarCollapsed ? '8px 0' : '16px',
      borderBottom: sidebarCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: sidebarCollapsed ? 'center' : 'space-between',
      gap: '8px',
    },
    logo: {
      display: sidebarCollapsed ? 'none' : 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    logoImg: {
      width: sidebarCollapsed ? '24px' : '32px',
      height: sidebarCollapsed ? '24px' : '32px',
      display: sidebarCollapsed ? 'none' : 'block',
    },
    logoText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      display: sidebarCollapsed ? 'none' : 'block',
      letterSpacing: '0.5px',
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: sidebarCollapsed ? '8px 0' : '6px',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
      width: sidebarCollapsed ? '34px' : 'auto',
      height: sidebarCollapsed ? '34px' : 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    navList: {
      listStyle: 'none',
      padding: sidebarCollapsed ? '4px 0' : '16px 0',
      margin: 0,
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as React.CSSProperties['flexDirection'],
      alignItems: 'center' as React.CSSProperties['alignItems'],
    },
    navItem: {
      margin: sidebarCollapsed ? '1px 0' : '4px 0',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
      padding: sidebarCollapsed ? '8px 0' : '10px 16px',
      color: 'white',
      textDecoration: 'none',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      width: sidebarCollapsed ? '34px' : '100%',
      height: sidebarCollapsed ? '34px' : '48px',
      fontSize: '14px',
    },
    navLinkActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    navIcon: {
      marginRight: sidebarCollapsed ? '0' : '12px',
      minWidth: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
    },
    navText: {
      display: sidebarCollapsed ? 'none' : 'block',
    },
    sidebarFooter: {
      padding: sidebarCollapsed ? '8px' : '16px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      padding: sidebarCollapsed ? '6px' : '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
    },
    profileAvatar: {
      width: sidebarCollapsed ? '24px' : '32px',
      height: sidebarCollapsed ? '24px' : '32px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: sidebarCollapsed ? '0' : '12px',
    },
    profileInfo: {
      display: sidebarCollapsed ? 'none' : 'block',
      flex: 1,
    },
    profileName: {
      fontSize: '14px',
      fontWeight: '500',
      margin: 0,
    },
    profileRole: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.7)',
      margin: '2px 0 0 0',
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      width: '100%',
    },
    header: {
      backgroundColor: 'white',
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed' as const,
      top: 0,
      left: sidebarCollapsed ? '50px' : '280px',
      right: 0,
      zIndex: 80,
      transition: 'left 0.3s ease',
    },
    headerTitle: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
    },
    buttonSecondary: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    iconButton: {
      background: 'none',
      border: 'none',
      padding: '8px',
      borderRadius: '6px',
      cursor: 'pointer',
      color: '#6b7280',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      padding: '20px',
      overflow: 'auto',
      backgroundColor: '#f9fafb',
    },
    grid: {
      display: 'grid',
      gap: '16px',
      marginBottom: '20px',
    },
    gridCols4: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
    },
    metric: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '6px 0',
    },
    metricLabel: {
      fontSize: '13px',
      color: '#6b7280',
      margin: 0,
    },
    metricChange: {
      fontSize: '13px',
      fontWeight: '500',
      margin: '2px 0 0 0',
    },
    metricChangePositive: {
      color: '#10b981',
    },
    metricChangeNegative: {
      color: '#ef4444',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
    },
    tableHeaderCell: {
      padding: '8px 12px',
      textAlign: 'left' as const,
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      cursor: 'pointer',
      userSelect: 'none' as const,
    },
    tableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s',
    },
    tableCell: {
      padding: '8px 12px',
      fontSize: '13px',
      color: '#374151',
    },
    status: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block',
    },
    statusNew: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
    },
    statusQualified: {
      backgroundColor: '#d1fae5',
      color: '#047857',
    },
    statusContacted: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    statusProposal: {
      backgroundColor: '#ede9fe',
      color: '#7c3aed',
    },
    statusNegotiation: {
      backgroundColor: '#fed7d7',
      color: '#c53030',
    },
    tableControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      padding: '12px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    searchInput: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    modal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      color: '#6b7280',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
    },
    input: {
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      transition: 'border-color 0.2s',
    },
    formActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    formGridFull: {
      gridColumn: '1 / -1',
    },
    formSection: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
    },
    formSectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    backButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
    },
    actionButtons: {
      display: 'flex',
      gap: '6px',
    },
    tableActionButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '4px',
      color: '#6b7280',
      transition: 'color 0.2s, background-color 0.2s',
    },
    dropdownContainer: {
      position: 'relative' as const,
    },
    dropdownMenu: {
      position: 'absolute' as const,
      top: '100%',
      right: 0,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
      minWidth: '200px',
      zIndex: 1000,
      marginTop: '4px',
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      fontSize: '14px',
      color: '#374151',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left' as const,
    },
    rightSidebar: {
      width: rightSidebarCollapsed ? '0' : '320px',
      backgroundColor: '#f8f9fa',
      borderLeft: rightSidebarCollapsed ? 'none' : '1px solid #e5e7eb',
      transition: 'width 0.3s ease',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
      height: '100%',
      overflow: 'hidden',
    },
    rightSidebarHeader: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '64px',
    },
    rightSidebarTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      display: rightSidebarCollapsed ? 'none' : 'block',
    },
    rightSidebarContent: {
      flex: 1,
      overflow: 'auto',
      padding: rightSidebarCollapsed ? '8px' : '16px',
    },
    widget: {
      backgroundColor: 'white',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    },
    widgetHeader: {
      padding: '12px 16px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    widgetTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    widgetContent: {
      padding: '16px',
    },
    widgetEmpty: {
      padding: '24px 16px',
      textAlign: 'center' as const,
      color: '#6b7280',
      fontSize: '13px',
    },
    toggleRightSidebarButton: {
      position: 'absolute' as const,
      left: rightSidebarCollapsed ? '-32px' : '-1px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: rightSidebarCollapsed ? '6px' : '6px 0 0 6px',
      padding: '8px 4px',
      cursor: 'pointer',
      zIndex: 10,
      boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s',
    },
    activityItem: {
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '13px',
      color: '#374151',
    },
    activityTime: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '4px',
    },
    noteItem: {
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '6px',
      marginBottom: '8px',
      fontSize: '13px',
    },
    taskItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      padding: '8px 0',
      fontSize: '13px',
    },
    taskCheckbox: {
      marginTop: '2px',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      width: '100%',
      justifyContent: 'center',
    },
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New': return { ...styles.status, ...styles.statusNew };
      case 'Qualified': return { ...styles.status, ...styles.statusQualified };
      case 'Contacted': return { ...styles.status, ...styles.statusContacted };
      case 'Proposal': return { ...styles.status, ...styles.statusProposal };
      case 'Negotiation': return { ...styles.status, ...styles.statusNegotiation };
      default: return styles.status;
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <img src={process.env.PUBLIC_URL + '/logo_thumbnail.svg'} alt="Neura CRM Logo" style={styles.logoImg} />
            <span style={styles.logoText}>Neura CRM</span>
          </div>
          <button
            style={styles.toggleButton}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Menu size={20} />
          </button>
        </div>
        <ul style={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} style={styles.navItem}>
                <button
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  }}
                  onClick={() => setActiveSection(item.id)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={sidebarCollapsed ? 16 : 20} style={styles.navIcon} />
                  <span style={styles.navText}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        {/* Profile Section */}
        <div style={styles.sidebarFooter}>
          <div 
            style={styles.profileSection}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={styles.profileAvatar}>
              <User size={sidebarCollapsed ? 12 : 18} />
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>John Doe</div>
              <div style={styles.profileRole}>Admin</div>
            </div>
            <Settings size={sidebarCollapsed ? 12 : 16} style={{display: sidebarCollapsed ? 'none' : 'block'}} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={styles.headerTitle}>
            {navItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          {/* Back button for lead details */}
          {activeSection === 'leads' && showLeadDetails && selectedLead && (
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                color: '#475569',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
                width: 'fit-content'
              }}
              onClick={handleBackToLeads}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
            >
              <ArrowLeft size={14} />
              Back to Leads
            </button>
          )}
        </div>
        <div style={styles.headerActions}>
          <div style={styles.dropdownContainer}>
            <button
              style={styles.button}
              onClick={() => setShowQuickActions(!showQuickActions)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              <Plus size={16} />
              Quick Actions
              <ChevronDown size={14} />
            </button>
            {showQuickActions && (
              <div style={styles.dropdownMenu}>
                <button
                  style={styles.dropdownItem}
                  onClick={() => {
                    setShowLeadModal(true);
                    setShowQuickActions(false);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <UserPlus size={16} />
                  Create New Lead
                </button>
                <button
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <User size={16} />
                  Add New Contact
                </button>
                <button
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Building2 size={16} />
                  Add New Company
                </button>
                <button
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <HeartHandshake size={16} />
                  Create New Deal
                </button>
                <button
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <QuoteIcon size={16} />
                  Create Quote
                </button>
                <button
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <ShoppingBag size={16} />
                  Create Order
                </button>
              </div>
            )}
          </div>
          <button
            style={styles.iconButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <Bell size={16} />
          </button>
          <button
            style={styles.iconButton}
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            title={rightSidebarCollapsed ? "Expand widgets" : "Collapse widgets"}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            {rightSidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={styles.mainLayout}>

      {/* Main Content */}
      <div style={styles.main}>

        {/* Content */}
        <div style={styles.content}>
          {activeSection === 'dashboard' && (
            <>
              {/* Metrics Cards */}
              <div style={{...styles.grid, ...styles.gridCols4}}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <TrendingUp size={24} color="#3b82f6" />
                  </div>
                  <div style={styles.metric}>$127,540</div>
                  <div style={styles.metricLabel}>Total Revenue</div>
                  <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
                    +12.5% from last month
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <Users size={24} color="#10b981" />
                  </div>
                  <div style={styles.metric}>2,847</div>
                  <div style={styles.metricLabel}>Total Leads</div>
                  <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
                    +18.2% from last month
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <Target size={24} color="#f59e0b" />
                  </div>
                  <div style={styles.metric}>68%</div>
                  <div style={styles.metricLabel}>Conversion Rate</div>
                  <div style={{...styles.metricChange, ...styles.metricChangeNegative}}>
                    -3.1% from last month
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <Clock size={24} color="#8b5cf6" />
                  </div>
                  <div style={styles.metric}>2.4h</div>
                  <div style={styles.metricLabel}>Avg Response Time</div>
                  <div style={{...styles.metricChange, ...styles.metricChangePositive}}>
                    -0.3h from last month
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div style={{...styles.grid, ...styles.gridCols2}}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Revenue Analytics</h3>
                  </div>
                  <Bar
                    data={revenueData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: '#f3f4f6',
                          },
                          ticks: {
                            color: '#6b7280',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            color: '#6b7280',
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Lead Status Distribution</h3>
                  </div>
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            color: '#6b7280',
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Lead Generation Trend</h3>
                  </div>
                  <Line
                    data={lineData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: '#f3f4f6',
                          },
                          ticks: {
                            color: '#6b7280',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            color: '#6b7280',
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Pipeline Overview</h3>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6'}}></div>
                        <span style={{fontSize: '13px', color: '#374151'}}>New Leads</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>24</span>
                        <span style={{fontSize: '12px', color: '#10b981'}}>+12%</span>
                      </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b'}}></div>
                        <span style={{fontSize: '13px', color: '#374151'}}>Qualified</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>18</span>
                        <span style={{fontSize: '12px', color: '#10b981'}}>+8%</span>
                      </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6'}}></div>
                        <span style={{fontSize: '13px', color: '#374151'}}>Proposal</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>12</span>
                        <span style={{fontSize: '12px', color: '#ef4444'}}>-3%</span>
                      </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981'}}></div>
                        <span style={{fontSize: '13px', color: '#374151'}}>Won</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '16px', fontWeight: '600', color: '#1f2937'}}>8</span>
                        <span style={{fontSize: '12px', color: '#10b981'}}>+15%</span>
                      </div>
                    </div>
                    <div style={{marginTop: '8px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{fontSize: '12px', color: '#6b7280'}}>Conversion Rate</span>
                        <span style={{fontSize: '14px', fontWeight: '600', color: '#1f2937'}}>68.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Leads Section */}
          {activeSection === 'leads' && !showCreateLeadPage && !showLeadDetails && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Leads Management</h3>
                <button
                  style={styles.button}
                  onClick={() => setShowCreateLeadPage(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  <Plus size={16} />
                  Create New Lead
                </button>
                </div>

                {/* Table Controls */}
                <div style={styles.tableControls}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Search size={16} color="#6b7280" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={styles.searchInput}
                    />
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Filter size={16} color="#6b7280" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={styles.select}
                    >
                      <option value="all">All Status</option>
                      <option value="New">New</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                    </select>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', position: 'relative'}}>
                    <ArrowUpDown size={16} color="#6b7280" />
                    <button
                      style={{
                        ...styles.select,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                      }}
                      onClick={() => setShowSortMenu(!showSortMenu)}
                    >
                      Sort
                      <ChevronDown size={14} />
                    </button>
                    {showSortMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #e5e7eb',
                        minWidth: '200px',
                        zIndex: 1000,
                        marginTop: '4px',
                      }}>
                        <div style={{padding: '8px 16px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb'}}>
                          Sort by Name
                        </div>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('name-asc')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          A to Z
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('name-desc')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          Z to A
                        </button>
                        <div style={{padding: '8px 16px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb'}}>
                          Sort by Company
                        </div>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('company-asc')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          A to Z
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('company-desc')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          Z to A
                        </button>
                        <div style={{padding: '8px 16px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb'}}>
                          Sort by Value
                        </div>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('value-asc')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                          Low to High
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('value-desc')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          High to Low
                        </button>
                        <div style={{padding: '8px 16px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb'}}>
                          Sort by Status
                          </div>
                            <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('status-asc')}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                          A to Z
                            </button>
                            <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('status-desc')}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                          Z to A
                            </button>
                        <div style={{padding: '8px 16px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb'}}>
                          Sort by Date
                        </div>
                            <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('date-asc')}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          Oldest First
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            backgroundColor: 'transparent',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onClick={() => handleSortOption('date-desc')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          Newest First
                            </button>
                          </div>
                    )}
              </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto'}}>
                    <div style={{
                      display: 'flex',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          backgroundColor: viewMode === 'list' ? '#3b82f6' : '#f3f4f6',
                          color: viewMode === 'list' ? 'white' : '#6b7280',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => setViewMode('list')}
                        title="List View"
                      >
                        <BarChart3 size={16} />
                      </button>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          backgroundColor: viewMode === 'kanban' ? '#3b82f6' : '#f3f4f6',
                          color: viewMode === 'kanban' ? 'white' : '#6b7280',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => setViewMode('kanban')}
                        title="Kanban View"
                      >
                        <Square size={16} />
                      </button>
                    </div>
                </div>
              </div>

              <LeadsTable
                leads={filteredLeads}
                selectedLeads={selectedLeads}
                showActionMenu={showActionMenu}
                onSelectLead={handleSelectLead}
                onSelectAllLeads={handleSelectAllLeads}
                onActionMenuClick={handleActionMenuClick}
                onActionClick={handleActionClick}
                onLeadClick={handleLeadClick}
                onSort={handleSort}
                getStatusStyle={getStatusStyle}
                styles={styles}
              />
              </div>
          )}

          {/* Create Lead Page */}
          {activeSection === 'leads' && showCreateLeadPage && (
            <div style={styles.card}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '16px',
                marginBottom: '24px',
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#111',
                  margin: 0,
                  letterSpacing: '0.5px',
                }}>Create New Lead</h2>
                <button
                  style={styles.backButton}
                  onClick={() => setShowCreateLeadPage(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to Leads
                </button>
              </div>

              <form style={styles.form} onSubmit={handleSubmitCreateLead}>
                {/* Basic Information Section */}
                <div style={styles.formSection}>
                  <h4 style={styles.formSectionTitle}>
                    <User size={20} />
                    Basic Information
                  </h4>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>First Name *</label>
                  <input
                    type="text"
                        required
                        value={createLeadForm.firstName}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, firstName: e.target.value})}
                        style={styles.input}
                        placeholder="Enter first name"
                  />
                </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Last Name *</label>
                      <input
                        type="text"
                        required
                        value={createLeadForm.lastName}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, lastName: e.target.value})}
                        style={styles.input}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Company *</label>
                      <input
                        type="text"
                        required
                        value={createLeadForm.company}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, company: e.target.value})}
                        style={styles.input}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Job Title</label>
                      <input
                        type="text"
                        value={createLeadForm.jobTitle}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, jobTitle: e.target.value})}
                        style={styles.input}
                        placeholder="Enter job title"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div style={styles.formSection}>
                  <h4 style={styles.formSectionTitle}>
                    <Phone size={20} />
                    Contact Information
                  </h4>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email *</label>
                      <input
                        type="email"
                        required
                        value={createLeadForm.email}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, email: e.target.value})}
                        style={styles.input}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Phone</label>
                      <input
                        type="tel"
                        value={createLeadForm.phone}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, phone: e.target.value})}
                        style={styles.input}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Mobile</label>
                      <input
                        type="tel"
                        value={createLeadForm.mobile}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, mobile: e.target.value})}
                        style={styles.input}
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Website</label>
                      <input
                        type="url"
                        value={createLeadForm.website}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, website: e.target.value})}
                        style={styles.input}
                        placeholder="Enter website URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Lead Details Section */}
                <div style={styles.formSection}>
                  <h4 style={styles.formSectionTitle}>
                    <Target size={20} />
                    Lead Details
                  </h4>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Status</label>
                  <select
                        value={createLeadForm.status}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, status: e.target.value})}
                    style={styles.select}
                  >
                    <option value="New">New</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                  </select>
                </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Estimated Value</label>
                      <input
                        type="number"
                        value={createLeadForm.value}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, value: e.target.value})}
                        style={styles.input}
                        placeholder="Enter estimated value"
                      />
              </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Source</label>
                      <select
                        value={createLeadForm.source}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, source: e.target.value})}
                        style={styles.select}
                      >
                        <option value="">Select source</option>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Email Campaign">Email Campaign</option>
                        <option value="Trade Show">Trade Show</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Advertisement">Advertisement</option>
                      </select>
                      </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Industry</label>
                      <select
                        value={createLeadForm.industry}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, industry: e.target.value})}
                        style={styles.select}
                      >
                        <option value="">Select industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Other">Other</option>
                      </select>
                      </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Priority</label>
                      <select
                        value={createLeadForm.priority}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, priority: e.target.value})}
                        style={styles.select}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                      </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Assigned To</label>
                      <input
                        type="text"
                        value={createLeadForm.assignedTo}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, assignedTo: e.target.value})}
                        style={styles.input}
                        placeholder="Enter assigned person"
                      />
                      </div>
                      </div>
                </div>

                {/* Address Section */}
                <div style={styles.formSection}>
                  <h4 style={styles.formSectionTitle}>
                    <Building size={20} />
                    Address Information
                  </h4>
                  <div style={styles.formGrid}>
                    <div style={{...styles.formGroup, ...styles.formGridFull}}>
                      <label style={styles.label}>Street Address</label>
                      <input
                        type="text"
                        value={createLeadForm.address}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, address: e.target.value})}
                        style={styles.input}
                        placeholder="Enter street address"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>City</label>
                      <input
                        type="text"
                        value={createLeadForm.city}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, city: e.target.value})}
                        style={styles.input}
                        placeholder="Enter city"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>State/Province</label>
                      <input
                        type="text"
                        value={createLeadForm.state}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, state: e.target.value})}
                        style={styles.input}
                        placeholder="Enter state/province"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>ZIP/Postal Code</label>
                      <input
                        type="text"
                        value={createLeadForm.zipCode}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, zipCode: e.target.value})}
                        style={styles.input}
                        placeholder="Enter ZIP/postal code"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Country</label>
                      <input
                        type="text"
                        value={createLeadForm.country}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, country: e.target.value})}
                        style={styles.input}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div style={styles.formSection}>
                  <h4 style={styles.formSectionTitle}>
                    <FileText size={20} />
                    Additional Information
                  </h4>
                  <div style={styles.formGrid}>
                    <div style={{...styles.formGroup, ...styles.formGridFull}}>
                      <label style={styles.label}>Description</label>
                      <textarea
                        value={createLeadForm.description}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, description: e.target.value})}
                        style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                        placeholder="Enter lead description"
                      />
                    </div>
                    <div style={{...styles.formGroup, ...styles.formGridFull}}>
                      <label style={styles.label}>Notes</label>
                      <textarea
                        value={createLeadForm.notes}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, notes: e.target.value})}
                        style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                        placeholder="Enter additional notes"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Tags</label>
                      <input
                        type="text"
                        value={createLeadForm.tags}
                        onChange={(e) => setCreateLeadForm({...createLeadForm, tags: e.target.value})}
                        style={styles.input}
                        placeholder="Enter tags (comma separated)"
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.formActions}>
                  <button
                    type="button"
                    style={{...styles.button, ...styles.buttonSecondary}}
                    onClick={() => setShowCreateLeadPage(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.button}>
                    Create New Lead
                  </button>
                        </div>
              </form>
                        </div>
          )}

          {/* Lead Details Page */}
          {activeSection === 'leads' && showLeadDetails && selectedLead && (
            <LeadDetails
              lead={selectedLead}
              onBack={handleBackToLeads}
              onSave={(updatedLead) => {
                setLeads(leads.map(lead => 
                  lead.id === updatedLead.id ? updatedLead : lead
                ));
                setSelectedLead(updatedLead);
              }}
            />
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'dashboard' && activeSection !== 'leads' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                {navItems.find(item => item.id === activeSection)?.label} Section
              </h3>
              <p style={{color: '#6b7280', margin: '16px 0'}}>
                This section is ready for your content. You can implement the specific functionality for {' '}
                {navItems.find(item => item.id === activeSection)?.label.toLowerCase()} here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Lead Modal */}
      {showLeadModal && (
        <div style={styles.modal} onClick={() => setShowLeadModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Lead</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowLeadModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form style={styles.form} onSubmit={handleSubmitLead}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  style={styles.input}
                  placeholder="Enter full name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Company *</label>
                <input
                  type="text"
                  required
                  value={newLead.company}
                  onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  style={styles.input}
                  placeholder="Enter company name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  required
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  style={styles.input}
                  placeholder="Enter email address"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  style={styles.input}
                  placeholder="Enter phone number"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  value={newLead.status}
                  onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                  style={styles.select}
                >
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Estimated Value</label>
                <input
                  type="number"
                  value={newLead.value}
                  onChange={(e) => setNewLead({...newLead, value: e.target.value})}
                  style={styles.input}
                  placeholder="Enter estimated value"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Source</label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                  style={styles.select}
                >
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Email Campaign">Email Campaign</option>
                  <option value="Trade Show">Trade Show</option>
                </select>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  style={{...styles.button, ...styles.buttonSecondary}}
                  onClick={() => setShowLeadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.button}>
                  Create New Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Right Sidebar */}
        <div style={styles.rightSidebar}>
        {/* Toggle Button */}
        <button
          style={styles.toggleRightSidebarButton}
          onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%)';
          }}
        >
          {rightSidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Header */}
        <div style={styles.rightSidebarHeader}>
          <h3 style={styles.rightSidebarTitle}>Widgets</h3>
          {!rightSidebarCollapsed && (
            <button
              style={styles.iconButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <MoreVertical size={16} />
            </button>
          )}
        </div>

        {/* Content */}
        <div style={styles.rightSidebarContent}>
          {/* Activities Widget */}
          <div style={styles.widget}>
            <div 
              style={styles.widgetHeader}
              onClick={() => toggleWidget('activities')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={styles.widgetTitle}>
                <Activity size={16} />
                {!rightSidebarCollapsed && 'Recent Activities'}
              </div>
              {!rightSidebarCollapsed && (
                <ChevronDown 
                  size={16} 
                  style={{
                    transform: expandedWidgets.activities ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              )}
            </div>
            {expandedWidgets.activities && !rightSidebarCollapsed && (
              <div style={styles.widgetContent}>
                <div style={styles.activityItem}>
                  <div style={styles.activityTime}>2 hours ago</div>
                  <div>Call scheduled with John Smith</div>
                </div>
                <div style={styles.activityItem}>
                  <div style={styles.activityTime}>5 hours ago</div>
                  <div>Email sent to Tech Corp</div>
                </div>
                <div style={styles.activityItem}>
                  <div style={styles.activityTime}>Yesterday</div>
                  <div>Meeting completed with Sarah Johnson</div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Widget */}
          <div style={styles.widget}>
            <div 
              style={styles.widgetHeader}
              onClick={() => toggleWidget('notes')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={styles.widgetTitle}>
                <MessageCircle size={16} />
                {!rightSidebarCollapsed && 'Notes'}
              </div>
              {!rightSidebarCollapsed && (
                <ChevronDown 
                  size={16} 
                  style={{
                    transform: expandedWidgets.notes ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              )}
            </div>
            {expandedWidgets.notes && !rightSidebarCollapsed && (
              <div style={styles.widgetContent}>
                <div style={styles.noteItem}>
                  <strong>Important:</strong> Follow up on Tech Corp proposal by Friday
                </div>
                <div style={styles.noteItem}>
                  Customer interested in premium features, schedule demo
                </div>
                <button 
                  style={styles.addButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  <Plus size={14} />
                  Add Note
                </button>
              </div>
            )}
          </div>

          {/* Tasks Widget */}
          <div style={styles.widget}>
            <div 
              style={styles.widgetHeader}
              onClick={() => toggleWidget('tasks')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={styles.widgetTitle}>
                <CheckSquare size={16} />
                {!rightSidebarCollapsed && 'Tasks'}
              </div>
              {!rightSidebarCollapsed && (
                <ChevronDown 
                  size={16} 
                  style={{
                    transform: expandedWidgets.tasks ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              )}
            </div>
            {expandedWidgets.tasks && !rightSidebarCollapsed && (
              <div style={styles.widgetContent}>
                <div style={styles.taskItem}>
                  <input type="checkbox" style={styles.taskCheckbox} />
                  <div>
                    <div>Review Q4 sales report</div>
                    <div style={{fontSize: '12px', color: '#6b7280'}}>Due tomorrow</div>
                  </div>
                </div>
                <div style={styles.taskItem}>
                  <input type="checkbox" style={styles.taskCheckbox} />
                  <div>
                    <div>Prepare presentation for board meeting</div>
                    <div style={{fontSize: '12px', color: '#6b7280'}}>Due in 3 days</div>
                  </div>
                </div>
                <div style={styles.taskItem}>
                  <input type="checkbox" checked style={styles.taskCheckbox} />
                  <div style={{textDecoration: 'line-through', color: '#9ca3af'}}>
                    <div>Send follow-up emails</div>
                    <div style={{fontSize: '12px'}}>Completed</div>
                  </div>
                </div>
                <button 
                  style={{...styles.addButton, marginTop: '8px'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  <Plus size={14} />
                  Add Task
                </button>
              </div>
            )}
          </div>

          {/* Emails Widget */}
          <div style={styles.widget}>
            <div 
              style={styles.widgetHeader}
              onClick={() => toggleWidget('emails')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={styles.widgetTitle}>
                <MailIcon size={16} />
                {!rightSidebarCollapsed && 'Recent Emails'}
              </div>
              {!rightSidebarCollapsed && (
                <ChevronDown 
                  size={16} 
                  style={{
                    transform: expandedWidgets.emails ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              )}
            </div>
            {expandedWidgets.emails && !rightSidebarCollapsed && (
              <div style={styles.widgetEmpty}>
                No recent emails
              </div>
            )}
          </div>

          {/* Meetings Widget */}
          <div style={styles.widget}>
            <div 
              style={styles.widgetHeader}
              onClick={() => toggleWidget('meetings')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={styles.widgetTitle}>
                <CalendarIcon size={16} />
                {!rightSidebarCollapsed && 'Upcoming Meetings'}
              </div>
              {!rightSidebarCollapsed && (
                <ChevronDown 
                  size={16} 
                  style={{
                    transform: expandedWidgets.meetings ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              )}
            </div>
            {expandedWidgets.meetings && !rightSidebarCollapsed && (
              <div style={styles.widgetContent}>
                <div style={styles.activityItem}>
                  <div style={{fontWeight: '500'}}>Product Demo</div>
                  <div style={styles.activityTime}>Tomorrow at 2:00 PM</div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>With Innovation Labs team</div>
                </div>
                <div style={styles.activityItem}>
                  <div style={{fontWeight: '500'}}>Sales Review</div>
                  <div style={styles.activityTime}>Friday at 10:00 AM</div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Internal meeting</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Click outside to close dropdown */}
      {showQuickActions && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setShowQuickActions(false)}
        />
      )}
    </div>
  );
};

export default App; 