import { useState } from 'react'
import { toast } from 'react-hot-toast'

const CheckInForm = ({ teachers, amphis, onCheckIn }) => {
  const [formData, setFormData] = useState({
    teacherId: '',
    amphiId: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.teacherId || !formData.amphiId) {
      toast.error('Please select both teacher and amphitheater')
      return
    }

    const selectedTeacher = teachers.find(t => t.id == formData.teacherId)
    const selectedAmphi = amphis.find(a => a.id == formData.amphiId)

    const checkInData = {
      id: Date.now(),
      teacher: selectedTeacher,
      amphi: selectedAmphi,
      date: formData.date,
      time: formData.time,
      timestamp: new Date().toISOString()
    }

    onCheckIn(checkInData)
    
    // Reset form
    setFormData({
      teacherId: '',
      amphiId: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5)
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="checkin-form-container">
      <div className="form-header">
        <h2>📝 Teacher Check-In</h2>
        <p>Record teacher attendance for amphitheater sessions</p>
      </div>

      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="form-group">
          <label htmlFor="teacherId">👨‍🏫 Teacher *</label>
          <select
            id="teacherId"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleInputChange}
            required
            className="form-select"
          >
            <option value="">Select a teacher...</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} ({teacher.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amphiId">🏛️ Amphitheater *</label>
          <select
            id="amphiId"
            name="amphiId"
            value={formData.amphiId}
            onChange={handleInputChange}
            required
            className="form-select"
          >
            <option value="">Select an amphitheater...</option>
            {amphis.map(amphi => (
              <option key={amphi.id} value={amphi.id}>
                {amphi.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">📅 Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">🕐 Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            ✅ Check In
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                teacherId: '',
                amphiId: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5)
              })
            }}
          >
            🔄 Reset
          </button>
        </div>
      </form>

      {teachers.length === 0 && (
        <div className="empty-state">
          <p>📝 No teachers available. Please upload teachers using the CSV upload feature.</p>
        </div>
      )}

      {amphis.length === 0 && (
        <div className="empty-state">
          <p>🏛️ No amphitheaters available. Please add amphitheaters first.</p>
        </div>
      )}
    </div>
  )
}

export default CheckInForm 