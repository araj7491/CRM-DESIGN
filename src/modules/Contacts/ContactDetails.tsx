import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, Building, User, Calendar, Edit } from 'lucide-react';

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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      backgroundColor: '#f8fafc',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#f1f5f9',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#475569',
      transition: 'background-color 0.2s'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    tabs: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      display: 'flex',
      gap: '32px',
      flexShrink: 0
    },
    tab: {
      padding: '16px 0',
      fontSize: '14px',
      fontWeight: '500',
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      transition: 'all 0.2s'
    },
    activeTab: {
      color: '#3b82f6',
      borderBottomColor: '#3b82f6'
    },
    tabContent: {
      flex: 1,
      padding: '24px',
      overflow: 'auto'
    },
    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginBottom: '24px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    fieldRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #f1f5f9'
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
    placeholder: {
      textAlign: 'center' as const,
      padding: '48px 24px',
      color: '#64748b'
    },
    placeholderTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    placeholderText: {
      fontSize: '14px',
      lineHeight: '1.5'
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'emails', label: 'Emails' },
    { id: 'calls', label: 'Calls' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'notes', label: 'Notes' }
  ];

  const renderOverviewTab = () => (
    <div>
      <div style={styles.overviewGrid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <User size={20} />
            Contact Information
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Full Name</span>
            <span style={styles.fieldValue}>{contact.name}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Email</span>
            <span style={styles.fieldValue}>{contact.email}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Phone</span>
            <span style={styles.fieldValue}>{contact.phone}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Account</span>
            <span style={styles.fieldValue}>{contact.account}</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <Building size={20} />
            Account Details
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Owner</span>
            <span style={styles.fieldValue}>{contact.owner}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Created Date</span>
            <span style={styles.fieldValue}>{contact.created}</span>
          </div>
          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Last Modified</span>
            <span style={styles.fieldValue}>{contact.created}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return renderOverviewTab();
    }
    
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
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.backButton}
            onClick={onBack}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
          >
            <ArrowLeft size={16} />
            Back to Contacts
          </button>
          <h1 style={styles.title}>{contact.name}</h1>
        </div>
      </div>

      <div style={styles.content}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails; 