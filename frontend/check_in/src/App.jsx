import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import TeacherCSVUpload from './components/TeacherCSVUpload'
import CheckInForm from './components/CheckInForm'
import TeacherList from './components/TeacherList'
import AmphiList from './components/AmphiList'
import HistoryList from './components/HistoryList'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('checkin')
  const [teachers, setTeachers] = useState([])
  const [amphis, setAmphis] = useState([
    {
      id: 1,
      name: 'Amphitheater A'
    },
    {
      id: 2,
      name: 'Main Hall'
    },
    {
      id: 3,
      name: 'Science Center'
    },
    {
      id: 4,
      name: 'Engineering Building'
    }
  ])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const tabs = [
    { id: 'checkin', label: 'Check In', icon: '📝' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
    { id: 'upload', label: 'Upload CSV', icon: '📁' },
    { id: 'amphis', label: 'Amphitheaters', icon: '🏛️' },
    { id: 'history', label: 'History', icon: '📊' }
  ]

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/teachers/')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Transform the data to match our frontend structure
      const transformedTeachers = data.map((teacher, index) => ({
        id: index + 1, // Using index as ID since backend doesn't provide one
        username: teacher.email.split('@')[0],
        email: teacher.email,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        code: teacher.code,
        department: teacher.department || 'N/A',
        phone: teacher.phone || 'N/A'
      }))
      
      setTeachers(transformedTeachers)
      toast.success(`Loaded ${transformedTeachers.length} teachers from database`)
    } catch (error) {
      console.error('Error fetching teachers:', error)
      toast.error('Failed to fetch teachers from database')
      // Fallback to sample data if API fails
      setTeachers([
        {
          id: 1,
          username: 'john.doe',
          email: 'john.doe@university.edu',
          firstName: 'John',
          lastName: 'Doe',
          code: 'T001',
          department: 'Computer Science',
          phone: '+1234567890'
        },
        {
          id: 2,
          username: 'jane.smith',
          email: 'jane.smith@university.edu',
          firstName: 'Jane',
          lastName: 'Smith',
          code: 'T002',
          department: 'Mathematics',
          phone: '+1234567891'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    await fetchTeachers()
    // TODO: Add fetchAmphis and fetchHistory when backend endpoints are ready
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTeacherUpload = async (uploadedTeachers) => {
    try {
      // Send teachers to backend API
      const response = await fetch('http://localhost:8000/api/upload-teachers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teachers: uploadedTeachers })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.errors && result.errors.length > 0) {
        toast.error(`Upload completed with ${result.errors.length} errors`)
        console.error('Upload errors:', result.errors)
      } else {
        toast.success(result.message || `${uploadedTeachers.length} teachers uploaded successfully!`)
      }

      // Refresh the teacher list from database
      await fetchTeachers()
    } catch (error) {
      console.error('Error uploading teachers:', error)
      toast.error('Failed to upload teachers to database')
      // Fallback: add to local state
      setTeachers(prev => [...prev, ...uploadedTeachers])
    }
  }

  const handleCheckIn = (checkInData) => {
    setHistory(prev => [checkInData, ...prev])
    toast.success('Check-in recorded successfully!')
  }

  return (
    <div className="app">
      <Toaster position="top-right" />
      
      <header className="app-header">
        <h1>🏛️ Check-In System</h1>
        <p>Manage teacher attendance and amphitheater bookings</p>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {loading && activeTab === 'teachers' && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading teachers from database...</p>
          </div>
        )}
        
        {activeTab === 'checkin' && (
          <CheckInForm 
            teachers={teachers} 
            amphis={amphis} 
            onCheckIn={handleCheckIn} 
          />
        )}
        
        {activeTab === 'teachers' && !loading && (
          <TeacherList 
            teachers={teachers} 
            onUpdate={setTeachers} 
          />
        )}
        
        {activeTab === 'upload' && (
          <TeacherCSVUpload onUpload={handleTeacherUpload} />
        )}
        
        {activeTab === 'amphis' && (
          <AmphiList 
            amphis={amphis} 
            onUpdate={setAmphis} 
          />
        )}
        
        {activeTab === 'history' && (
          <HistoryList history={history} />
        )}
      </main>
    </div>
  )
}

export default App
