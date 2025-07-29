import React from 'react';
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  account: string;
  email: string;
  phone: string;
  owner: string;
  created: string;
}

interface ContactsTableProps {
  contacts: Contact[];
  selectedContacts: number[];
  showActionMenu: number | null;
  onSelectContact: (contactId: number) => void;
  onSelectAllContacts: () => void;
  onActionMenuClick: (contactId: number) => void;
  onActionClick: (action: string, contact: Contact) => void;
  onContactClick: (contact: Contact) => void;
  onSort: (field: string) => void;
  styles: { [key: string]: React.CSSProperties };
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  selectedContacts,
  showActionMenu,
  onSelectContact,
  onSelectAllContacts,
  onActionMenuClick,
  onActionClick,
  onContactClick,
  onSort,
  styles,
}) => {
  return (
    <table style={styles.table}>
      <thead style={styles.tableHeader}>
        <tr>
          <th style={styles.tableHeaderCell}>
            <input
              type="checkbox"
              checked={selectedContacts.length === contacts.length && contacts.length > 0}
              onChange={onSelectAllContacts}
              style={{ cursor: 'pointer' }}
            />
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('name')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Contact Name
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('account')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Account
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th style={styles.tableHeaderCell}>Contact Info</th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('owner')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Owner
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('created')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Created
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th style={styles.tableHeaderCell}>Options</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr
            key={contact.id}
            style={styles.tableRow}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <td style={styles.tableCell}>
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.id)}
                onChange={() => onSelectContact(contact.id)}
                style={{ cursor: 'pointer' }}
              />
            </td>
            <td style={styles.tableCell}>
              <div 
                style={{
                  fontWeight: '500',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => onContactClick(contact)}
              >
                {contact.name}
              </div>
            </td>
            <td style={styles.tableCell}>{contact.account}</td>
            <td style={styles.tableCell}>
              <div>{contact.email}</div>
              <div style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>
                {contact.phone}
              </div>
            </td>
            <td style={styles.tableCell}>{contact.owner}</td>
            <td style={styles.tableCell}>{contact.created}</td>
            <td style={styles.tableCell}>
              <div style={{ position: 'relative' }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    color: '#6b7280',
                    fontSize: '18px',
                  }}
                  onClick={() => onActionMenuClick(contact.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ⋯
                </button>
                {showActionMenu === contact.id && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e5e7eb',
                    minWidth: '150px',
                    zIndex: 1000,
                    marginTop: '4px',
                  }}>
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
                      onClick={() => onActionClick('view', contact)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Eye size={16} />
                      View Details
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
                      onClick={() => onActionClick('edit', contact)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit size={16} />
                      Edit Contact
                    </button>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        border: 'none',
                        backgroundColor: 'transparent',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onClick={() => onActionClick('delete', contact)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                      Delete Contact
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactsTable; 