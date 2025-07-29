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
  ArrowLeft,
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
  Maximize2
} from 'lucide-react';

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

interface OpportunityDetailsProps {
  opportunity: Opportunity;
  onBack: () => void;
  onSave: (updatedOpportunity: Opportunity) => void;
}

const OpportunityDetails: React.FC<OpportunityDetailsProps> = ({ opportunity, onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentStage, setCurrentStage] = useState(opportunity.stage);
  
  // Task management state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Follow up call',
      description: 'Call John Smith to discuss proposal details and next steps',
      deadline: '2024-01-20',
      priority: 'high',
      status: 'pending',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Send contract draft',
      description: 'Prepare and send the initial contract draft for review',
      deadline: '2024-01-25',
      priority: 'medium',
      status: 'pending',
      createdDate: '2024-01-14'
    },
    {
      id: 3,
      title: 'Schedule demo meeting',
      description: 'Coordinate with the team to schedule a product demo',
      deadline: '2024-01-18',
      priority: 'high',
      status: 'completed',
      createdDate: '2024-01-12'
    },
    {
      id: 4,
      title: 'Gather requirements',
      description: 'Collect detailed requirements from the client',
      deadline: '2024-01-30',
      priority: 'low',
      status: 'pending',
      createdDate: '2024-01-10'
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
  const [taskSortDirection, setTaskSortDirection] = useState('asc');
  
  // Attachment management state
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: 'Proposal_TechCorp_2024.pdf',
      size: '2.4 MB',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-01-15',
      type: 'PDF'
    },
    {
      id: 2,
      name: 'Contract_Draft_v2.docx',
      size: '1.1 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2024-01-12',
      type: 'DOCX'
    },
    {
      id: 3,
      name: 'Company_Presentation.pptx',
      size: '5.7 MB',
      uploadedBy: 'Mike Wilson',
      uploadedDate: '2024-01-10',
      type: 'PPTX'
    },
    {
      id: 4,
      name: 'Meeting_Notes_Jan8.txt',
      size: '45 KB',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-01-08',
      type: 'TXT'
    }
  ]);

  // Field editing state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [fieldValues, setFieldValues] = useState({
    'Opportunity Name': opportunity.name,
    'Amount': opportunity.amount.toString(),
    'Close Date': opportunity.closeDate,
    'Owner': opportunity.owner,
    'Primary Contact': opportunity.primaryContact,
    'Stage': opportunity.stage,
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
    'Description': 'High-potential opportunity from technology sector. Interested in enterprise solutions and has budget approval authority. Previous interactions have been positive and they\'ve expressed strong interest in our services.'
  });
  const [showLogEmailModal, setShowLogEmailModal] = useState(false);
  const [logEmailExpanded, setLogEmailExpanded] = useState(false);
  const [showCreateEmailModal, setShowCreateEmailModal] = useState(false);
  const [createEmailForm, setCreateEmailForm] = useState({
    to: 'Brian Halligan (Sample Contact)',
    from: 'Ankit Raj (araj7491@gmail.com)',
    cc: '',
    bcc: '',
    subject: '',
    content: '',
    createTask: false,
    taskType: 'To-do',
    taskDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [logEmailForm, setLogEmailForm] = useState({
    contacted: 'John Smith (Tech Corp)',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    content: '',
    createTask: false,
    taskName: 'Follow up on email discussion',
    taskPriority: 'medium',
    taskDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [logEmailModalPosition, setLogEmailModalPosition] = useState({ 
    x: Math.max(50, window.innerWidth - 500), 
    y: Math.max(50, window.innerHeight - 400) 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'contact', label: 'Contact', icon: UserCheck },
    { id: 'account', label: 'Account', icon: Building },
    { id: 'emails', label: 'E-mails', icon: Mail },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];


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
      case 'completed': return { ...styles.taskStatus, ...styles.statusCompleted };
      case 'pending': return { ...styles.taskStatus, ...styles.statusPending };
      default: return { ...styles.taskStatus, ...styles.statusPending };
    }
  };

  // Attachment handler functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newAttachment = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: formatFileSize(file.size),
        uploadedBy: 'John Smith', // Current user
        uploadedDate: new Date().toISOString().split('T')[0],
        type: getFileType(file.name)
      };

      setAttachments(prev => [...prev, newAttachment]);
    });

    setShowAttachmentModal(false);
    // Reset file input
    event.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  };

  // Field editing handler functions
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
  };

  const handleFieldCancel = () => {
    setEditingField(null);
  };

  const handleFieldHover = (fieldKey: string | null) => {
    if (editingField === null) {
      setHoveredField(fieldKey);
    }
  };

  // Log Email Modal handlers
  const handleLogEmailFormChange = (field: string, value: any) => {
    setLogEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogEmailSubmit = () => {
    // Add email to history (this would typically send to backend)
    console.log('Logging email:', logEmailForm);
    
    // If task creation is enabled, add task to tasks list
    if (logEmailForm.createTask) {
      const newTask = {
        id: tasks.length + 1,
        title: logEmailForm.taskName,
        description: `Follow-up task created from email log: ${logEmailForm.content.substring(0, 50)}...`,
        priority: logEmailForm.taskPriority,
        deadline: logEmailForm.taskDeadline,
        status: 'pending' as const,
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      setTasks(prev => [...prev, newTask]);
    }
    
    // Reset form and close modal
    setLogEmailForm({
      contacted: 'John Smith (Tech Corp)',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      content: '',
      createTask: false,
      taskName: 'Follow up on email discussion',
      taskPriority: 'medium',
      taskDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowLogEmailModal(false);
  };

  const handleCreateEmailFormChange = (field: string, value: any) => {
    setCreateEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateEmailSubmit = () => {
    console.log('Creating email:', createEmailForm);
    
    // If task creation is enabled, add task to tasks list
    if (createEmailForm.createTask) {
      const newTask = {
        id: tasks.length + 1,
        title: `Follow up on email: ${createEmailForm.subject}`,
        description: `Follow-up task created from email: ${createEmailForm.content.substring(0, 50)}...`,
        priority: 'medium',
        deadline: createEmailForm.taskDeadline,
        status: 'pending' as const,
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      setTasks(prev => [...prev, newTask]);
    }
    
    // Reset form and close modal
    setCreateEmailForm({
      to: 'Brian Halligan (Sample Contact)',
      from: 'Ankit Raj (araj7491@gmail.com)',
      cc: '',
      bcc: '',
      subject: '',
      content: '',
      createTask: false,
      taskType: 'To-do',
      taskDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowCreateEmailModal(false);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 450, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
      
      setLogEmailModalPosition({
        x: newX,
        y: newY
      });
    }
  }, [isDragging, dragOffset]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const formatToolbarButton = (icon: any, action: string, isActive = false) => {
    const IconComponent = icon;
    return (
      <button
        style={{
          ...styles.logEmailToolbarButton,
          backgroundColor: isActive ? '#e2e8f0' : 'transparent',
          color: isActive ? '#1f2937' : '#6b7280'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
          }
        }}
        onClick={() => console.log(`Format action: ${action}`)}
        title={action}
      >
        <IconComponent size={16} />
      </button>
    );
  };

  const renderTaskModal = () => {
    if (!showTaskForm) return null;

    return (
      <div style={styles.modalOverlay} onClick={() => setShowTaskForm(false)}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Create New Task</h3>
            <button 
              style={styles.modalCloseButton}
              onClick={() => setShowTaskForm(false)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleTaskSubmit}>
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

  const renderAttachmentModal = () => {
    if (!showAttachmentModal) return null;

    return (
      <div style={styles.modalOverlay} onClick={() => setShowAttachmentModal(false)}>
        <div style={styles.uploadModal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Upload Files</h3>
            <button 
              style={styles.modalCloseButton}
              onClick={() => setShowAttachmentModal(false)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          </div>
          
          <div 
            style={styles.uploadArea}
            onClick={triggerFileUpload}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.borderColor = '#2563eb';
              target.style.backgroundColor = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.borderColor = '#d1d5db';
              target.style.backgroundColor = '#f9fafb';
            }}
          >
            <div style={styles.uploadIcon}>
              <Upload size={40} />
            </div>
            <div style={styles.uploadText}>Click to upload files</div>
            <div style={styles.uploadSubtext}>
              Select files from your computer to upload
            </div>
          </div>
          
          <input
            id="fileInput"
            type="file"
            multiple
            style={styles.hiddenFileInput}
            onChange={handleFileUpload}
            accept="*/*"
          />
          
          <div style={styles.modalFooter}>
            <button 
              type="button" 
              style={styles.modalCancelButton}
              onClick={() => setShowAttachmentModal(false)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#6b7280';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'contact':
        return renderContactTab();
      case 'account':
        return renderAccountTab();
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
        return <div>Select a tab</div>;
    }
  };

  const renderEditableField = (label: string, fieldKey: string, isTextArea = false) => {
    const isEditing = editingField === fieldKey;
    const isHovered = hoveredField === fieldKey;
    const value = fieldValues[fieldKey as keyof typeof fieldValues] || '';

    return (
      <div style={styles.fieldGroup}>
        <label style={styles.fieldLabel}>{label}</label>
        <div 
          style={styles.editableFieldContainer}
          onMouseEnter={() => handleFieldHover(fieldKey)}
          onMouseLeave={() => handleFieldHover(null)}
        >
          {isEditing ? (
            <div>
              {isTextArea ? (
                <textarea
                  style={styles.fieldEditTextarea}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  style={styles.fieldEditInput}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  autoFocus
                />
              )}
              <div style={styles.fieldEditActions}>
                <button
                  style={styles.fieldSaveButton}
                  onClick={() => handleFieldSave(fieldKey, editingValue)}
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
                  onClick={handleFieldCancel}
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
            </div>
          ) : (
            <div 
              style={{
                ...(isTextArea ? styles.fieldValueDisplayDescription : styles.fieldValueDisplay),
                ...(isHovered ? styles.fieldValueClickable : {})
              }}
              onClick={() => handleFieldEdit(fieldKey)}
            >
              <span style={{ wordBreak: 'break-word' }}>{value}</span>
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
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Opportunity Information</h3>
          </div>
          <div style={styles.cardContent}>
            {renderEditableField('Opportunity Name', 'Opportunity Name')}
            {renderEditableField('Amount', 'Amount')}
            {renderEditableField('Close Date', 'Close Date')}
            {renderEditableField('Owner', 'Owner')}
            {renderEditableField('Primary Contact', 'Primary Contact')}
            {renderEditableField('Stage', 'Stage')}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Company Information</h3>
          </div>
          <div style={styles.cardContent}>
            {renderEditableField('Company Name', 'Company Name')}
            {renderEditableField('Industry', 'Industry')}
            {renderEditableField('Website', 'Website')}
            {renderEditableField('No. of Employees', 'No. of Employees')}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Address Information</h3>
          </div>
          <div style={styles.cardContent}>
            {renderEditableField('Address Line 1 (Street Address)', 'Address Line 1 (Street Address)')}
            {renderEditableField('Address Line 2 (Area, Street, Sector, Village)', 'Address Line 2 (Area, Street, Sector, Village)')}
            {renderEditableField('Landmark (optional)', 'Landmark (optional)')}
            {renderEditableField('City', 'City')}
            {renderEditableField('State', 'State')}
            {renderEditableField('Country', 'Country')}
            {renderEditableField('Postal Index', 'Postal Index')}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Description Information</h3>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.fieldGroupLast}>
              {renderEditableField('Description', 'Description', true)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContactTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Contact Information</h3>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Primary Contact</label>
              <div style={styles.fieldValueDisplay}>
                <span>{opportunity.primaryContact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAccountTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Account Information</h3>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Company Name</label>
              <div style={styles.fieldValueDisplay}>
                <span>Tech Corp</span>
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Industry</label>
              <div style={styles.fieldValueDisplay}>
                <span>Technology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailsTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>E-mails</h3>
            <div style={styles.emailActions}>
              <button
                style={styles.emailActionButton}
                onClick={() => setShowLogEmailModal(true)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#2563eb';
                }}
              >
                <Mail size={14} />
                Log Email
              </button>
              <button
                style={styles.emailActionButton}
                onClick={() => setShowCreateEmailModal(true)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#10b981';
                }}
              >
                <Plus size={14} />
                Create Email
              </button>
            </div>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.emptyState}>
              <Mail size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
              <h3 style={styles.emptyStateTitle}>No emails yet</h3>
              <p style={styles.emptyStateDescription}>
                Start a conversation by logging an email or creating a new one.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCallsTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Calls</h3>
            <button
              style={styles.addButton}
              onClick={() => console.log('Add call')}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#10b981';
              }}
            >
              <Plus size={14} />
              Log Call
            </button>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.emptyState}>
              <Phone size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
              <h3 style={styles.emptyStateTitle}>No calls logged</h3>
              <p style={styles.emptyStateDescription}>
                Keep track of your phone conversations by logging calls.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMeetingsTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Meetings</h3>
            <button
              style={styles.addButton}
              onClick={() => console.log('Schedule meeting')}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#10b981';
              }}
            >
              <Plus size={14} />
              Schedule Meeting
            </button>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.emptyState}>
              <Video size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
              <h3 style={styles.emptyStateTitle}>No meetings scheduled</h3>
              <p style={styles.emptyStateDescription}>
                Schedule meetings to keep track of your appointments and discussions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTasksTab = () => {
    const sortedTasks = getSortedTasks();

    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Tasks ({tasks.length})</h3>
            <button
              style={styles.addTaskButton}
              onClick={() => setShowTaskForm(true)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#10b981';
              }}
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>
          <div style={styles.cardContent}>
            {tasks.length > 0 ? (
              <table style={styles.tasksTable}>
                <thead style={styles.tasksTableHeader}>
                  <tr>
                    <th 
                      style={styles.tasksTableHeaderCell}
                      onClick={() => handleTaskSort('title')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Task
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th 
                      style={styles.tasksTableHeaderCell}
                      onClick={() => handleTaskSort('priority')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Priority
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th 
                      style={styles.tasksTableHeaderCell}
                      onClick={() => handleTaskSort('deadline')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Deadline
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th 
                      style={styles.tasksTableHeaderCell}
                      onClick={() => handleTaskSort('status')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Status
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map((task) => (
                    <tr 
                      key={task.id}
                      style={styles.tasksTableRow}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                      }}
                    >
                      <td style={styles.tasksTableCell}>
                        <div style={styles.taskTitle}>{task.title}</div>
                        <div style={styles.taskDescription}>{task.description}</div>
                      </td>
                      <td style={styles.tasksTableCell}>
                        <span style={getPriorityStyle(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td style={styles.tasksTableCell}>
                        {task.deadline || 'No deadline'}
                      </td>
                      <td style={styles.tasksTableCell}>
                        <span style={getStatusStyle(task.status)}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyState}>
                <CheckCircle size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                <h3 style={styles.emptyStateTitle}>No tasks yet</h3>
                <p style={styles.emptyStateDescription}>
                  Create your first task to start tracking your to-dos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAttachmentsTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Attachments ({attachments.length})</h3>
            <button
              style={styles.addAttachmentButton}
              onClick={() => setShowAttachmentModal(true)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#2563eb';
              }}
            >
              <Plus size={14} />
              Upload Files
            </button>
          </div>
          <div style={styles.cardContent}>
            {attachments.length > 0 ? (
              <table style={styles.attachmentsTable}>
                <thead style={styles.attachmentsTableHeader}>
                  <tr>
                    <th style={styles.attachmentsTableHeaderCell}>Name</th>
                    <th style={styles.attachmentsTableHeaderCell}>Size</th>
                    <th style={styles.attachmentsTableHeaderCell}>Uploaded By</th>
                    <th style={styles.attachmentsTableHeaderCell}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attachments.map((attachment) => (
                    <tr 
                      key={attachment.id}
                      style={styles.attachmentsTableRow}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                      }}
                    >
                      <td style={styles.attachmentsTableCell}>
                        <div style={styles.attachmentName}>
                          <FileText size={16} />
                          {attachment.name}
                        </div>
                      </td>
                      <td style={styles.attachmentsTableCell}>
                        <span style={styles.attachmentSize}>{attachment.size}</span>
                      </td>
                      <td style={styles.attachmentsTableCell}>
                        {attachment.uploadedBy}
                      </td>
                      <td style={styles.attachmentsTableCell}>
                        <span style={styles.attachmentDate}>{attachment.uploadedDate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyState}>
                <Paperclip size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                <h3 style={styles.emptyStateTitle}>No attachments yet</h3>
                <p style={styles.emptyStateDescription}>
                  Upload files to keep important documents with this opportunity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineTab = () => {
    return (
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Timeline</h3>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.emptyState}>
              <Clock size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
              <h3 style={styles.emptyStateTitle}>No timeline events</h3>
              <p style={styles.emptyStateDescription}>
                Activity will appear here as you interact with this opportunity.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLogEmailModal = () => {
    if (!showLogEmailModal) return null;

    return (
      <>
        <div style={styles.modalOverlay} onClick={() => setShowLogEmailModal(false)} />
        <div 
          style={{
            ...styles.logEmailModal,
            left: `${logEmailModalPosition.x}px`,
            top: `${logEmailModalPosition.y}px`,
          }}
        >
          <div 
            style={styles.logEmailModalHeader}
            onMouseDown={handleDragStart}
          >
            <h3 style={styles.logEmailModalTitle}>Log Email</h3>
            <div style={styles.logEmailModalControls}>
              <button
                style={styles.logEmailExpandButton}
                onClick={() => setLogEmailExpanded(!logEmailExpanded)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <Maximize2 size={14} />
              </button>
              <button
                style={styles.logEmailCloseButton}
                onClick={() => setShowLogEmailModal(false)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
          
          <div style={styles.logEmailModalBody}>
            <div style={styles.logEmailFormRow}>
              <div style={styles.logEmailFormField}>
                <label style={styles.logEmailLabel}>Contacted</label>
                <input
                  type="text"
                  style={styles.logEmailInput}
                  value={logEmailForm.contacted}
                  onChange={(e) => handleLogEmailFormChange('contacted', e.target.value)}
                />
              </div>
              <div style={styles.logEmailFormFieldSmall}>
                <label style={styles.logEmailLabel}>Date</label>
                <input
                  type="date"
                  style={styles.logEmailInput}
                  value={logEmailForm.date}
                  onChange={(e) => handleLogEmailFormChange('date', e.target.value)}
                />
              </div>
              <div style={styles.logEmailFormFieldSmall}>
                <label style={styles.logEmailLabel}>Time</label>
                <input
                  type="time"
                  style={styles.logEmailInput}
                  value={logEmailForm.time}
                  onChange={(e) => handleLogEmailFormChange('time', e.target.value)}
                />
              </div>
            </div>

            <div style={styles.logEmailFormField}>
              <label style={styles.logEmailLabel}>Body</label>
              <div style={styles.logEmailToolbar}>
                {formatToolbarButton(Bold, 'Bold')}
                {formatToolbarButton(Italic, 'Italic')}
                {formatToolbarButton(Underline, 'Underline')}
                {formatToolbarButton(Link, 'Link')}
                {formatToolbarButton(List, 'List')}
                {formatToolbarButton(Image, 'Image')}
              </div>
              <textarea
                style={styles.logEmailTextarea}
                value={logEmailForm.content}
                onChange={(e) => handleLogEmailFormChange('content', e.target.value)}
                placeholder="Enter email content..."
              />
            </div>

            <div style={styles.logEmailTaskSection}>
              <div style={styles.logEmailCheckboxContainer}>
                <input
                  type="checkbox"
                  style={styles.logEmailCheckbox}
                  checked={logEmailForm.createTask}
                  onChange={(e) => handleLogEmailFormChange('createTask', e.target.checked)}
                />
                <span style={styles.logEmailCheckboxLabel}>
                  Create follow-up task
                </span>
              </div>
              
              {logEmailForm.createTask && (
                <div style={styles.logEmailTaskDetails}>
                  <div style={styles.logEmailFormRow}>
                    <div style={styles.logEmailFormField}>
                      <label style={styles.logEmailLabel}>Task Name</label>
                      <input
                        type="text"
                        style={styles.logEmailInput}
                        value={logEmailForm.taskName}
                        onChange={(e) => handleLogEmailFormChange('taskName', e.target.value)}
                      />
                    </div>
                    <div style={styles.logEmailFormFieldSmall}>
                      <label style={styles.logEmailLabel}>Priority</label>
                      <select
                        style={styles.logEmailSelect}
                        value={logEmailForm.taskPriority}
                        onChange={(e) => handleLogEmailFormChange('taskPriority', e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div style={styles.logEmailFormFieldSmall}>
                      <label style={styles.logEmailLabel}>Deadline</label>
                      <input
                        type="date"
                        style={styles.logEmailInput}
                        value={logEmailForm.taskDeadline}
                        onChange={(e) => handleLogEmailFormChange('taskDeadline', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div style={styles.logEmailModalFooter}>
            <div style={styles.logEmailAssociated}>Associated with 2 records</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={styles.logEmailCancelButton}
                onClick={() => setShowLogEmailModal(false)}
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
                style={styles.logEmailSaveButton}
                onClick={handleLogEmailSubmit}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#2563eb';
                }}
              >
                Log Email
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCreateEmailModal = () => {
    if (!showCreateEmailModal) return null;

    return (
      <>
        <div style={styles.modalOverlay} onClick={() => setShowCreateEmailModal(false)} />
        <div style={styles.createEmailModal}>
          <div style={styles.createEmailModalHeader}>
            <h3 style={styles.createEmailModalTitle}>New Email</h3>
            <button
              style={styles.createEmailCloseButton}
              onClick={() => setShowCreateEmailModal(false)}
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
          
          <div style={styles.createEmailModalBody}>
            <div style={styles.createEmailFormField}>
              <label style={styles.createEmailLabel}>To</label>
              <input
                type="text"
                style={styles.createEmailInput}
                value={createEmailForm.to}
                onChange={(e) => handleCreateEmailFormChange('to', e.target.value)}
              />
            </div>

            <div style={styles.createEmailFormField}>
              <label style={styles.createEmailLabel}>From</label>
              <input
                type="text"
                style={styles.createEmailInput}
                value={createEmailForm.from}
                onChange={(e) => handleCreateEmailFormChange('from', e.target.value)}
                readOnly
              />
            </div>

            <div style={styles.createEmailFormRow}>
              <div style={styles.createEmailFormField}>
                <label style={styles.createEmailLabel}>CC</label>
                <input
                  type="text"
                  style={styles.createEmailInput}
                  value={createEmailForm.cc}
                  onChange={(e) => handleCreateEmailFormChange('cc', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div style={styles.createEmailFormField}>
                <label style={styles.createEmailLabel}>BCC</label>
                <input
                  type="text"
                  style={styles.createEmailInput}
                  value={createEmailForm.bcc}
                  onChange={(e) => handleCreateEmailFormChange('bcc', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div style={styles.createEmailFormField}>
              <label style={styles.createEmailLabel}>Subject</label>
              <input
                type="text"
                style={styles.createEmailInput}
                value={createEmailForm.subject}
                onChange={(e) => handleCreateEmailFormChange('subject', e.target.value)}
                placeholder="Enter subject"
              />
            </div>

            <div style={styles.createEmailFormField}>
              <label style={styles.createEmailLabel}>Content</label>
              <div style={styles.createEmailToolbar}>
                {formatToolbarButton(Bold, 'Bold')}
                {formatToolbarButton(Italic, 'Italic')}
                {formatToolbarButton(Underline, 'Underline')}
                {formatToolbarButton(Link, 'Link')}
                {formatToolbarButton(List, 'List')}
                {formatToolbarButton(Image, 'Image')}
              </div>
              <textarea
                style={styles.createEmailTextarea}
                value={createEmailForm.content}
                onChange={(e) => handleCreateEmailFormChange('content', e.target.value)}
                placeholder="Type your message..."
              />
            </div>

            <div style={styles.createEmailCheckboxContainer}>
              <input
                type="checkbox"
                style={styles.createEmailCheckbox}
                checked={createEmailForm.createTask}
                onChange={(e) => handleCreateEmailFormChange('createTask', e.target.checked)}
              />
              <span>
                Create a <strong>{createEmailForm.taskType}</strong> task to follow up{' '}
                <strong>In 3 business days (Wednesday)</strong>
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={styles.logEmailAssociated}>Associated with 2 records</span>
              <button
                style={styles.createEmailSendButton}
                onClick={handleCreateEmailSubmit}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#2563eb';
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#f8fafc',
      fontFamily: '"Inter", sans-serif'
    },
    opportunityCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '4px 8px',
      padding: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      flexShrink: 0
    },
    opportunityHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    opportunityLeft: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: '12px',
      alignItems: 'flex-start'
    },
    universalBackButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '14px',
      marginTop: '4px'
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
      width: '40px',
      height: '40px',
      borderRadius: '0px',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      fontWeight: '900'
    },
    opportunityTitle: {
      fontSize: '36px',
      fontWeight: '900',
      color: '#1e293b',
      margin: 0,
      lineHeight: '1.0'
    },
    titleInfo: {
      fontSize: '11px',
      color: '#64748b',
      margin: 0,
      marginTop: '-2px',
      textAlign: 'left' as const
    },
    opportunityRight: {
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
      margin: '0 8px 8px 8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      overflow: 'visible',
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const
    },
    tabsContainer: {
      padding: '0',
      flexShrink: 0
    },
    tabs: {
      display: 'flex',
      gap: '0',
      borderBottom: '1px solid #e2e8f0'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#64748b',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      borderBottom: '2px solid transparent',
      transition: 'color 0.2s, background-color 0.2s',
      position: 'relative' as const
    },
    tabActive: {
      color: '#3b82f6',
      borderBottom: '2px solid #3b82f6',
      backgroundColor: '#f8fafc'
    },
    tabContent: {
      padding: '8px',
      flex: 1,
      overflow: 'visible'
    },
    mainContent: {
      flex: 1,
      padding: '0 8px 8px 8px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      marginBottom: '6px',
      flexShrink: 0
    },
    cardHeader: {
      padding: '8px 10px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    cardTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    cardContent: {
      padding: '8px 10px'
    },
    fieldGroup: {
      marginBottom: '8px'
    },
    fieldGroupLast: {
      marginBottom: '0'
    },
    fieldLabel: {
      display: 'block',
      fontSize: '11px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px'
    },
    fieldValueDisplay: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 8px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '13px',
      color: '#1e293b'
    },
    fieldValueDisplayDescription: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '12px 8px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '13px',
      color: '#1e293b',
      minHeight: '80px'
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
    },
    // Attachments styles
    addAttachmentButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
      marginBottom: '12px'
    },
    attachmentsTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      backgroundColor: 'white',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0'
    },
    attachmentsTableHeader: {
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    attachmentsTableHeaderCell: {
      padding: '8px 10px',
      textAlign: 'left' as const,
      fontSize: '11px',
      fontWeight: '600',
      color: '#374151'
    },
    attachmentsTableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s',
      backgroundColor: 'white'
    },
    attachmentsTableCell: {
      padding: '8px 10px',
      fontSize: '12px',
      color: '#374151'
    },
    attachmentName: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#2563eb',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    attachmentSize: {
      color: '#6b7280',
      fontSize: '11px'
    },
    attachmentDate: {
      color: '#6b7280',
      fontSize: '11px'
    },
    // Task styles
    tasksTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      backgroundColor: 'white',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0'
    },
    tasksTableHeader: {
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    tasksTableHeaderCell: {
      padding: '8px 10px',
      textAlign: 'left' as const,
      fontSize: '11px',
      fontWeight: '600',
      color: '#374151',
      cursor: 'pointer',
      userSelect: 'none' as const
    },
    tasksTableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s',
      backgroundColor: 'white'
    },
    tasksTableCell: {
      padding: '8px 10px',
      fontSize: '12px',
      color: '#374151',
      verticalAlign: 'top' as const
    },
    priorityHigh: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '2px 6px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '500'
    },
    priorityMedium: {
      backgroundColor: '#fef3c7',
      color: '#d97706',
      padding: '2px 6px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '500'
    },
    priorityLow: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
      padding: '2px 6px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '500'
    },
    taskTitle: {
      fontWeight: '500',
      color: '#1e293b',
      marginBottom: '2px'
    },
    taskDescription: {
      color: '#6b7280',
      fontSize: '11px'
    },
    taskStatus: {
      padding: '2px 6px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '500'
    },
    statusPending: {
      backgroundColor: '#f3f4f6',
      color: '#6b7280'
    },
    statusCompleted: {
      backgroundColor: '#dcfce7',
      color: '#16a34a'
    },
    // Empty state styles
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center' as const
    },
    emptyStateTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      margin: '0 0 8px 0'
    },
    emptyStateDescription: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
      maxWidth: '300px'
    },
    // Add button styles
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    addTaskButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    // Email action styles
    emailActions: {
      display: 'flex',
      gap: '8px'
    },
    emailActionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    modalHeader: {
      padding: '16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    modalCloseButton: {
      padding: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalBody: {
      padding: '16px',
      maxHeight: '60vh',
      overflow: 'auto'
    },
    modalFormField: {
      marginBottom: '16px'
    },
    modalFormRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px'
    },
    modalFormFieldHalf: {
      flex: 1
    },
    modalLabel: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px'
    },
    modalInput: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none'
    },
    modalSelect: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none'
    },
    modalTextarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical' as const
    },
    modalFooter: {
      padding: '16px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px'
    },
    modalCancelButton: {
      padding: '8px 16px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
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
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    // Upload modal styles
    uploadModal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    uploadArea: {
      border: '3px dashed #d1d5db',
      borderRadius: '8px',
      padding: '40px 20px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      backgroundColor: '#f9fafb',
      margin: '16px',
      transition: 'all 0.2s'
    },
    uploadIcon: {
      color: '#9ca3af',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'center'
    },
    uploadText: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px'
    },
    uploadSubtext: {
      fontSize: '14px',
      color: '#6b7280'
    },
    hiddenFileInput: {
      display: 'none'
    },
    // Log Email Modal styles (floating modal)
    logEmailModal: {
      position: 'fixed' as const,
      width: '450px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      zIndex: 1001,
      border: '1px solid #e2e8f0'
    },
    logEmailModalHeader: {
      padding: '12px 16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'move',
      backgroundColor: '#f8fafc'
    },
    logEmailModalTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    logEmailModalControls: {
      display: 'flex',
      gap: '4px'
    },
    logEmailExpandButton: {
      padding: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center'
    },
    logEmailCloseButton: {
      padding: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center'
    },
    logEmailModalBody: {
      padding: '16px',
      maxHeight: '400px',
      overflow: 'auto'
    },
    logEmailFormRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '12px'
    },
    logEmailFormField: {
      flex: 1,
      marginBottom: '12px'
    },
    logEmailFormFieldSmall: {
      width: '120px',
      marginBottom: '12px'
    },
    logEmailLabel: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px'
    },
    logEmailInput: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '13px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none'
    },
    logEmailSelect: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '13px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none'
    },
    logEmailToolbar: {
      display: 'flex',
      gap: '2px',
      padding: '8px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    logEmailToolbarButton: {
      padding: '6px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s'
    },
    logEmailTextarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderTop: 'none',
      borderRadius: '0 0 4px 4px',
      fontSize: '13px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical' as const,
      fontFamily: '"Inter", sans-serif'
    },
    logEmailTaskSection: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e2e8f0'
    },
    logEmailCheckboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    },
    logEmailCheckbox: {
      width: '16px',
      height: '16px'
    },
    logEmailCheckboxLabel: {
      fontSize: '13px',
      color: '#374151'
    },
    logEmailTaskDetails: {
      marginLeft: '24px'
    },
    logEmailModalFooter: {
      padding: '12px 16px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f8fafc'
    },
    logEmailAssociated: {
      fontSize: '12px',
      color: '#6b7280'
    },
    logEmailCancelButton: {
      padding: '6px 12px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    logEmailSaveButton: {
      padding: '6px 12px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    // Create Email Modal styles (full screen modal)
    createEmailModal: {
      position: 'fixed' as const,
      top: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '700px',
      height: '80%',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      zIndex: 1001,
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column' as const
    },
    createEmailModalHeader: {
      padding: '16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f8fafc',
      flexShrink: 0
    },
    createEmailModalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    createEmailCloseButton: {
      padding: '6px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center'
    },
    createEmailModalBody: {
      padding: '20px',
      flex: 1,
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column' as const
    },
    createEmailFormField: {
      marginBottom: '16px'
    },
    createEmailFormRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px'
    },
    createEmailLabel: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    createEmailInput: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none'
    },
    createEmailToolbar: {
      display: 'flex',
      gap: '2px',
      padding: '8px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    createEmailTextarea: {
      width: '100%',
      padding: '16px',
      border: '1px solid #d1d5db',
      borderTop: 'none',
      borderRadius: '0 0 6px 6px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      outline: 'none',
      minHeight: '200px',
      resize: 'vertical' as const,
      fontFamily: '"Inter", sans-serif',
      flex: 1
    },
    createEmailCheckboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '16px',
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#f8fafc',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    },
    createEmailCheckbox: {
      width: '16px',
      height: '16px'
    },
    createEmailSendButton: {
      padding: '8px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>

      {/* Opportunity Information Card */}
      <div style={styles.opportunityCard}>
        <div style={styles.opportunityHeader}>
          <div style={styles.opportunityLeft}>
            {/* Universal Back Button */}
            <button
              style={styles.universalBackButton}
              onClick={onBack}
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div style={styles.logoSection}>
              <div style={styles.companyLogo}>
                {opportunity.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.companyBelowLogo}>
                <Building size={10} />
                <span>Tech Corp</span>
              </div>
            </div>
            <div style={styles.nameAndDetails}>
              <h1 style={styles.opportunityTitle}>{opportunity.name}</h1>
              <div style={styles.titleInfo}>
                <span>${opportunity.amount.toLocaleString()} • {opportunity.closeDate}</span>
              </div>
            </div>
          </div>
          <div style={styles.opportunityRight}>
            <button 
              style={styles.convertButton}
            >
              <UserPlus size={16} />
              Convert Opportunity
            </button>
          </div>
        </div>
      </div>


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
      {renderAttachmentModal()}
      {renderLogEmailModal()}
      {renderCreateEmailModal()}
    </div>
  );
};

export default OpportunityDetails;