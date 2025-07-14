import { useState } from 'react'
import { toast } from 'react-hot-toast'

const TeacherList = ({ teachers, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')

  const departments = [...new Set(teachers.map(t => t.department).filter(Boolean))]

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !filterDepartment || teacher.department === filterDepartment

    return matchesSearch && matchesDepartment
  })

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const updatedTeachers = teachers.filter(t => t.id !== teacherId)
      onUpdate(updatedTeachers)
      toast.success('Teacher deleted successfully')
    }
  }

  return (
    <div className="teacher-list-container">
      <div className="list-header">
        <h2>👨‍🏫 Teachers ({teachers.length})</h2>
        <p>Manage teacher information and view details</p>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="department-filter">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTeachers.length === 0 ? (
        <div className="empty-state">
          {teachers.length === 0 ? (
            <p>📝 No teachers found. Please upload teachers using the CSV upload feature.</p>
          ) : (
            <p>🔍 No teachers match your search criteria.</p>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                {/* <th>Username</th> */}
                <th>Email</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td>
                    <span className="teacher-code">{teacher.code}</span>
                  </td>
                  <td>
                    <div className="teacher-name">
                      <strong>{teacher.firstName} {teacher.lastName}</strong>
                    </div>
                  </td>
                  {/* <td>{teacher.username}</td> */}
                  <td>
                    <a href={`mailto:${teacher.email}`} className="email-link">
                      {teacher.email}
                    </a>
                  </td>
                  <td>
                    <span className="department-badge">
                      {teacher.department || 'N/A'}
                    </span>
                  </td>
                  <td>{teacher.phone || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => {
                          // Edit functionality would go here
                          toast.info('Edit functionality coming soon')
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="list-footer">
        <p>Showing {filteredTeachers.length} of {teachers.length} teachers</p>
        {searchTerm && (
          <button 
            className="btn btn-small btn-secondary"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  )
}

export default TeacherList 