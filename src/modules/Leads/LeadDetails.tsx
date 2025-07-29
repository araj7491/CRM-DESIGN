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
  Maximize2
} from 'lucide-react';

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

interface LeadDetailsProps {
  lead: Lead;
  onBack: () => void;
  onSave: (updatedLead: Lead) => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentStage, setCurrentStage] = useState(lead.status);
  
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
    'Description': 'High-potential lead from technology sector. Interested in enterprise solutions and has budget approval authority. Previous interactions have been positive and they\'ve expressed strong interest in our services.'
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
  
  // Pipeline hover state
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);
  
  const pipelineStages = [
    { id: 'New', label: 'New', number: 1 },
    { id: 'Contacted', label: 'Contacted', number: 2 },
    { id: 'Qualified', label: 'Qualified', number: 3 },
    { id: 'Proposed', label: 'Proposed', number: 4 },
    { id: 'Closed', label: 'Closed', number: 5 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'emails', label: 'E-mails', icon: Mail },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  const handleStageChange = (stage: string) => {
    setCurrentStage(stage);
  };

  const getCurrentStageIndex = () => {
    return pipelineStages.findIndex(stage => stage.id === currentStage);
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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#f8fafc',
      fontFamily: '"Inter", sans-serif'
    },
    leadCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      margin: '4px 8px',
      padding: '8px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      flexShrink: 0
    },
    leadHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    leadLeft: {
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
    leadTitle: {
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
    leadRight: {
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
    // Pipeline styles - Sleek pencil-like design
    pipelineContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      margin: '0 8px 8px 8px',
      padding: '16px 20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
      flexShrink: 0
    },
    pipelineSteps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0',
      overflow: 'hidden'
    },
    pipelineStepsContainer: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      gap: '0',
      justifyContent: 'center'
    },
    stage: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      marginRight: '-2px',
      zIndex: 1
    },
    stageHover: {
      transform: 'scale(1.02)',
      zIndex: 10,
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))'
    },

    stageChevron: {
      position: 'relative' as const,
      width: '120px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    },
    stageContent: {
      position: 'relative' as const,
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      color: 'white',
      padding: '6px 12px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    },
    stageLabel: {
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },


    closeOpportunityButtons: {
      display: 'flex',
      gap: '8px',
      marginLeft: '16px'
    },
    closeOpportunityOptions: {
      display: 'flex',
      gap: '8px',
      marginLeft: '16px'
    },
    closeOpportunityWonButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: '#16a34a',
      color: 'white',
      fontSize: '13px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s',
      whiteSpace: 'nowrap' as const
    },
    closeOpportunityLostButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: '#dc2626',
      color: 'white',
      fontSize: '13px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s',
      whiteSpace: 'nowrap' as const
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
    sortHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
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
      padding: '20px',
      width: '500px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e2e8f0'
    },
    modalTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    modalCloseButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      borderRadius: '4px'
    },
    modalBody: {
      marginBottom: '16px'
    },
    modalFormRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '12px'
    },
    modalFormField: {
      marginBottom: '12px'
    },
    modalFormFieldHalf: {
      flex: '1'
    },
    modalLabel: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    modalInput: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#1e293b',
      boxSizing: 'border-box' as const
    },
    modalTextarea: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#1e293b',
      minHeight: '120px',
      resize: 'vertical' as const,
      boxSizing: 'border-box' as const
    },
    modalSelect: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#1e293b',
      backgroundColor: 'white',
      boxSizing: 'border-box' as const
    },
    modalFooter: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
      paddingTop: '12px',
      borderTop: '1px solid #e2e8f0'
    },
    modalCancelButton: {
      padding: '8px 16px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
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
      fontSize: '13px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    // Upload modal styles
    uploadModal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      width: '400px',
      maxWidth: '90vw',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    uploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '30px',
      textAlign: 'center' as const,
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginBottom: '16px'
    },
    uploadAreaHover: {
      borderColor: '#2563eb',
      backgroundColor: '#eff6ff'
    },
    uploadIcon: {
      marginBottom: '12px',
      color: '#6b7280'
    },
    uploadText: {
      fontSize: '14px',
      color: '#374151',
      marginBottom: '4px',
      fontWeight: '500'
    },
    uploadSubtext: {
      fontSize: '12px',
      color: '#6b7280'
    },
    hiddenFileInput: {
      display: 'none'
    },
    // Timeline styles
    timelineContainer: {
      padding: '16px'
    },
    timelineEntry: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      alignItems: 'flex-start'
    },
    timelineIconContainer: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    timelineIconPhone: {
      backgroundColor: '#dbeafe',
      color: '#2563eb'
    },
    timelineIconEmail: {
      backgroundColor: '#dcfce7',
      color: '#16a34a'
    },
    timelineIconNote: {
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    timelineIconStatus: {
      backgroundColor: '#fed7d7',
      color: '#dc2626'
    },
    timelineIconVideo: {
      backgroundColor: '#e0e7ff',
      color: '#4f46e5'
    },
    timelineContent: {
      flex: 1
    },
    timelineTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    timelineDescription: {
      fontSize: '13px',
      color: '#64748b',
      marginBottom: '6px',
      lineHeight: '1.4'
    },
    timelineMetadata: {
      fontSize: '12px',
      color: '#94a3b8'
    },
    timelineTime: {
      fontSize: '12px',
      color: '#94a3b8',
      minWidth: '80px',
      textAlign: 'right' as const,
      marginTop: '2px'
    },
    loadMoreButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '12px',
      backgroundColor: 'transparent',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      color: '#2563eb',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '16px'
    },
    // Activity styles
    activityContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    activityBox: {
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    activityHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    activityTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b'
    },
    activityActions: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: '8px',
      alignItems: 'center'
    },
    activityActionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      padding: '8px 14px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
      minWidth: '85px',
      height: '32px'
    },
    activitySecondaryButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      padding: '8px 14px',
      backgroundColor: 'transparent',
      color: '#6b7280',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500',
      transition: 'all 0.2s',
      minWidth: '85px',
      height: '32px'
    },
    activityTable: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    activityTableHeader: {
      backgroundColor: '#f8fafc'
    },
    activityTableHeaderCell: {
      padding: '8px 12px',
      textAlign: 'left' as const,
      fontSize: '11px',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e2e8f0'
    },
    activityTableRow: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s',
      backgroundColor: 'white'
    },
    activityTableCell: {
      padding: '8px 12px',
      fontSize: '12px',
      color: '#374151'
    },
    activityEmptyState: {
      textAlign: 'center' as const,
      padding: '32px 16px',
      color: '#6b7280',
      fontSize: '13px'
    },
    // Log Email Modal styles (no overlay for live box)
    logEmailModalContainer: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none' as const,
      zIndex: 1000
    },
    logEmailModal: {
      position: 'absolute' as const,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '450px',
      maxWidth: '90vw',
      maxHeight: '70vh',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      pointerEvents: 'auto' as const
    },
    logEmailModalExpanded: {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      width: '700px',
      height: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      pointerEvents: 'auto' as const,
      zIndex: 1001
    },
    logEmailOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1000
    },
    logEmailHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: '#14235f',
      color: 'white',
      cursor: 'move',
      userSelect: 'none' as const,
      borderBottom: '1px solid #e5e7eb'
    },
    logEmailTitle: {
      fontSize: '14px',
      fontWeight: '600',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    logEmailHeaderActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logEmailHeaderButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      transition: 'background-color 0.2s'
    },
    logEmailBody: {
      padding: '16px',
      maxHeight: 'calc(70vh - 120px)',
      overflowY: 'auto' as const
    },
    logEmailBodyExpanded: {
      padding: '20px',
      height: 'calc(600px - 120px)',
      overflowY: 'auto' as const
    },
    logEmailFormSection: {
      marginBottom: '16px'
    },
    logEmailFormRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      alignItems: 'flex-end',
      flexWrap: 'wrap' as const
    },
    logEmailFormField: {
      flex: 1,
      minWidth: '150px',
      display: 'flex',
      flexDirection: 'column' as const
    },
    logEmailFormFieldHalf: {
      flex: '0 0 calc(50% - 6px)',
      minWidth: '140px',
      display: 'flex',
      flexDirection: 'column' as const
    },
    logEmailFormFieldThird: {
      flex: '0 0 calc(33.333% - 8px)',
      minWidth: '100px',
      display: 'flex',
      flexDirection: 'column' as const
    },
    logEmailLabel: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px'
    },
    logEmailInput: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      transition: 'border-color 0.2s',
      backgroundColor: 'white',
      boxSizing: 'border-box' as const
    },
    logEmailTextarea: {
      width: '100%',
      minHeight: '100px',
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      backgroundColor: 'white',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const
    },
    logEmailTextareaExpanded: {
      width: '100%',
      minHeight: '150px',
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      backgroundColor: 'white',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const
    },
    logEmailToolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 10px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      flexWrap: 'wrap' as const,
      borderTopLeftRadius: '6px',
      borderTopRightRadius: '6px'
    },
    logEmailToolbarButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#6b7280',
      transition: 'all 0.2s'
    },
    logEmailToolbarDivider: {
      width: '1px',
      height: '20px',
      backgroundColor: '#d1d5db',
      margin: '0 6px'
    },
    logEmailContentContainer: {
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      marginBottom: '16px',
      overflow: 'hidden'
    },
    logEmailTaskSection: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      padding: '12px',
      marginBottom: '16px'
    },
    logEmailTaskHeader: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '14px'
    },
    logEmailTaskOption: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      marginBottom: '12px'
    },
    logEmailTaskCheckbox: {
      width: '16px',
      height: '16px',
      marginTop: '2px',
      cursor: 'pointer',
      accentColor: '#2563eb'
    },
    logEmailTaskDescription: {
      fontSize: '13px',
      color: '#374151',
      lineHeight: '1.5',
      flex: 1
    },
    logEmailTaskInputs: {
      display: 'flex',
      gap: '12px',
      marginTop: '10px',
      marginLeft: '26px'
    },
    logEmailTaskInput: {
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      flex: 1,
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const
    },
    logEmailTaskSelect: {
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const
    },
    logEmailFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #e2e8f0'
    },
    logEmailAssociated: {
      fontSize: '12px',
      color: '#3b82f6',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    logEmailSubmitButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    // Create Email Modal styles
    createEmailModal: {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '800px',
      height: '650px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      pointerEvents: 'auto' as const,
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column' as const
    },
    createEmailHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: '#2563eb',
      color: 'white',
      flexShrink: 0
    },
    createEmailTitle: {
      fontSize: '16px',
      fontWeight: '600',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    createEmailTabs: {
      display: 'flex',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      padding: '0 20px',
      flexShrink: 0
    },
    createEmailTab: {
      padding: '12px 16px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#6b7280',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    createEmailTabActive: {
      color: '#2563eb',
      borderBottom: '2px solid #2563eb'
    },
    createEmailBody: {
      padding: '20px',
      flex: 1,
      overflowY: 'auto' as const,
      minHeight: 0
    },
    createEmailFormRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      gap: '12px'
    },
    createEmailLabel: {
      minWidth: '50px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    createEmailInput: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.2s'
    },
    createEmailCcBcc: {
      fontSize: '12px',
      color: '#2563eb',
      cursor: 'pointer',
      textDecoration: 'none',
      marginLeft: '8px'
    },
    createEmailSubjectRow: {
      marginBottom: '16px'
    },
    createEmailContent: {
      marginBottom: '16px'
    },
    createEmailTextarea: {
      width: '100%',
      height: '250px',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      resize: 'none' as const,
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const
    },
    createEmailFooter: {
      borderTop: '1px solid #e2e8f0',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f8fafc',
      flexShrink: 0
    },
    createEmailTaskSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#374151'
    },
    createEmailTaskCheckbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer'
    },
    createEmailSendButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

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



  const renderPipelineView = () => {
    const currentIndex = getCurrentStageIndex();

    return (
      <div style={styles.pipelineContainer}>
        <div style={styles.pipelineSteps}>
          <div style={styles.pipelineStepsContainer}>
            {pipelineStages.map((stage, index) => {
              const status = getStageStatus(stage, index);
              const isHovered = hoveredStageIndex === index;
              
              // Determine background color based on status
              const getStageColor = () => {
                if (status.completed || status.active) return '#14235f'; // Dark blue for active/completed
                return '#93c5fd'; // Light blue for default state
              };

              const getHoverColor = () => {
                if (status.completed || status.active) return '#1e3a8a'; // Slightly lighter dark blue on hover
                return '#7dd3fc'; // Slightly lighter blue on hover
              };
              
              return (
                <div
                  key={stage.id}
                  style={{
                    ...styles.stage,
                    ...(isHovered ? styles.stageHover : {})
                  }}
                  onClick={() => handleStageChange(stage.id)}
                  onMouseEnter={() => setHoveredStageIndex(index)}
                  onMouseLeave={() => setHoveredStageIndex(null)}
                >
                  {/* Sleek pencil-like arrow shape */}
                  <div 
                    style={{
                      ...styles.stageChevron,
                      backgroundColor: isHovered ? getHoverColor() : getStageColor(),
                      clipPath: index === 0 
                        ? 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)'
                        : index === pipelineStages.length - 1
                        ? 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)'
                        : 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)',
                      transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                      boxShadow: isHovered 
                        ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                        : '0 2px 4px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div style={styles.stageContent}>
                      <span style={styles.stageLabel}>{stage.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {currentStage === 'Closed' && (
            <div style={styles.closeOpportunityButtons}>
              <button
                style={styles.closeOpportunityWonButton}
                onClick={() => {
                  console.log('Opportunity won');
                  // Handle opportunity won logic here
                }}
              >
                <CheckCircle size={12} />
                Close Opportunity as Won
              </button>
              <button
                style={styles.closeOpportunityLostButton}
                onClick={() => {
                  console.log('Opportunity lost');
                  // Handle opportunity lost logic here
                }}
              >
                <X size={12} />
                Close Opportunity as Lost
              </button>
            </div>
          )}
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
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                    }}
                  >
                    {renderRow(item)}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.activityEmptyState}>
              No {title.toLowerCase()} history found
            </div>
          )}
        </div>
      );
    };

    return (
      <div style={styles.activityContainer}>
        {renderEmailActivityBox(
          'Email History',
          Mail,
          emailHistory,
          ['Subject', 'Direction', 'Date', 'Time'],
          (email) => (
            <>
              <td style={styles.activityTableCell}>
                <span 
                  style={{
                    color: '#2563eb',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                  onClick={() => {
                    setLogEmailForm(prev => ({
                      ...prev,
                      content: `Re: ${email.subject}`
                    }));
                    setShowLogEmailModal(true);
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.textDecoration = 'none';
                  }}
                >
                  {email.subject}
                </span>
              </td>
              <td style={styles.activityTableCell}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '500',
                  backgroundColor: email.direction === 'Sent' ? '#dcfce7' : '#dbeafe',
                  color: email.direction === 'Sent' ? '#16a34a' : '#2563eb'
                }}>
                  {email.direction}
                </span>
              </td>
              <td style={styles.activityTableCell}>{email.date}</td>
              <td style={styles.activityTableCell}>{email.time}</td>
            </>
          ),
          'Log Email',
          'Create Email'
        )}
      </div>
    );
  };

  const renderCallsTab = () => {
    // Sample call data
    const callHistory = [
      {
        id: 1,
        type: 'Outbound',
        duration: '15 mins',
        date: '2024-01-16',
        time: '11:00 AM',
        status: 'Completed'
      },
      {
        id: 2,
        type: 'Inbound',
        duration: '8 mins',
        date: '2024-01-13',
        time: '3:30 PM',
        status: 'Completed'
      }
    ];

    const renderCallActivityBox = (title: string, icon: any, data: any[], headers: string[], renderRow: (item: any) => React.ReactNode, primaryAction: string, secondaryAction: string) => {
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
                  console.log(`${secondaryAction} clicked`);
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
                  console.log(`${primaryAction} clicked`);
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
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                    }}
                  >
                    {renderRow(item)}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.activityEmptyState}>
              No {title.toLowerCase()} history found
            </div>
          )}
        </div>
      );
    };

    return (
      <div style={styles.activityContainer}>
        {renderCallActivityBox(
          'Call History',
          Phone,
          callHistory,
          ['Type', 'Duration', 'Date', 'Time', 'Status'],
          (call) => (
            <>
              <td style={styles.activityTableCell}>{call.type}</td>
              <td style={styles.activityTableCell}>{call.duration}</td>
              <td style={styles.activityTableCell}>{call.date}</td>
              <td style={styles.activityTableCell}>{call.time}</td>
              <td style={styles.activityTableCell}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '500',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a'
                }}>
                  {call.status}
                </span>
              </td>
            </>
          ),
          'Log Call',
          'Create Call'
        )}
      </div>
    );
  };

  const renderMeetingsTab = () => {
    // Sample meeting data
    const meetingHistory = [
      {
        id: 1,
        title: 'Project Requirements Discussion',
        type: 'Video Call',
        date: '2024-01-17',
        time: '2:00 PM',
        duration: '30 mins',
        status: 'Scheduled'
      },
      {
        id: 2,
        title: 'Initial Discovery Meeting',
        type: 'In-Person',
        date: '2024-01-10',
        time: '10:00 AM',
        duration: '45 mins',
        status: 'Completed'
      }
    ];

    const renderMeetingActivityBox = (title: string, icon: any, data: any[], headers: string[], renderRow: (item: any) => React.ReactNode, primaryAction: string, secondaryAction: string) => {
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
                  console.log(`${secondaryAction} clicked`);
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
                  console.log(`${primaryAction} clicked`);
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
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                    }}
                  >
                    {renderRow(item)}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.activityEmptyState}>
              No {title.toLowerCase()} history found
            </div>
          )}
        </div>
      );
    };

    return (
      <div style={styles.activityContainer}>
        {renderMeetingActivityBox(
          'Meeting History',
          Video,
          meetingHistory,
          ['Title', 'Type', 'Date', 'Time', 'Duration', 'Status'],
          (meeting) => (
            <>
              <td style={styles.activityTableCell}>{meeting.title}</td>
              <td style={styles.activityTableCell}>{meeting.type}</td>
              <td style={styles.activityTableCell}>{meeting.date}</td>
              <td style={styles.activityTableCell}>{meeting.time}</td>
              <td style={styles.activityTableCell}>{meeting.duration}</td>
              <td style={styles.activityTableCell}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '500',
                  backgroundColor: meeting.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                  color: meeting.status === 'Completed' ? '#16a34a' : '#d97706'
                }}>
                  {meeting.status}
                </span>
              </td>
            </>
          ),
          'Log Meeting',
          'Create Meeting'
        )}
      </div>
    );
  };

  const renderTasksTab = () => {
    const sortedTasks = getSortedTasks();

    return (
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Tasks & Follow-ups</h3>
        </div>
        <div style={styles.cardContent}>
          <button 
            style={styles.addAttachmentButton}
            onClick={() => setShowTaskForm(true)}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#2563eb';
            }}
          >
            <Plus size={14} />
            Add Task
          </button>
          
          <table style={styles.tasksTable}>
            <thead style={styles.tasksTableHeader}>
              <tr>
                <th style={styles.tasksTableHeaderCell} onClick={() => handleTaskSort('title')}>
                  <div style={styles.sortHeader}>
                    Task
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={styles.tasksTableHeaderCell} onClick={() => handleTaskSort('priority')}>
                  <div style={styles.sortHeader}>
                    Priority
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={styles.tasksTableHeaderCell} onClick={() => handleTaskSort('deadline')}>
                  <div style={styles.sortHeader}>
                    Deadline
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={styles.tasksTableHeaderCell}>Status</th>
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
                    {task.description && (
                      <div style={styles.taskDescription}>{task.description}</div>
                    )}
                  </td>
                  <td style={styles.tasksTableCell}>
                    <span style={getPriorityStyle(task.priority)}>
                      {task.priority.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.tasksTableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} color="#6b7280" />
                      {task.deadline}
                    </div>
                  </td>
                  <td style={styles.tasksTableCell}>
                    <span style={getStatusStyle(task.status)}>
                      {task.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAttachmentsTab = () => {
    return (
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Documents & Attachments</h3>
        </div>
        <div style={styles.cardContent}>
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
            Add Attachment
          </button>
          
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
                      <Paperclip size={14} />
                      {attachment.name}
                    </div>
                  </td>
                  <td style={styles.attachmentsTableCell}>
                    <span style={styles.attachmentSize}>{attachment.size}</span>
                  </td>
                  <td style={styles.attachmentsTableCell}>{attachment.uploadedBy}</td>
                  <td style={styles.attachmentsTableCell}>
                    <span style={styles.attachmentDate}>{attachment.uploadedDate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTimelineTab = () => {
    const timelineEvents = [
      {
        id: 1,
        type: 'phone',
        title: 'Phone Call',
        description: 'Discussed project requirements and timeline',
        user: 'Sarah Johnson',
        timestamp: '2 hours ago',
        icon: Phone,
        iconStyle: styles.timelineIconPhone
      },
      {
        id: 2,
        type: 'email',
        title: 'Email Sent',
        description: 'Follow-up email with proposal details',
        user: 'Sarah Johnson',
        timestamp: '1 day ago',
        icon: Mail,
        iconStyle: styles.timelineIconEmail
      },
      {
        id: 3,
        type: 'note',
        title: 'Note Added',
        description: 'Lead shows high interest in premium package',
        user: 'Mike Chen',
        timestamp: '2 days ago',
        icon: FileText,
        iconStyle: styles.timelineIconNote
      },
      {
        id: 4,
        type: 'status',
        title: 'Status Updated',
        description: 'Lead moved to Nurturing stage',
        user: 'Sarah Johnson',
        timestamp: '3 days ago',
        icon: UserCheck,
        iconStyle: styles.timelineIconStatus
      },
      {
        id: 5,
        type: 'phone',
        title: 'Phone Call',
        description: 'Initial discovery call completed',
        user: 'John Smith',
        timestamp: '5 days ago',
        icon: Phone,
        iconStyle: styles.timelineIconPhone
      },
      {
        id: 6,
        type: 'note',
        title: 'Lead Created',
        description: 'New lead imported from website contact form',
        user: 'System',
        timestamp: '1 week ago',
        icon: UserPlus,
        iconStyle: styles.timelineIconStatus
      }
    ];

    return (
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Timeline</h3>
        </div>
        <div style={styles.cardContent}>
          <div style={styles.timelineContainer}>
            {timelineEvents.map((event) => {
              const IconComponent = event.icon;
              return (
                <div key={event.id} style={styles.timelineEntry}>
                  <div style={{ ...styles.timelineIconContainer, ...event.iconStyle }}>
                    <IconComponent size={18} />
                  </div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineTitle}>{event.title}</div>
                    <div style={styles.timelineDescription}>{event.description}</div>
                    <div style={styles.timelineMetadata}>by {event.user}</div>
                  </div>
                  <div style={styles.timelineTime}>{event.timestamp}</div>
                </div>
              );
            })}
            <button 
              style={styles.loadMoreButton}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f8fafc';
                (e.target as HTMLElement).style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
                (e.target as HTMLElement).style.borderColor = '#e2e8f0';
              }}
            >
              Load More Events
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

  const renderLogEmailModal = () => {
    if (!showLogEmailModal) return null;

    const isExpanded = logEmailExpanded;
    const modalStyle = isExpanded ? styles.logEmailModalExpanded : {
      ...styles.logEmailModal,
      left: logEmailModalPosition.x,
      top: logEmailModalPosition.y
    };
    const bodyStyle = isExpanded ? styles.logEmailBodyExpanded : styles.logEmailBody;
    const textareaStyle = isExpanded ? styles.logEmailTextareaExpanded : styles.logEmailTextarea;

    return (
      <>
        {isExpanded && <div style={styles.logEmailOverlay} onClick={() => setLogEmailExpanded(false)} />}
        <div style={isExpanded ? {} : styles.logEmailModalContainer}>
          <div style={modalStyle}>
            {/* Header */}
            <div 
              style={styles.logEmailHeader}
              onMouseDown={!isExpanded ? handleDragStart : undefined}
            >
              <h3 style={styles.logEmailTitle}>
                <Mail size={16} />
                Log Email
              </h3>
              <div style={styles.logEmailHeaderActions}>
                <button 
                  style={styles.logEmailHeaderButton}
                  onClick={() => setLogEmailExpanded(!isExpanded)}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  <Maximize2 size={16} />
                </button>
                <button 
                  style={styles.logEmailHeaderButton}
                  onClick={() => setShowLogEmailModal(false)}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={bodyStyle}>
            {/* Contact Information Section */}
            <div style={styles.logEmailFormSection}>
              <div style={styles.logEmailFormRow}>
                <div style={styles.logEmailFormField}>
                  <label style={styles.logEmailLabel}>Contacted</label>
                  <input
                    type="text"
                    style={styles.logEmailInput}
                    value={logEmailForm.contacted}
                    onChange={(e) => handleLogEmailFormChange('contacted', e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div style={styles.logEmailFormFieldThird}>
                  <label style={styles.logEmailLabel}>Date</label>
                  <input
                    type="date"
                    style={styles.logEmailInput}
                    value={logEmailForm.date}
                    onChange={(e) => handleLogEmailFormChange('date', e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div style={styles.logEmailFormFieldThird}>
                  <label style={styles.logEmailLabel}>Time</label>
                  <input
                    type="time"
                    style={styles.logEmailInput}
                    value={logEmailForm.time}
                    onChange={(e) => handleLogEmailFormChange('time', e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Content Field with Toolbar */}
            <div style={styles.logEmailContentContainer}>
              {/* Toolbar */}
              <div style={styles.logEmailToolbar}>
                {formatToolbarButton(Bold, 'Bold')}
                {formatToolbarButton(Italic, 'Italic')}
                {formatToolbarButton(Underline, 'Underline')}
                <div style={styles.logEmailToolbarDivider}></div>
                {formatToolbarButton(Link, 'Link')}
                {formatToolbarButton(List, 'List')}
                <div style={styles.logEmailToolbarDivider}></div>
                {formatToolbarButton(Image, 'Insert Image')}
                {formatToolbarButton(Paperclip, 'Attach File')}
              </div>
              
              {/* Content Textarea */}
              <textarea
                style={{
                  ...textareaStyle,
                  border: 'none',
                  borderRadius: '0',
                  marginBottom: 0
                }}
                placeholder="Enter email content..."
                value={logEmailForm.content}
                onChange={(e) => handleLogEmailFormChange('content', e.target.value)}
              />
            </div>

            {/* Task Creation Section */}
            <div style={styles.logEmailTaskSection}>
              <div style={styles.logEmailTaskHeader}>Associated with 2 records</div>
              
              <div style={styles.logEmailTaskOption}>
                <input
                  type="checkbox"
                  style={styles.logEmailTaskCheckbox}
                  checked={logEmailForm.createTask}
                  onChange={(e) => handleLogEmailFormChange('createTask', e.target.checked)}
                />
                <div style={styles.logEmailTaskDescription}>
                  Create a{' '}
                  <strong>
                    {logEmailForm.createTask ? (
                      <input
                        type="text"
                        value={logEmailForm.taskName}
                        onChange={(e) => handleLogEmailFormChange('taskName', e.target.value)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          borderBottom: '1px solid #2563eb',
                          color: '#2563eb',
                          fontWeight: '600',
                          fontSize: '13px',
                          padding: '0 2px',
                          margin: '0 2px'
                        }}
                      />
                    ) : (
                      <span onClick={() => handleLogEmailFormChange('createTask', true)} style={{ cursor: 'pointer', color: '#2563eb' }}>
                        {logEmailForm.taskName}
                      </span>
                    )}
                  </strong>
                  {' '}task to follow up{' '}
                  <strong>
                    In{' '}
                    <select
                      value={`${Math.ceil((new Date(logEmailForm.taskDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} business days`}
                      onChange={(e) => {
                        const days = parseInt(e.target.value.split(' ')[0]);
                        const deadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        handleLogEmailFormChange('taskDeadline', deadline);
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#2563eb',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="1 business days">1 business day</option>
                      <option value="3 business days">3 business days</option>
                      <option value="5 business days">5 business days</option>
                      <option value="7 business days">1 week</option>
                    </select>
                    {' '}({new Date(logEmailForm.taskDeadline).toLocaleDateString('en-US', { weekday: 'long' })})
                  </strong>
                </div>
              </div>

              {logEmailForm.createTask && (
                <div style={styles.logEmailTaskInputs}>
                  <select
                    style={styles.logEmailTaskSelect}
                    value={logEmailForm.taskPriority}
                    onChange={(e) => handleLogEmailFormChange('taskPriority', e.target.value)}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                    type="date"
                    style={styles.logEmailTaskInput}
                    value={logEmailForm.taskDeadline}
                    onChange={(e) => handleLogEmailFormChange('taskDeadline', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={styles.logEmailFooter}>
              <span style={styles.logEmailAssociated}>
                Associated with 2 records
              </span>
                              <button
                style={styles.logEmailSubmitButton}
                onClick={handleLogEmailSubmit}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#3b82f6';
                }}
              >
                Log email
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  };

  // Create Email Modal handlers
  const handleCreateEmailFormChange = (field: string, value: any) => {
    setCreateEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateEmailSubmit = () => {
    console.log('Sending email:', createEmailForm);
    
    // If task creation is enabled, add task to tasks list
    if (createEmailForm.createTask) {
      const newTask = {
        id: tasks.length + 1,
        title: `${createEmailForm.taskType}: Follow up on email`,
        description: `Follow-up task created from email: ${createEmailForm.subject}`,
        priority: 'medium' as const,
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

  const renderCreateEmailModal = () => {
    if (!showCreateEmailModal) return null;

    const tabs = ['Templates', 'Sequences', 'Documents', 'Meetings', 'Quotes'];

    return (
      <>
        <div style={styles.logEmailOverlay} onClick={() => setShowCreateEmailModal(false)} />
        <div style={styles.createEmailModal}>
          {/* Header */}
          <div style={styles.createEmailHeader}>
            <h3 style={styles.createEmailTitle}>
              <Mail size={16} />
              Email
            </h3>
            <div style={styles.logEmailHeaderActions}>
              <button 
                style={styles.logEmailHeaderButton}
                onClick={() => setShowCreateEmailModal(false)}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.createEmailTabs}>
            {tabs.map((tab, index) => (
              <button
                key={tab}
                style={{
                  ...styles.createEmailTab,
                  ...(index === 0 ? styles.createEmailTabActive : {})
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Body */}
          <div style={styles.createEmailBody}>
            {/* To Field */}
            <div style={styles.createEmailFormRow}>
              <label style={styles.createEmailLabel}>To</label>
              <input
                type="text"
                style={styles.createEmailInput}
                value={createEmailForm.to}
                onChange={(e) => handleCreateEmailFormChange('to', e.target.value)}
              />
              <span style={styles.createEmailCcBcc}>Cc</span>
              <span style={styles.createEmailCcBcc}>Bcc</span>
            </div>

            {/* From Field */}
            <div style={styles.createEmailFormRow}>
              <label style={styles.createEmailLabel}>From</label>
              <input
                type="text"
                style={styles.createEmailInput}
                value={createEmailForm.from}
                onChange={(e) => handleCreateEmailFormChange('from', e.target.value)}
              />
            </div>

            {/* Subject Field */}
            <div style={{...styles.createEmailFormRow, ...styles.createEmailSubjectRow}}>
              <label style={styles.createEmailLabel}>Subject</label>
              <input
                type="text"
                style={styles.createEmailInput}
                value={createEmailForm.subject}
                onChange={(e) => handleCreateEmailFormChange('subject', e.target.value)}
              />
            </div>

            {/* Content Area */}
            <div style={styles.createEmailContent}>
              <textarea
                style={styles.createEmailTextarea}
                placeholder="Write your email content here..."
                value={createEmailForm.content}
                onChange={(e) => handleCreateEmailFormChange('content', e.target.value)}
              />
            </div>

            {/* Rich Text Toolbar */}
            <div style={styles.logEmailToolbar}>
              {formatToolbarButton(Bold, 'Bold')}
              {formatToolbarButton(Italic, 'Italic')}
              {formatToolbarButton(Underline, 'Underline')}
              <div style={styles.logEmailToolbarDivider}></div>
              {formatToolbarButton(Link, 'Link')}
              {formatToolbarButton(List, 'List')}
              <div style={styles.logEmailToolbarDivider}></div>
              {formatToolbarButton(Image, 'Insert Image')}
              {formatToolbarButton(Paperclip, 'Attach File')}
            </div>
          </div>

          {/* Footer */}
          <div style={styles.createEmailFooter}>
            <div style={styles.createEmailTaskSection}>
              <input
                type="checkbox"
                style={styles.createEmailTaskCheckbox}
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

  return (
    <div style={styles.container}>
      {/* Lead Information Card */}
      <div style={styles.leadCard}>
        <div style={styles.leadHeader}>
          <div style={styles.leadLeft}>
            <div style={styles.logoSection}>
              <div style={styles.companyLogo}>
                {lead.company.charAt(0).toUpperCase()}
              </div>
              <div style={styles.companyBelowLogo}>
                <Building size={10} />
                <span>{lead.company}</span>
              </div>
            </div>
            <div style={styles.nameAndDetails}>
              <h1 style={styles.leadTitle}>{lead.name}</h1>
              <div style={styles.titleInfo}>
                <span>CEO</span>
              </div>
            </div>
          </div>
          <div style={styles.leadRight}>
            <button 
              style={styles.convertButton}
            >
              <UserPlus size={16} />
              Convert Lead
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Card */}
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
      {renderAttachmentModal()}
      {renderLogEmailModal()}
      {renderCreateEmailModal()}
    </div>
  );
};

export default LeadDetails; 