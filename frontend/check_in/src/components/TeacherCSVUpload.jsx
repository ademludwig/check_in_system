import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { toast } from 'react-hot-toast'

const TeacherCSVUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [csvFile, setCsvFile] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setIsProcessing(true)
    setCsvFile(file) // Store the original file for upload

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessing(false)

        if (results.errors.length > 0) {
          toast.error('Error parsing CSV file')
          console.error('CSV parsing errors:', results.errors)
          return
        }

        const teachers = results.data.map((row, index) => ({
          id: index + 1,
          
          email: row.email ||'',
          firstName: row.firstName || row.first_name || row.name?.split(' ')[0] || '',
          lastName: row.lastName || row.last_name || row.name?.split(' ').slice(1).join(' ') || '',
          code: row.code || row.teacher_code || '',
          department: row.department || row.dept || '',
          
        })).filter(teacher => teacher.username || teacher.email)

        setPreviewData(teachers)
        toast.success(`Parsed ${teachers.length} teachers from CSV`)
      },
      error: (error) => {
        setIsProcessing(false)
        toast.error('Failed to parse CSV file')
        console.error('CSV parsing error:', error)
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  })

  const handleUpload = () => {
  if (!previewData || previewData.length === 0) return

  fetch('http://localhost:8000/api/upload-teachers/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ teachers: previewData })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) toast.success(data.message)
      if (data.errors?.length > 0) {
        toast.error('Some rows failed')
        console.warn(data.errors)
      }
      setPreviewData(null)
    })
    .catch(err => {
      console.error('Upload failed:', err)
      toast.error('Upload failed')
    })
}


  const handleCancel = () => {
    setPreviewData(null)
    setCsvFile(null)
  }

  return (
    <div className="csv-upload-container">
      <div className="upload-section">
        <h2>📁 Upload Teachers CSV</h2>
        <p>Upload a CSV file containing teacher information</p>

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${isProcessing ? 'processing' : ''}`}
        >
          <input {...getInputProps()} />
          {isProcessing ? (
            <div className="processing-message">
              <div className="spinner"></div>
              <p>Processing CSV file...</p>
            </div>
          ) : isDragActive ? (
            <div className="drop-message">
              <p>📁 Drop the CSV file here...</p>
            </div>
          ) : (
            <div className="upload-message">
              <p>📁 Drag & drop a CSV file here, or click to select</p>
              <p className="file-types">Supported: .csv</p>
            </div>
          )}
        </div>

        <div className="csv-format-info">
          <h3>📋 Expected CSV Format:</h3>
          <div className="format-example">
            <table>
              <thead>
                <tr>
                 
                  <th>email</th>
                  <th>firstName</th>
                  <th>lastName</th>
                  <th>code</th>
                  <th>department</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                
                 
                  <td>jane.smith@university.edu</td>
                  <td>Jane</td>
                  <td>Smith</td>
                  <td>T002</td>
                  <td>Mathematics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {previewData && (
        <div className="preview-section">
          <h3>👀 Preview ({previewData.length} teachers)</h3>
          <div className="preview-table-container">
            <table className="preview-table">
              <thead>
                <tr>
                 
                  <th>Email</th>
                  <th>first Name</th>
                  <th>last Name</th>
                  <th>Code</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 5).map((teacher, index) => (
                  <tr key={index}>
                  
                    <td>{teacher.email}</td>
                    <td>{`${teacher.firstName} `}</td>
                    <td>{`${teacher.lastName} `}</td>
                    <td>{teacher.code}</td>
                    <td>{teacher.department}</td>
                  </tr>
                ))}
                {previewData.length > 5 && (
                  <tr>
                    <td colSpan="5" className="more-rows">
                      ... and {previewData.length - 5} more teachers
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="preview-actions">
            <button
              className="btn btn-primary"
              onClick={handleUpload}
            >
              ✅ Upload {previewData.length} Teachers
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherCSVUpload
