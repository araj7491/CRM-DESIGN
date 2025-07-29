import React from 'react';
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-react';

interface Account {
  id: number;
  name: string;
  industry: string;
  owner: string;
  phone: string;
  website: string;
  created: string;
}

interface AccountsTableProps {
  accounts: Account[];
  selectedAccounts: number[];
  showActionMenu: number | null;
  onSelectAccount: (accountId: number) => void;
  onSelectAllAccounts: () => void;
  onActionMenuClick: (accountId: number) => void;
  onActionClick: (action: string, account: Account) => void;
  onAccountClick: (account: Account) => void;
  onSort: (field: string) => void;
  styles: { [key: string]: React.CSSProperties };
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
  selectedAccounts,
  showActionMenu,
  onSelectAccount,
  onSelectAllAccounts,
  onActionMenuClick,
  onActionClick,
  onAccountClick,
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
              checked={selectedAccounts.length === accounts.length && accounts.length > 0}
              onChange={onSelectAllAccounts}
              style={{ cursor: 'pointer' }}
            />
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('name')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Account Name
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th
            style={styles.tableHeaderCell}
            onClick={() => onSort('industry')}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              Industry
              <ArrowUpDown size={14} />
            </div>
          </th>
          <th style={styles.tableHeaderCell}>Account Info</th>
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
        {accounts.map((account) => (
          <tr
            key={account.id}
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
                checked={selectedAccounts.includes(account.id)}
                onChange={() => onSelectAccount(account.id)}
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
                onClick={() => onAccountClick(account)}
              >
                {account.name}
              </div>
            </td>
            <td style={styles.tableCell}>{account.industry}</td>
            <td style={styles.tableCell}>
              <div>{account.phone}</div>
              <div style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>
                <a 
                  href={account.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {account.website}
                </a>
              </div>
            </td>
            <td style={styles.tableCell}>{account.owner}</td>
            <td style={styles.tableCell}>{account.created}</td>
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
                  onClick={() => onActionMenuClick(account.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ⋯
                </button>
                {showActionMenu === account.id && (
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
                      onClick={() => onActionClick('view', account)}
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
                      onClick={() => onActionClick('edit', account)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit size={16} />
                      Edit Account
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
                      onClick={() => onActionClick('delete', account)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={16} />
                      Delete Account
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

export default AccountsTable;