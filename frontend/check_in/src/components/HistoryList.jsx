import { useState } from 'react'

const HistoryList = ({ history }) => {
  const [filterTeacher, setFilterTeacher] = useState('')
  const [filterAmphi, setFilterAmphi] = useState('')
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState('desc')

  const teachers = [...new Set(history.map(h => h.teacher?.firstName + ' ' + h.teacher?.lastName).filter(Boolean))]
  const amphis = [...new Set(history.map(h => h.amphi?.name).filter(Boolean))]

  const filteredHistory = history.filter(record => {
    const teacherName = record.teacher ? `${record.teacher.firstName} ${record.teacher.lastName}` : ''
    const matchesTeacher = !filterTeacher || teacherName.includes(filterTeacher)
    const matchesAmphi = !filterAmphi || record.amphi?.name === filterAmphi
    
    return matchesTeacher && matchesAmphi
  })

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'teacher':
        aValue = a.teacher ? `${a.teacher.firstName} ${a.teacher.lastName}` : ''
        bValue = b.teacher ? `${b.teacher.firstName} ${b.teacher.lastName}` : ''
        break
      case 'amphi':
        aValue = a.amphi?.name || ''
        bValue = b.amphi?.name || ''
        break
      case 'date':
        aValue = new Date(a.date + ' ' + a.time)
        bValue = new Date(b.date + ' ' + b.time)
        break
      default:
        aValue = new Date(a.timestamp)
        bValue = new Date(b.timestamp)
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const formatDateTime = (date, time) => {
    const dateObj = new Date(date + ' ' + time)
    return dateObj.toLocaleString()
  }

  return (
    <div className="history-list-container">
      <div className="list-header">
        <h2>📊 Check-In History ({history.length})</h2>
        <p>View all teacher check-in records and attendance history</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Filter by teacher name..."
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterAmphi}
            onChange={(e) => setFilterAmphi(e.target.value)}
            className="filter-select"
          >
            <option value="">All Amphitheaters</option>
            {amphis.map(amphi => (
              <option key={amphi} value={amphi}>{amphi}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="timestamp">Sort by Date/Time</option>
            <option value="teacher">Sort by Teacher</option>
            <option value="amphi">Sort by Amphitheater</option>
            <option value="date">Sort by Check-in Date</option>
          </select>
        </div>

        <div className="filter-group">
          <button
            className={`btn btn-small ${sortOrder === 'desc' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? '⬇️ Desc' : '⬆️ Asc'}
          </button>
        </div>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="empty-state">
          {history.length === 0 ? (
            <p>📊 No check-in history found. Start recording check-ins to see history here.</p>
          ) : (
            <p>🔍 No records match your filter criteria.</p>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Teacher</th>
                <th>Code</th>
                <th>Amphitheater</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map(record => (
                <tr key={record.id}>
                  <td>
                    <div className="datetime-cell">
                      <div className="date">{record.date}</div>
                      <div className="time">{record.time}</div>
                    </div>
                  </td>
                  <td>
                    <div className="teacher-cell">
                      <div className="teacher-name">
                        {record.teacher ? `${record.teacher.firstName} ${record.teacher.lastName}` : 'N/A'}
                      </div>
                      <div className="teacher-email">
                        {record.teacher?.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="teacher-code">
                      {record.teacher?.code || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className="amphi-name">
                      {record.amphi?.name || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className="department-badge">
                      {record.teacher?.department || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className="status-checked-in">✅ Checked In</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="list-footer">
        <p>Showing {sortedHistory.length} of {history.length} records</p>
        {(filterTeacher || filterAmphi) && (
          <button 
            className="btn btn-small btn-secondary"
            onClick={() => {
              setFilterTeacher('')
              setFilterAmphi('')
            }}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

export default HistoryList 