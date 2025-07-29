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
  Target,
  Users
} from 'lucide-react';

interface Account {
  id: number;
  name: string;
  industry: string;
  owner: string;
  phone: string;
  website: string;
  created: string;
}

interface AccountDetailsProps {
  account: Account;
  onBack: () => void;
  onSave: (updatedAccount: Account) => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ account, onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Task management state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Follow up call',
      description: 'Call contact at ' + account.name + ' to discuss partnership opportunities',
      deadline: '2024-01-20',
      priority: 'high',
      status: 'pending',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Send proposal',
      description: 'Prepare and send partnership proposal',
      deadline: '2024-01-25',
      priority: 'medium',
      status: 'pending',
      createdDate: '2024-01-14'
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

  // Sample opportunities data
  const [opportunities] = useState([
    {
      id: 1,
      name: 'Q1 Software License Deal',
      stage: 'Proposal',
      amount: 50000,
      closeDate: '2024-03-31',
      probability: 75
    },
    {
      id: 2,
      name: 'Annual Support Contract',
      stage: 'Negotiation',
      amount: 25000,
      closeDate: '2024-02-15',
      probability: 90
    }
  ]);

  // Sample contacts data
  const [contacts] = useState([
    {
      id: 1,
      name: 'John Smith',
      title: 'CEO',
      email: 'john.smith@' + account.name.toLowerCase().replace(/\s+/g, '') + '.com',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      title: 'CTO',
      email: 'sarah.johnson@' + account.name.toLowerCase().replace(/\s+/g, '') + '.com',
      phone: '+1 (555) 123-4568'
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'emails', label: 'E-mails', icon: Mail },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  const handleConvertToOpportunity = () => {
    console.log('Converting account to opportunity');
    // Handle convert to opportunity logic here
  };

  const renderDisplayField = (label: string, fieldName: string, optional: boolean = false) => (
    <div style={styles.displayField}>
      <label style={styles.displayFieldLabel}>
        {label}
        {!optional && <span style={styles.requiredAsterisk}>*</span>}
      </label>
      <div style={styles.displayFieldValue}>
        {fieldName === 'Company Name' ? account.name :
         fieldName === 'Industry' ? account.industry :
         fieldName === 'Owner' ? account.owner :
         fieldName === 'Phone' ? account.phone :
         fieldName === 'Website' ? account.website :
         fieldName === 'Created' ? account.created :
         'N/A'}
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Account Information */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Account Information</h3>
        </div>
        <div style={styles.cardContent}>
          {renderDisplayField('Company Name', 'Company Name')}
          {renderDisplayField('Industry', 'Industry')}
          {renderDisplayField('Owner', 'Owner')}
          {renderDisplayField('Phone', 'Phone')}
          {renderDisplayField('Website', 'Website')}
          {renderDisplayField('Created', 'Created')}
        </div>
      </div>
      
      {/* Address Information */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Address Information</h3>
        </div>
        <div style={styles.cardContent}>
          {renderDisplayField('Address Line 1 (Street Address)', 'Address Line 1 (Street Address)')}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {renderDisplayField('Address Line 2 (Area, Street, Sector, Village)', 'Address Line 2 (Area, Street, Sector, Village)')}
            {renderDisplayField('Landmark (optional)', 'Landmark (optional)')}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {renderDisplayField('City', 'City')}
            {renderDisplayField('State', 'State')}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {renderDisplayField('Postal Code', 'Postal Code')}
            {renderDisplayField('Country', 'Country')}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOpportunitiesTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Opportunities</h3>
        <button style={styles.addButton}>
          <Plus size={16} />
          Add Opportunity
        </button>
      </div>
      <div style={styles.opportunitiesGrid}>
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} style={styles.opportunityCard}>
            <div style={styles.opportunityHeader}>
              <h4 style={styles.opportunityName}>{opportunity.name}</h4>
              <span style={styles.opportunityStage}>{opportunity.stage}</span>
            </div>
            <div style={styles.opportunityDetails}>
              <div style={styles.opportunityAmount}>
                ${opportunity.amount.toLocaleString()}
              </div>
              <div style={styles.opportunityMeta}>
                <span>Close Date: {opportunity.closeDate}</span>
                <span>Probability: {opportunity.probability}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactsTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Contacts</h3>
        <button style={styles.addButton}>
          <Plus size={16} />
          Add Contact
        </button>
      </div>
      <div style={styles.contactsGrid}>
        {contacts.map((contact) => (
          <div key={contact.id} style={styles.contactCard}>
            <div style={styles.contactHeader}>
              <div style={styles.contactAvatar}>
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={styles.contactInfo}>
                <h4 style={styles.contactName}>{contact.name}</h4>
                <p style={styles.contactTitle}>{contact.title}</p>
              </div>
            </div>
            <div style={styles.contactDetails}>
              <div style={styles.contactEmail}>{contact.email}</div>
              <div style={styles.contactPhone}>{contact.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Tasks</h3>
        <button 
          style={styles.addButton}
          onClick={() => setShowTaskForm(true)}
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>
      <div style={styles.tasksList}>
        {tasks.map((task) => (
          <div key={task.id} style={styles.taskCard}>
            <div style={styles.taskHeader}>
              <h4 style={styles.taskTitle}>{task.title}</h4>
              <span style={{
                ...styles.taskPriority,
                backgroundColor: task.priority === 'high' ? '#fee2e2' : 
                                task.priority === 'medium' ? '#fef3c7' : '#f0fdf4',
                color: task.priority === 'high' ? '#dc2626' : 
                       task.priority === 'medium' ? '#d97706' : '#16a34a'
              }}>
                {task.priority}
              </span>
            </div>
            <p style={styles.taskDescription}>{task.description}</p>
            <div style={styles.taskMeta}>
              <span>Due: {task.deadline}</span>
              <span style={{
                color: task.status === 'completed' ? '#16a34a' : '#d97706'
              }}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmailsTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Emails</h3>
        <button style={styles.addButton}>
          <Plus size={16} />
          Log Email
        </button>
      </div>
      <div style={styles.emptyState}>
        <Mail size={48} style={{ color: '#9ca3af' }} />
        <p>No emails logged yet</p>
      </div>
    </div>
  );

  const renderCallsTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Calls</h3>
        <button style={styles.addButton}>
          <Plus size={16} />
          Log Call
        </button>
      </div>
      <div style={styles.emptyState}>
        <Phone size={48} style={{ color: '#9ca3af' }} />
        <p>No calls logged yet</p>
      </div>
    </div>
  );

  const renderMeetingsTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Meetings</h3>
        <button style={styles.addButton}>
          <Plus size={16} />
          Schedule Meeting
        </button>
      </div>
      <div style={styles.emptyState}>
        <Video size={48} style={{ color: '#9ca3af' }} />
        <p>No meetings scheduled yet</p>
      </div>
    </div>
  );

  const renderAttachmentsTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Attachments</h3>
        <button style={styles.addButton}>
          <Plus size={16} />
          Add Attachment
        </button>
      </div>
      <div style={styles.emptyState}>
        <Paperclip size={48} style={{ color: '#9ca3af' }} />
        <p>No attachments added yet</p>
      </div>
    </div>
  );

  const renderTimelineTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.tabHeader}>
        <h3 style={styles.tabTitle}>Timeline</h3>
      </div>
      <div style={styles.emptyState}>
        <Clock size={48} style={{ color: '#9ca3af' }} />
        <p>No activities recorded yet</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'opportunities':
        return renderOpportunitiesTab();
      case 'contacts':
        return renderContactsTab();
      case 'emails':
        return renderEmailsTab();
      case 'calls':
        return renderCallsTab();
      case 'meetings':
        return renderMeetingsTab();
      case 'tasks':
        return renderTasksTab();
      case 'attachments':
        return renderAttachmentsTab();
      case 'timeline':
        return renderTimelineTab();
      default:
        return renderOverviewTab();
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#f8fafc',
      fontFamily: '"Inter", sans-serif'
    },
    accountCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '4px 8px',
      padding: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      flexShrink: 0
    },
    accountHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    accountLeft: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: '12px',
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
    companyBelowLogo: {
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
    companyLogo: {
      width: '50px',
      height: '50px',
      borderRadius: '8px',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: '900'
    },
    accountTitle: {
      fontSize: '36px',
      fontWeight: '900',
      color: '#1e293b',
      margin: 0,
      lineHeight: '1.0'
    },
    titleInfo: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0,
      marginTop: '4px',
      textAlign: 'left' as const
    },
    accountRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    convertButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0
    },
    tabsCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '4px 8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: 0
    },
    tabsContainer: {
      display: 'flex',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      borderRadius: '8px 8px 0 0',
      padding: '0 8px'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#64748b',
      borderBottom: '2px solid transparent',
      transition: 'all 0.2s'
    },
    activeTab: {
      color: '#3b82f6',
      borderBottomColor: '#3b82f6',
      backgroundColor: 'white'
    },
    tabContentContainer: {
      flex: 1,
      padding: '16px',
      overflow: 'auto'
    },
    tabContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    tabHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    tabTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '12px 16px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    cardContent: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    displayField: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    displayFieldLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#64748b',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    displayFieldValue: {
      fontSize: '14px',
      color: '#1e293b',
      fontWeight: '500'
    },
    requiredAsterisk: {
      color: '#ef4444',
      marginLeft: '2px'
    },
    opportunitiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px'
    },
    opportunityCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px'
    },
    opportunityHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    opportunityName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    opportunityStage: {
      padding: '4px 8px',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    },
    opportunityDetails: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px'
    },
    opportunityAmount: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#16a34a'
    },
    opportunityMeta: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      fontSize: '12px',
      color: '#64748b'
    },
    contactsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px'
    },
    contactCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px'
    },
    contactHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    contactAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600'
    },
    contactInfo: {
      flex: 1
    },
    contactName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    contactTitle: {
      fontSize: '12px',
      color: '#64748b',
      margin: '2px 0 0 0'
    },
    contactDetails: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    contactEmail: {
      fontSize: '14px',
      color: '#3b82f6'
    },
    contactPhone: {
      fontSize: '14px',
      color: '#64748b'
    },
    tasksList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    taskCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px'
    },
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    },
    taskTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    taskPriority: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    },
    taskDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 12px 0',
      lineHeight: '1.5'
    },
    taskMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#64748b'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center' as const,
      color: '#9ca3af'
    }
  };

  return (
    <div style={styles.container}>
      {/* Account Header */}
      <div style={styles.accountCard}>
        <div style={styles.accountHeader}>
          <div style={styles.accountLeft}>
            <div style={styles.logoSection}>
              <div style={styles.companyLogo}>
                {account.name.charAt(0)}
              </div>
              <div style={styles.companyBelowLogo}>
                <Building size={10} />
                {account.industry}
              </div>
            </div>
            <div style={styles.nameAndDetails}>
              <h1 style={styles.accountTitle}>{account.name}</h1>
              <p style={styles.titleInfo}>Owner: {account.owner}</p>
            </div>
          </div>
          <div style={styles.accountRight}>
            <button 
              style={styles.convertButton}
              onClick={handleConvertToOpportunity}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#15803d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }}
            >
              <Target size={16} />
              Create Opportunity
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div style={styles.content}>
        <div style={styles.tabsCard}>
          <div style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </div>
            ))}
          </div>
          <div style={styles.tabContentContainer}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;