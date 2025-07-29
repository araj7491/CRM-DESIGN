import React, { useState, useCallback } from 'react';
import { 
  Building, 
  User, 
  CheckCircle,
  Paperclip,
  Clock,
  UserPlus,
  Plus,
  Calendar,
  ArrowUpDown,
  X,
  Upload,
  Edit2,
  Check,
  Phone,
  Mail,
  FileText,
  UserCheck,
  Video,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Image,
  Maximize2,
  HeartHandshake
} from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  account: string;
  email: string;
  phone: string;
  owner: string;
  created: string;
}

interface ContactDetailsProps {
  contact: Contact;
  onBack: () => void;
  onSave: (updatedContact: Contact) => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact, onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);
  
  // Task management state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Schedule check-in call',
      description: 'Regular check-in with contact to maintain relationship',
      deadline: '2024-01-25',
      priority: 'medium',
      status: 'pending',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Send quarterly newsletter',
      description: 'Include latest product updates and company news',
      deadline: '2024-02-01',
      priority: 'low',
      status: 'pending',
      createdDate: '2024-01-14'
    },
    {
      id: 3,
      title: 'Birthday greeting',
      description: 'Send personalized birthday wishes',
      deadline: '2024-01-30',
      priority: 'high',
      status: 'completed',
      createdDate: '2024-01-12'
    }
  ]);
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium'
  });
  
  const [taskSortBy, setTaskSortBy] = useState('deadline');
  const [taskSortDirection, setTaskSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showLogEmailModal, setShowLogEmailModal] = useState(false);
  const [showCreateEmailModal, setShowCreateEmailModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState({
    'First Name': 'John',
    'Last Name': 'Smith',
    'Email': 'john.smith@techcorp.com',
    'Phone': '+1-555-0123',
    'Title': 'CEO',
    'Company Name': 'Tech Corp',
    'Industry': 'Technology',
    'Website': 'www.techcorp.com',
    'No. of Employees': '50-100',
    'Address Line 1 (Street Address)': '123 Business Avenue',
    'Address Line 2 (Area, Street, Sector, Village)': 'Downtown Business District',
    'Landmark (optional)': 'Near Central Park',
    'City': 'New York',
    'State': 'NY',
    'Country': 'United States',
    'Postal Index': '10001',
    'Description': 'High-potential contact from technology sector. Interested in enterprise solutions and has budget approval authority. Previous interactions have been positive and they\'ve expressed strong interest in our services.'
  });
  
  // Email form states
  const [logEmailForm, setLogEmailForm] = useState({
    subject: '',
    body: '',
    sentDate: new Date().toISOString().split('T')[0],
    type: 'outbound'
  });
  
  const [createEmailForm, setCreateEmailForm] = useState({
    to: contact.email,
    subject: '',
    body: '',
    createTask: false,
    taskType: 'Follow Up'
  });

  // Pipeline/relationship stages for contacts
  const relationshipStages = [
    { id: 'Cold', label: 'Cold', number: 1 },
    { id: 'Warm', label: 'Warm', number: 2 },
    { id: 'Hot', label: 'Hot', number: 3 },
    { id: 'Active', label: 'Active', number: 4 },
    { id: 'Champion', label: 'Champion', number: 5 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'emails', label: 'E-mails', icon: Mail },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'opportunities', label: 'Opportunities', icon: HeartHandshake },
    { id: 'attachments', label: 'Attachments', icon: Paperclip }
  ];

  const [currentStage, setCurrentStage] = useState('Warm');

  const handleStageChange = (stage: string) => {
    setCurrentStage(stage);
  };

  const getCurrentStageIndex = () => {
    return relationshipStages.findIndex(stage => stage.id === currentStage);
  };

  const getStageStatus = (stage: any, index: number) => {
    const currentIndex = getCurrentStageIndex();
    return {
      completed: index < currentIndex,
      active: index === currentIndex,
      inactive: index > currentIndex
    };
  };

  // Task handler functions
  const handleTaskFormChange = (field: string, value: string) => {
    setTaskForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: taskForm.title,
      description: taskForm.description,
      deadline: taskForm.deadline,
      priority: taskForm.priority,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [...prev, newTask]);
    setTaskForm({ title: '', description: '', deadline: '', priority: 'medium' });
    setShowTaskForm(false);
  };

  const handleTaskSort = (field: string) => {
    if (taskSortBy === field) {
      setTaskSortDirection(taskSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTaskSortBy(field);
      setTaskSortDirection('asc');
    }
  };

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[taskSortBy as keyof typeof a];
      let bValue: any = b[taskSortBy as keyof typeof b];

      if (taskSortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder];
        bValue = priorityOrder[bValue as keyof typeof priorityOrder];
      }

      if (taskSortBy === 'deadline') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return taskSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return taskSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return styles.priorityMedium;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return styles.statusCompleted;
      case 'pending': return styles.statusPending;
      case 'in_progress': return styles.statusInProgress;
      default: return styles.statusPending;
    }
  };

  const handleLogEmailFormChange = (field: string, value: string) => {
    setLogEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateEmailFormChange = (field: string, value: string | boolean) => {
    setCreateEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Log email:', logEmailForm);
    setShowLogEmailModal(false);
    setLogEmailForm({
      subject: '',
      body: '',
      sentDate: new Date().toISOString().split('T')[0],
      type: 'outbound'
    });
  };

  const handleCreateEmailSubmit = () => {
    console.log('Create email:', createEmailForm);
    setShowCreateEmailModal(false);
    setCreateEmailForm({
      to: contact.email,
      subject: '',
      body: '',
      createTask: false,
      taskType: 'Follow Up'
    });
  };

  const handleFieldEdit = (fieldName: string) => {
    setEditingField(fieldName);
    setEditingValue(fieldValues[fieldName as keyof typeof fieldValues] || '');
  };

  const handleFieldSave = (fieldName: string, newValue: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: newValue
    }));
    setEditingField(null);
    setEditingValue('');
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const handleFieldHover = (fieldKey: string | null) => {
    setHoveredField(fieldKey);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFieldSave(editingField!, editingValue);
    }
    if (e.key === 'Escape') {
      handleFieldCancel();
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#f8fafc',
      fontFamily: '"Inter", sans-serif'
    },
    contactCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '4px 8px',
      padding: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      flexShrink: 0
    },
    contactHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    contactLeft: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: '2px',
      alignItems: 'flex-start'
    },
    logoSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2px'
    },
    nameAndDetails: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1px'
    },
    accountBelowLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '10px',
      color: '#9ca3af',
      margin: 0,
      marginTop: '2px',
      fontStyle: 'italic',
      fontWeight: '300'
    },
    contactLogo: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      backgroundColor: '#3b82f6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '600',
      marginRight: '8px'
    },
    contactTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
      lineHeight: '1.2'
    },
    titleInfo: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '400',
      marginTop: '2px'
    },
    contactRight: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    convertButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    pipelineContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '4px 8px',
      padding: '16px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      flexShrink: 0
    },
    pipelineSteps: {
      position: 'relative' as const
    },
    pipelineStepsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative' as const
    },
    stage: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      position: 'relative' as const
    },
    stageHover: {
      backgroundColor: '#f3f4f6'
    },
    stageCircle: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '8px',
      transition: 'all 0.2s ease'
    },
    stageLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#374151',
      textAlign: 'center' as const
    },
    stageConnector: {
      position: 'absolute' as const,
      top: '24px',
      left: '50%',
      right: '-50%',
      height: '2px',
      backgroundColor: '#e5e7eb',
      zIndex: 0
    },
    tabsCard: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '4px 8px 8px 8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    tabsContainer: {
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    tabs: {
      display: 'flex',
      overflowX: 'auto' as const,
      scrollbarWidth: 'none' as const,
      msOverflowStyle: 'none' as const
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 16px',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid transparent',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: '#6b7280',
      transition: 'color 0.2s, background-color 0.2s',
      whiteSpace: 'nowrap' as const,
      minWidth: 'fit-content'
    },
    tabActive: {
      color: '#3b82f6',
      borderBottom: '2px solid #3b82f6',
      backgroundColor: '#f8fafc'
    },
    tabContent: {
      flex: 1,
      padding: '16px',
      overflow: 'auto',
      backgroundColor: 'white'
    },
    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    card: {
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '16px'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    fieldRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #e5e7eb'
    },
    fieldLabel: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500'
    },
    fieldValue: {
      fontSize: '14px',
      color: '#374151',
      fontWeight: '500'
    },
    taskContainer: {
      marginBottom: '16px'
    },
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    taskTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937'
    },
    addTaskButton: {
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
      transition: 'background-color 0.2s'
    },
    taskTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    taskTableHeader: {
      backgroundColor: '#f8fafc'
    },
    taskTableHeaderCell: {
      padding: '12px',
      textAlign: 'left' as const,
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e5e7eb',
      cursor: 'pointer',
      userSelect: 'none' as const
    },
    taskTableRow: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'background-color 0.2s'
    },
    taskTableCell: {
      padding: '12px',
      fontSize: '14px',
      color: '#374151'
    },
    priorityHigh: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500'
    },
    priorityMedium: {
      backgroundColor: '#fef3c7',
      color: '#d97706',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500'
    },
    priorityLow: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500'
    },
    statusCompleted: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500'
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#d97706',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500'
    },
    statusInProgress: {
      backgroundColor: '#dbeafe',
      color: '#2563eb',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500'
    },
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: 0,
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    modalHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    modalCloseButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      borderRadius: '4px',
      transition: 'background-color 0.2s'
    },
    modalBody: {
      padding: '24px',
      maxHeight: '60vh',
      overflow: 'auto'
    },
    modalFormField: {
      marginBottom: '16px'
    },
    modalFormRow: {
      display: 'flex',
      gap: '16px'
    },
    modalFormFieldHalf: {
      flex: 1
    },
    modalLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    modalInput: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#374151',
      backgroundColor: 'white',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box' as const
    },
    modalTextarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#374151',
      backgroundColor: 'white',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      resize: 'vertical' as const,
      minHeight: '80px',
      boxSizing: 'border-box' as const
    },
    modalSelect: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#374151',
      backgroundColor: 'white',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const
    },
    modalFooter: {
      padding: '16px 24px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    modalCancelButton: {
      padding: '8px 16px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    modalSubmitButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    placeholder: {
      textAlign: 'center' as const,
      padding: '48px 24px',
      color: '#6b7280'
    },
    placeholderTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    placeholderText: {
      fontSize: '14px',
      lineHeight: '1.5'
    },
    cardHeader: {
      padding: '16px 20px',
      borderBottom: '1px solid #f1f5f9',
      backgroundColor: '#f8fafc'
    },
    cardContent: {
      padding: '20px'
    },


    uploadModal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    logEmailOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    },
    logEmailModal: {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 1001
    },
    createEmailModal: {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '95%',
      maxWidth: '900px',
      height: '90vh',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column' as const
    },
    createEmailHeader: {
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    },
    createEmailTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    createEmailBody: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    },
    createEmailSidebar: {
      width: '200px',
      borderRight: '1px solid #e5e7eb',
      backgroundColor: '#f8fafc',
      padding: '16px',
      flexShrink: 0
    },
    createEmailContent: {
      flex: 1,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column' as const
    },
    createEmailFooter: {
      padding: '16px 24px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    },
    createEmailSendButton: {
      padding: '8px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    logEmailAssociated: {
      fontSize: '12px',
      color: '#6b7280'
    },
    emailsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px'
    },
    activityBox: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    activityHeader: {
      padding: '16px 20px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    activityTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937'
    },
    activityActions: {
      display: 'flex',
      gap: '8px'
    },
    activitySecondaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      fontSize: '12px',
      color: '#6b7280',
      backgroundColor: 'transparent',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    activityActionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      fontSize: '12px',
      color: 'white',
      backgroundColor: '#2563eb',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    activityTable: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    activityTableHeader: {
      backgroundColor: '#f8fafc'
    },
    activityTableHeaderCell: {
      padding: '12px 16px',
      textAlign: 'left' as const,
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      borderBottom: '1px solid #e5e7eb'
    },
    activityTableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s'
    },
    activityTableCell: {
      padding: '12px 16px',
      fontSize: '14px',
      color: '#374151'
    },
    directionBadge: {
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500',
      color: 'white'
    },
    emptyState: {
      padding: '40px 20px',
      textAlign: 'center' as const,
      color: '#9ca3af'
    },
    emptyStateText: {
      marginTop: '8px',
      fontSize: '14px'
    },
    // Field editing styles
    editableFieldContainer: {
      position: 'relative' as const
    },
    fieldEditButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 6px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '10px',
      fontWeight: '500',
      opacity: 0,
      transition: 'opacity 0.2s',
      position: 'absolute' as const,
      right: '4px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10
    },
    fieldEditButtonVisible: {
      opacity: 1
    },
    fieldEditInput: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #2563eb',
      borderRadius: '4px',
      fontSize: '13px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none'
    },
    fieldEditTextarea: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #2563eb',
      borderRadius: '4px',
      fontSize: '13px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical' as const
    },
    fieldEditActions: {
      display: 'flex',
      gap: '4px',
      marginTop: '4px',
      justifyContent: 'flex-end'
    },
    fieldSaveButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      padding: '4px 8px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500'
    },
    fieldCancelButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      padding: '4px 8px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500'
    },
    fieldValueClickable: {
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  /**
   * Renders a horizontal pipeline/relationship stage view for contacts
   * This component displays the relationship stages in a linear progression
   * with interactive hover effects and click handlers for stage changes
   * 
   * Features:
   * - Visual pipeline with numbered stages
   * - Hover effects with color changes
   * - Click to change current stage
   * - Connector lines between stages
   * - Dynamic color based on completion status
   * 
   * @returns {JSX.Element} The pipeline view component
   */
  const renderPipelineView = () => {
    // Get the current stage index for determining completion status
    const currentIndex = getCurrentStageIndex();
    
    return (
      <div style={styles.pipelineContainer}>
        <div style={styles.pipelineSteps}>
          <div style={styles.pipelineStepsContainer}>
            {/* Map through all relationship stages to create the pipeline */}
            {relationshipStages.map((stage, index) => {
              // Get the status of this stage (completed, active, or inactive)
              const status = getStageStatus(stage, index);
              // Check if this stage is currently being hovered
              const isHovered = hoveredStageIndex === index;
              
              /**
               * Determines the base color for the stage circle
               * @returns {string} Hex color code
               */
              const getStageColor = () => {
                // Dark blue for completed or active stages
                if (status.completed || status.active) return '#14235f';
                // Light blue for inactive stages
                return '#93c5fd';
              };
              
              /**
               * Determines the hover color for the stage circle
               * @returns {string} Hex color code
               */
              const getHoverColor = () => {
                // Darker blue for completed or active stages on hover
                if (status.completed || status.active) return '#1e3a8a';
                // Lighter blue for inactive stages on hover
                return '#7dd3fc';
              };
              
              return (
                <div
                  key={stage.id}
                  style={{
                    ...styles.stage,
                    // Apply hover styles if this stage is being hovered
                    ...(isHovered ? styles.stageHover : {})
                  }}
                  // Click handler to change the current stage
                  onClick={() => handleStageChange(stage.id)}
                  // Mouse enter handler to show hover effects
                  onMouseEnter={() => setHoveredStageIndex(index)}
                  // Mouse leave handler to hide hover effects
                  onMouseLeave={() => setHoveredStageIndex(null)}
                >
                  {/* Render connector line between stages (except for the last stage) */}
                  {index < relationshipStages.length - 1 && (
                    <div style={{
                      ...styles.stageConnector,
                      // Dark blue for completed stages, light gray for incomplete
                      backgroundColor: index < currentIndex ? '#14235f' : '#e5e7eb'
                    }} />
                  )}
                  
                  {/* Stage circle with number */}
                  <div style={{
                    ...styles.stageCircle,
                    // Dynamic background color based on hover and completion status
                    backgroundColor: isHovered ? getHoverColor() : getStageColor(),
                    zIndex: 1 // Ensure circle appears above connector
                  }}>
                    {stage.number}
                  </div>
                  
                  {/* Stage label */}
                  <div style={styles.stageLabel}>
                    {stage.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Contact Information */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Contact Information</h3>
        </div>
        <div style={styles.cardContent}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {renderDisplayField('First Name', 'First Name')}
            {renderDisplayField('Last Name', 'Last Name')}
          </div>
          {renderDisplayField('Email', 'Email')}
          {renderDisplayField('Phone', 'Phone')}
          {renderDisplayField('Title', 'Title', true)}
        </div>
      </div>

      {/* Account Information */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Account Information</h3>
        </div>
        <div style={styles.cardContent}>
          {renderDisplayField('Company Name', 'Company Name')}
          {renderDisplayField('Industry', 'Industry')}
          {renderDisplayField('Website', 'Website')}
          {renderDisplayField('No. of Employees', 'No. of Employees', true)}
        </div>
      </div>

      {/* Address Information */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Address Information</h3>
        </div>
        <div style={styles.cardContent}>
          {/* Address Line 1 - Full width */}
          {renderDisplayField('Address Line 1 (Street Address)', 'Address Line 1 (Street Address)')}
          
          {/* Address Line 2 and Landmark - Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {renderDisplayField('Address Line 2 (Area, Street, Sector, Village)', 'Address Line 2 (Area, Street, Sector, Village)')}
            {renderDisplayField('Landmark (optional)', 'Landmark (optional)')}
          </div>
          
          {/* City and State - Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {renderDisplayField('City', 'City')}
            {renderDisplayField('State', 'State')}
          </div>
          
          {/* Country and Postal Index - Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0' }}>
            {renderDisplayField('Country', 'Country')}
            {renderDisplayField('Postal Index', 'Postal Index', true)}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Additional Information</h3>
        </div>
        <div style={styles.cardContent}>
          {renderDisplayField('Description', 'Description', true)}
        </div>
      </div>
    </div>
  );

  const renderEmailsTab = () => {
    // Sample email data
    const emailHistory = [
      {
        id: 1,
        subject: 'Follow-up on Project Discussion',
        direction: 'Sent',
        date: '2024-01-15',
        time: '10:30 AM'
      },
      {
        id: 2,
        subject: 'Proposal Document Attached',
        direction: 'Sent',
        date: '2024-01-14',
        time: '2:15 PM'
      },
      {
        id: 3,
        subject: 'Initial Inquiry Response',
        direction: 'Received',
        date: '2024-01-12',
        time: '9:45 AM'
      }
    ];

    const renderEmailActivityBox = (title: string, icon: any, data: any[], headers: string[], renderRow: (item: any) => React.ReactNode, primaryAction: string, secondaryAction: string) => {
      const IconComponent = icon;
      
      return (
        <div style={styles.activityBox}>
          <div style={styles.activityHeader}>
            <div style={styles.activityTitle}>
              <IconComponent size={16} />
              {title}
            </div>
            <div style={styles.activityActions}>
              <button 
                style={styles.activitySecondaryButton}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                  (e.target as HTMLElement).style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLElement).style.borderColor = '#d1d5db';
                }}
                onClick={() => {
                  if (secondaryAction === 'Create Email') {
                    setShowCreateEmailModal(true);
                  } else {
                    console.log(`${secondaryAction} clicked`);
                  }
                }}
              >
                <Plus size={12} />
                {secondaryAction}
              </button>
              <button 
                style={styles.activityActionButton}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#2563eb';
                }}
                onClick={() => {
                  if (primaryAction === 'Log Email') {
                    setShowLogEmailModal(true);
                  } else {
                    console.log(`${primaryAction} clicked`);
                  }
                }}
              >
                <FileText size={12} />
                {primaryAction}
              </button>
            </div>
          </div>
          
          {data.length > 0 ? (
            <table style={styles.activityTable}>
              <thead style={styles.activityTableHeader}>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} style={styles.activityTableHeaderCell}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr 
                    key={item.id} 
                    style={styles.activityTableRow}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {renderRow(item)}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
              <Mail size={24} color="#9ca3af" />
              <p style={styles.emptyStateText}>No emails found</p>
            </div>
          )}
        </div>
      );
    };

    return (
      <div style={styles.emailsContainer}>
        {renderEmailActivityBox(
          'Email History',
          Mail,
          emailHistory,
          ['Subject', 'Direction', 'Date', 'Time'],
          (item) => (
            <>
              <td style={styles.activityTableCell}>{item.subject}</td>
              <td style={styles.activityTableCell}>
                <span style={{
                  ...styles.directionBadge,
                  backgroundColor: item.direction === 'Sent' ? '#10b981' : '#3b82f6'
                }}>
                  {item.direction}
                </span>
              </td>
              <td style={styles.activityTableCell}>{item.date}</td>
              <td style={styles.activityTableCell}>{item.time}</td>
            </>
          ),
          'Log Email',
          'Create Email'
        )}
      </div>
    );
  };

  const renderTasksTab = () => (
    <div style={styles.taskContainer}>
      <div style={styles.taskHeader}>
        <h3 style={styles.taskTitle}>Tasks ({tasks.length})</h3>
        <button
          style={styles.addTaskButton}
          onClick={() => setShowTaskForm(true)}
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

      <table style={styles.taskTable}>
        <thead style={styles.taskTableHeader}>
          <tr>
            <th 
              style={styles.taskTableHeaderCell}
              onClick={() => handleTaskSort('title')}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                Task
                <ArrowUpDown size={12} />
              </div>
            </th>
            <th 
              style={styles.taskTableHeaderCell}
              onClick={() => handleTaskSort('priority')}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                Priority
                <ArrowUpDown size={12} />
              </div>
            </th>
            <th 
              style={styles.taskTableHeaderCell}
              onClick={() => handleTaskSort('deadline')}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                Deadline
                <ArrowUpDown size={12} />
              </div>
            </th>
            <th 
              style={styles.taskTableHeaderCell}
              onClick={() => handleTaskSort('status')}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                Status
                <ArrowUpDown size={12} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {getSortedTasks().map((task) => (
            <tr
              key={task.id}
              style={styles.taskTableRow}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <td style={styles.taskTableCell}>
                <div style={{fontWeight: '500', marginBottom: '4px'}}>
                  {task.title}
                </div>
                <div style={{fontSize: '12px', color: '#6b7280'}}>
                  {task.description}
                </div>
              </td>
              <td style={styles.taskTableCell}>
                <span style={getPriorityStyle(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </td>
              <td style={styles.taskTableCell}>{task.deadline}</td>
              <td style={styles.taskTableCell}>
                <span style={getStatusStyle(task.status)}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDisplayField = (label: string, fieldKey: string, isLast: boolean = false) => {
    const value = fieldValues[fieldKey as keyof typeof fieldValues] || '';
    const isEditing = editingField === fieldKey;
    const isHovered = hoveredField === fieldKey;

    const handleSave = () => {
      handleFieldSave(fieldKey, editingValue);
    };

    const handleCancel = () => {
      setEditingValue(value);
      handleFieldCancel();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    const isDescription = fieldKey === 'Description';

    return (
      <div style={isLast ? styles.fieldGroupLast : styles.fieldGroup}>
        <label style={styles.fieldLabel}>{label}</label>
        {isEditing ? (
          <>
            <div 
              style={{ ...styles.fieldValueDisplay, ...styles.editableFieldContainer }}
            >
              {isDescription ? (
                <textarea
                  style={styles.fieldEditTextarea}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  style={styles.fieldEditInput}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  autoFocus
                />
              )}
            </div>
            <div style={styles.fieldEditActions}>
              <button 
                style={styles.fieldSaveButton}
                onClick={handleSave}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#047857';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#059669';
                }}
              >
                <Check size={10} />
                Save
              </button>
              <button 
                style={styles.fieldCancelButton}
                onClick={handleCancel}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#4b5563';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#6b7280';
                }}
              >
                <X size={10} />
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div 
            style={{ 
              ...(isDescription ? styles.fieldValueDisplayDescription : styles.fieldValueDisplay), 
              ...styles.editableFieldContainer,
              ...styles.fieldValueClickable
            }}
            onMouseEnter={() => handleFieldHover(fieldKey)}
            onMouseLeave={() => handleFieldHover(null)}
            onClick={() => handleFieldEdit(fieldKey)}
          >
            <span style={{ 
              flex: 1, 
              whiteSpace: isDescription ? 'pre-wrap' : 'normal',
              wordBreak: 'break-word',
              lineHeight: isDescription ? '1.5' : 'normal'
            }}>{value}</span>
            <button 
              style={{
                ...styles.fieldEditButton,
                ...(isHovered ? styles.fieldEditButtonVisible : {})
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleFieldEdit(fieldKey);
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#6b7280';
              }}
            >
              <Edit2 size={10} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderOpportunitiesTab = () => {
    // Sample opportunities data - this will be connected to actual opportunities later
    const opportunities = [
      {
        id: 1,
        name: 'Enterprise Software License',
        account: contact.account,
        stage: 'Qualified',
        value: 75000,
        closeDate: '2024-02-15',
        probability: 70,
        owner: contact.owner
      },
      {
        id: 2,
        name: 'Annual Support Contract',
        account: contact.account,
        stage: 'Proposed',
        value: 25000,
        closeDate: '2024-03-01',
        probability: 85,
        owner: contact.owner
      },
      {
        id: 3,
        name: 'Training Services',
        account: contact.account,
        stage: 'Negotiation',
        value: 15000,
        closeDate: '2024-01-30',
        probability: 90,
        owner: contact.owner
      }
    ];

    const getStageStyle = (stage: string) => {
      const stageStyles: { [key: string]: React.CSSProperties } = {
        'New': { backgroundColor: '#e5e7eb', color: '#374151' },
        'Qualified': { backgroundColor: '#dbeafe', color: '#1d4ed8' },
        'Proposed': { backgroundColor: '#fef3c7', color: '#d97706' },
        'Negotiation': { backgroundColor: '#fed7d7', color: '#c53030' },
        'Closed Won': { backgroundColor: '#d1fae5', color: '#065f46' },
        'Closed Lost': { backgroundColor: '#fee2e2', color: '#dc2626' }
      };
      return {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        ...stageStyles[stage]
      };
    };

    return (
      <div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <HeartHandshake size={20} />
            Associated Opportunities ({opportunities.length})
          </div>
          
          {opportunities.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                fontSize: '14px' 
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      fontWeight: '600', 
                      color: '#374151' 
                    }}>
                      Opportunity Name
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      fontWeight: '600', 
                      color: '#374151' 
                    }}>
                      Stage
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      fontWeight: '600', 
                      color: '#374151' 
                    }}>
                      Value
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      fontWeight: '600', 
                      color: '#374151' 
                    }}>
                      Close Date
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      fontWeight: '600', 
                      color: '#374151' 
                    }}>
                      Probability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => (
                    <tr 
                      key={opp.id} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ 
                        padding: '12px 8px', 
                        fontWeight: '500',
                        color: '#3b82f6'
                      }}>
                        {opp.name}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={getStageStyle(opp.stage)}>
                          {opp.stage}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '12px 8px', 
                        fontWeight: '500' 
                      }}>
                        ${opp.value.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {opp.closeDate}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '60px',
                            height: '6px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${opp.probability}%`,
                              height: '100%',
                              backgroundColor: opp.probability >= 80 ? '#10b981' : 
                                            opp.probability >= 60 ? '#f59e0b' : '#ef4444',
                              borderRadius: '3px'
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            {opp.probability}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: '#6b7280'
            }}>
              <HeartHandshake size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                No Opportunities Found
              </div>
              <div style={{ fontSize: '14px' }}>
                No opportunities are currently associated with this contact.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'emails':
        return renderEmailsTab();
      case 'calls':
        return (
          <div style={styles.placeholder}>
            <div style={styles.placeholderTitle}>
              Calls Tab
            </div>
            <div style={styles.placeholderText}>
              This section is ready for implementation.<br />
              Contact calls features will be added here.
            </div>
          </div>
        );
      case 'meetings':
        return (
          <div style={styles.placeholder}>
            <div style={styles.placeholderTitle}>
              Meetings Tab
            </div>
            <div style={styles.placeholderText}>
              This section is ready for implementation.<br />
              Contact meetings features will be added here.
            </div>
          </div>
        );
      case 'tasks':
        return renderTasksTab();
      case 'opportunities':
        return renderOpportunitiesTab();
      case 'attachments':
        return (
          <div style={styles.placeholder}>
            <div style={styles.placeholderTitle}>
              Attachments Tab
            </div>
            <div style={styles.placeholderText}>
              This section is ready for implementation.<br />
              Contact attachments features will be added here.
            </div>
          </div>
        );
      default:
        return (
          <div style={styles.placeholder}>
            <div style={styles.placeholderTitle}>
              {tabs.find(tab => tab.id === activeTab)?.label} Tab
            </div>
            <div style={styles.placeholderText}>
              This section is ready for implementation.<br />
              Contact {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} features will be added here.
            </div>
          </div>
        );
    }
  };

  const renderTaskModal = () => {
    if (!showTaskForm) return null;

    return (
      <div style={styles.modalOverlay} onClick={() => setShowTaskForm(false)}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleTaskSubmit}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <CheckCircle size={16} />
                Create New Task
              </h3>
              <button 
                type="button"
                style={styles.modalCloseButton}
                onClick={() => setShowTaskForm(false)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.modalFormField}>
                <label style={styles.modalLabel}>Title *</label>
                <input
                  type="text"
                  style={styles.modalInput}
                  value={taskForm.title}
                  onChange={(e) => handleTaskFormChange('title', e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div style={styles.modalFormField}>
                <label style={styles.modalLabel}>Description</label>
                <textarea
                  style={styles.modalTextarea}
                  value={taskForm.description}
                  onChange={(e) => handleTaskFormChange('description', e.target.value)}
                  placeholder="Enter task description"
                />
              </div>
              
              <div style={styles.modalFormRow}>
                <div style={styles.modalFormFieldHalf}>
                  <label style={styles.modalLabel}>Deadline</label>
                  <input
                    type="date"
                    style={styles.modalInput}
                    value={taskForm.deadline}
                    onChange={(e) => handleTaskFormChange('deadline', e.target.value)}
                  />
                </div>
                <div style={styles.modalFormFieldHalf}>
                  <label style={styles.modalLabel}>Priority</label>
                  <select
                    style={styles.modalSelect}
                    value={taskForm.priority}
                    onChange={(e) => handleTaskFormChange('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button 
                type="button" 
                style={styles.modalCancelButton}
                onClick={() => setShowTaskForm(false)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#4b5563';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#6b7280';
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={styles.modalSubmitButton}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#047857';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#059669';
                }}
              >
                <CheckCircle size={14} />
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Contact Information Card */}
      <div style={styles.contactCard}>
        <div style={styles.contactHeader}>
          <div style={styles.contactLeft}>
            <div style={styles.logoSection}>
              <div style={styles.contactLogo}>
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.accountBelowLogo}>
                <Building size={10} />
                <span>{contact.account}</span>
              </div>
            </div>
            <div style={styles.nameAndDetails}>
              <h1 style={styles.contactTitle}>{contact.name}</h1>
              <div style={styles.titleInfo}>
                <span>Contact</span>
              </div>
            </div>
          </div>
          <div style={styles.contactRight}>
            <button 
              style={styles.convertButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#047857';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
            >
              <UserPlus size={16} />
              Create Opportunity
            </button>
          </div>
        </div>
      </div>

      {/* Relationship Pipeline Card */}
      {renderPipelineView()}

      {/* Tabs Card */}
      <div style={styles.tabsCard}>
        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab.id ? styles.tabActive : {})
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={styles.tabContent}>
          {renderTabContent()}
        </div>
      </div>

      {renderTaskModal()}
    </div>
  );
};

export default ContactDetails;