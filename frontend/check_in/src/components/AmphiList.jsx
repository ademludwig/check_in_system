import { useState } from 'react'
import { toast } from 'react-hot-toast'

const AmphiList = ({ amphis, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAmphiName, setNewAmphiName] = useState('')

  const handleAddAmphi = (e) => {
    e.preventDefault()
    
    if (!newAmphiName.trim()) {
      toast.error('Please enter an amphitheater name')
      return
    }

    const newAmphi = {
      id: Date.now(),
      name: newAmphiName.trim()
    }

    onUpdate([...amphis, newAmphi])
    setNewAmphiName('')
    setShowAddForm(false)
    toast.success('Amphitheater added successfully')
  }

  const handleDeleteAmphi = (amphiId) => {
    if (window.confirm('Are you sure you want to delete this amphitheater?')) {
      const updatedAmphis = amphis.filter(a => a.id !== amphiId)
      onUpdate(updatedAmphis)
      toast.success('Amphitheater deleted successfully')
    }
  }

  return (
    <div className="amphi-list-container">
      <div className="list-header">
        <h2>🏛️ Amphitheaters ({amphis.length})</h2>
        <p>Manage amphitheater locations and information</p>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '❌ Cancel' : '➕ Add Amphitheater'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-section">
          <form onSubmit={handleAddAmphi} className="add-form">
            <div className="form-group">
              <label htmlFor="amphiName">🏛️ Amphitheater Name *</label>
              <input
                type="text"
                id="amphiName"
                value={newAmphiName}
                onChange={(e) => setNewAmphiName(e.target.value)}
                placeholder="e.g., Amphitheater A, Main Hall, etc."
                className="form-input"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                ✅ Add Amphitheater
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false)
                  setNewAmphiName('')
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {amphis.length === 0 ? (
        <div className="empty-state">
          <p>🏛️ No amphitheaters found. Add your first amphitheater to get started.</p>
        </div>
      ) : (
        <div className="amphi-grid">
          {amphis.map(amphi => (
            <div key={amphi.id} className="amphi-card">
              <div className="amphi-card-header">
                <h3>🏛️ {amphi.name}</h3>
                <div className="amphi-actions">
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
                    onClick={() => handleDeleteAmphi(amphi.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              
              <div className="amphi-card-content">
                <div className="amphi-info">
                  <p><strong>ID:</strong> {amphi.id}</p>
                  <p><strong>Status:</strong> <span className="status-active">Active</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {amphis.length > 0 && (
        <div className="list-footer">
          <p>Total amphitheaters: {amphis.length}</p>
        </div>
      )}
    </div>
  )
}

export default AmphiList 