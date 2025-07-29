import React from 'react';
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';

interface Opportunity {
  id: number;
  name: string;
  stage: string;
  amount: number;
  closeDate: string;
  owner: string;
  primaryContact: string;
  created: string;
}

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  selectedOpportunities: number[];
  showActionMenu: number | null;
  onSelectOpportunity: (opportunityId: number) => void;
  onSelectAllOpportunities: () => void;
  onActionMenuClick: (opportunityId: number) => void;
  onActionClick: (action: string, opportunity: Opportunity) => void;
  onOpportunityClick: (opportunity: Opportunity) => void;
  onSort: (field: string) => void;
  getStageStyle: (stage: string) => React.CSSProperties;
  styles: { [key: string]: React.CSSProperties };
}

const OpportunitiesTable: React.FC<OpportunitiesTableProps> = ({
  opportunities,
  selectedOpportunities,
  showActionMenu,
  onSelectOpportunity,
  onSelectAllOpportunities,
  onActionMenuClick,
  onActionClick,
  onOpportunityClick,
  onSort,
  getStageStyle,
  styles,
}) => {
  return (
    <table style={styles.table}>
      <thead style={styles.tableHeader}>
        <tr>
          <th style={styles.tableHeaderCell}>
            <input
              type="checkbox"
              checked={selectedOpportunities.length === opportunities.length && opportunities.length > 0}
              onChange={onSelectAllOpportunities}
              style={{ cursor: 'pointer' }}
            />
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('name')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Opportunity Name
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('stage')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Stage
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('amount')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Amount
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('closeDate')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Close Date
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('owner')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Owner
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th style={styles.tableHeaderCell}>Primary Contact</th>
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
        {opportunities.map((opportunity) => (
          <tr
            key={opportunity.id}
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
                checked={selectedOpportunities.includes(opportunity.id)}
                onChange={() => onSelectOpportunity(opportunity.id)}
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
                onClick={() => onOpportunityClick(opportunity)}
              >
                {opportunity.name}
              </div>
            </td>
            <td style={styles.tableCell}>
              <span style={getStageStyle(opportunity.stage)}>
                {opportunity.stage}
              </span>
            </td>
            <td style={styles.tableCell}>
              <div style={{fontWeight: '500'}}>
                ${opportunity.amount.toLocaleString()}
              </div>
            </td>
            <td style={styles.tableCell}>{opportunity.closeDate}</td>
            <td style={styles.tableCell}>{opportunity.owner}</td>
            <td style={styles.tableCell}>{opportunity.primaryContact}</td>
            <td style={styles.tableCell}>{opportunity.created}</td>
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
                  onClick={() => onActionMenuClick(opportunity.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ⋯
                </button>
                {showActionMenu === opportunity.id && (
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
                      onClick={() => onActionClick('view', opportunity)}
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
                      onClick={() => onActionClick('edit', opportunity)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit size={16} />
                      Edit Opportunity
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
                      onClick={() => onActionClick('delete', opportunity)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                      Delete Opportunity
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

export default OpportunitiesTable;