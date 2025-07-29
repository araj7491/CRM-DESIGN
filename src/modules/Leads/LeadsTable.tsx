import React from 'react';
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  value: number;
  source: string;
  created: string;
}

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: number[];
  showActionMenu: number | null;
  onSelectLead: (leadId: number) => void;
  onSelectAllLeads: () => void;
  onActionMenuClick: (leadId: number) => void;
  onActionClick: (action: string, lead: Lead) => void;
  onLeadClick: (lead: Lead) => void;
  onSort: (field: string) => void;
  getStatusStyle: (status: string) => React.CSSProperties;
  styles: { [key: string]: React.CSSProperties };
}

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  selectedLeads,
  showActionMenu,
  onSelectLead,
  onSelectAllLeads,
  onActionMenuClick,
  onActionClick,
  onLeadClick,
  onSort,
  getStatusStyle,
  styles,
}) => {
  return (
    <table style={styles.table}>
      <thead style={styles.tableHeader}>
        <tr>
          <th style={styles.tableHeaderCell}>
            <input
              type="checkbox"
              checked={selectedLeads.length === leads.length && leads.length > 0}
              onChange={onSelectAllLeads}
              style={{ cursor: 'pointer' }}
            />
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('name')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Name
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('company')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Company
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th style={styles.tableHeaderCell}>Contact</th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('status')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Status
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('value')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Value
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('source')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Source
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th style={styles.tableHeaderCell}>Options</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr
            key={lead.id}
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
                checked={selectedLeads.includes(lead.id)}
                onChange={() => onSelectLead(lead.id)}
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
                onClick={() => onLeadClick(lead)}
              >
                {lead.name}
              </div>
            </td>
            <td style={styles.tableCell}>{lead.company}</td>
            <td style={styles.tableCell}>
              <div>{lead.email}</div>
              <div style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>
                {lead.phone}
              </div>
            </td>
            <td style={styles.tableCell}>
              <span style={getStatusStyle(lead.status)}>
                {lead.status}
              </span>
            </td>
            <td style={styles.tableCell}>
              <div style={{fontWeight: '500'}}>
                ${lead.value.toLocaleString()}
              </div>
            </td>
            <td style={styles.tableCell}>{lead.source}</td>
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
                  onClick={() => onActionMenuClick(lead.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ⋯
                </button>
                {showActionMenu === lead.id && (
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
                      onClick={() => onActionClick('view', lead)}
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
                      onClick={() => onActionClick('edit', lead)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit size={16} />
                      Edit Lead
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
                      onClick={() => onActionClick('delete', lead)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                      Delete Lead
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

export default LeadsTable; 