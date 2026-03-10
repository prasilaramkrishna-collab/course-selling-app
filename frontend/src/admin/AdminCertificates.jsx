import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, valid, expired
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCertificates();
  }, []);

  const fetchAllCertificates = async () => {
    try {
      setLoading(true);
      const admin = JSON.parse(localStorage.getItem('admin'));
      const token = admin?.token;

      if (!token) {
        toast.error('Please login as admin');
        navigate('/admin/login');
        return;
      }

      const response = await api.get('/api/certificate/admin/all-certificates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setCertificates(response.data.certificates || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCertificates = () => {
    if (filter === 'valid') {
      return certificates.filter(c => c.isValid);
    } else if (filter === 'expired') {
      return certificates.filter(c => !c.isValid);
    }
    return certificates;
  };

  const filteredCerts = getFilteredCertificates();

  const downloadPDF = (cert) => {
    // Generate certificate as PDF - using browser print dialog
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.studentName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
            .certificate { 
              background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%);
              padding: 60px;
              margin: 20px auto;
              max-width: 950px;
              text-align: center;
              color: white;
              box-shadow: 0 20px 60px rgba(0,0,0,0.5);
              position: relative;
              overflow: hidden;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 8px;
              background: linear-gradient(90deg, #fbbf24, #fcd34d, #fbbf24);
            }
            .certificate::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 8px;
              background: linear-gradient(90deg, #fbbf24, #fcd34d, #fbbf24);
            }
            .header { font-size: 52px; font-weight: 300; margin-bottom: 10px; letter-spacing: 3px; text-shadow: 2px 2px 8px rgba(0,0,0,0.4); }
            .subheader { font-size: 24px; letter-spacing: 2px; color: #fde047; margin-bottom: 20px; font-weight: 300; }
            .divider { height: 1px; background: linear-gradient(90deg, transparent, #fbbf24, transparent); margin: 30px 0; }
            .intro { font-size: 18px; color: #e5e7eb; margin-bottom: 20px; letter-spacing: 1px; }
            .student-name { 
              font-size: 44px; 
              font-weight: bold; 
              color: #fcd34d; 
              padding: 24px;
              margin: 20px 0;
              border-top: 2px solid #fbbf24;
              border-bottom: 2px solid #fbbf24;
              text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
              letter-spacing: 1px;
            }
            .course-intro { font-size: 16px; color: #d1d5db; margin: 20px 0; letter-spacing: 0.5px; }
            .course-name { font-size: 34px; font-weight: bold; color: #fcd34d; margin: 15px 0; letter-spacing: 0.5px; text-shadow: 1px 1px 4px rgba(0,0,0,0.3); }
            .achievement-box {
              background: rgba(0,0,0,0.3);
              border: 1px solid rgba(251, 191, 36, 0.3);
              border-radius: 8px;
              padding: 30px;
              margin: 30px 0;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            .achievement-item {
              border-right: 1px solid rgba(251, 191, 36, 0.2);
            }
            .achievement-item:last-child { border-right: none; }
            .achievement-label { font-size: 12px; color: #fbbf24; letter-spacing: 1.5px; margin-bottom: 8px; font-weight: 600; }
            .achievement-value { font-size: 32px; font-weight: bold; color: white; }
            .signature-area {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 30px;
              margin: 50px 0 30px 0;
              text-align: center;
            }
            .signature-box { padding-top: 40px; }
            .sig-line { border-top: 1px solid #d1d5db; padding-top: 10px; }
            .sig-label { font-size: 11px; color: #d1d5db; letter-spacing: 0.5px; margin-top: 10px; }
            .dates-section {
              border-top: 1px solid rgba(251, 191, 36, 0.3);
              padding-top: 30px;
              margin-top: 30px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
            }
            .date-item { text-align: left; }
            .date-label { font-size: 11px; color: #9ca3af; letter-spacing: 1px; margin-bottom: 8px; }
            .date-value { font-size: 16px; font-weight: 600; color: white; }
            .validity { font-size: 14px; color: #fbbf24; font-weight: 600; }
            .footer-text { font-size: 12px; color: #9ca3af; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(251, 191, 36, 0.2); line-height: 1.6; letter-spacing: 0.5px; }
            .seal { font-size: 48px; opacity: 0.8; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">CERTIFICATE</div>
            <div class="subheader">OF COMPLETION</div>
            <div class="divider"></div>
            
            <div class="intro">This is to certify that</div>
            
            <div class="student-name">${cert.studentName}</div>
            
            <div class="course-intro">has successfully completed and demonstrated proficiency in</div>
            <div class="course-name">${cert.courseName}</div>
            
            <div class="achievement-box">
              <div class="achievement-item">
                <div class="achievement-label">QUIZ SCORE</div>
                <div class="achievement-value">${cert.score}/${cert.totalQuestions}</div>
              </div>
              <div class="achievement-item">
                <div class="achievement-label">PERCENTAGE</div>
                <div class="achievement-value" style="color: #fcd34d;">${cert.percentage}%</div>
              </div>
              <div class="achievement-item">
                <div class="achievement-label">CERT NO.</div>
                <div style="font-size: 13px; font-family: monospace; font-weight: 600; color: white; word-break: break-all;">${cert.certificateNumber}</div>
              </div>
            </div>

            <div class="signature-area">
              <div class="signature-box">
                <div class="sig-line" style="height: 60px; border-top: none;"></div>
                <div class="sig-label">AUTHORIZED SIGNATURE</div>
              </div>
              <div class="signature-box">
                <div class="seal">⭐</div>
                <div class="sig-label">OFFICIAL STAMP</div>
              </div>
              <div class="signature-box">
                <div class="sig-line" style="height: 60px; border-top: none;"></div>
                <div class="sig-label">DATE OF ISSUE</div>
              </div>
            </div>

            <div class="dates-section">
              <div class="date-item">
                <div class="date-label">COMPLETION DATE</div>
                <div class="date-value">${new Date(cert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div class="date-item">
                <div class="date-label">VALID UNTIL</div>
                <div class="date-value validity">${new Date(cert.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>

            <div class="footer-text">
              This digital credential represents verified completion of the course and demonstrates the holder's commitment to continuous learning and professional development.
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading certificates...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📜 Certified Students</h1>
          <p className="text-gray-600 text-lg">Total Certificates Issued: <span className="font-bold text-indigo-600">{certificates.length}</span></p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-600'
            }`}
          >
            All ({certificates.length})
          </button>
          <button
            onClick={() => setFilter('valid')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'valid'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
            }`}
          >
            Valid ({certificates.filter(c => c.isValid).length})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'expired'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-600'
            }`}
          >
            Expired ({certificates.filter(c => !c.isValid).length})
          </button>
        </div>

        {filteredCerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-2xl text-gray-500 mb-4">📭</p>
            <p className="text-xl text-gray-600">
              {filter === 'all' 
                ? 'No certificates issued yet' 
                : `No ${filter} certificates found`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Student Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Course</th>
                    <th className="px-6 py-4 text-center font-semibold">Score</th>
                    <th className="px-6 py-4 text-center font-semibold">Percentage</th>
                    <th className="px-6 py-4 text-left font-semibold">Completion Date</th>
                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCerts.map((cert, index) => (
                    <tr key={cert._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{cert.studentName}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{cert.studentEmail}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{cert.courseName}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-700 font-semibold">{cert.score}/{cert.totalQuestions}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold text-white text-sm ${
                          cert.percentage >= 80 ? 'bg-green-500' : 
                          cert.percentage >= 70 ? 'bg-blue-500' : 
                          'bg-indigo-500'
                        }`}>
                          {cert.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(cert.completionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cert.isValid ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">✓ Valid</span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">✗ Expired</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => downloadPDF(cert)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-colors"
                        >
                          📥 Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredCerts.map((cert) => (
                <div key={cert._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{cert.studentName}</h3>
                      <p className="text-sm text-gray-600">{cert.studentEmail}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      cert.isValid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cert.isValid ? '✓ Valid' : '✗ Expired'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700"><span className="font-semibold">Course:</span> {cert.courseName}</p>
                    <p className="text-gray-700"><span className="font-semibold">Score:</span> {cert.score}/{cert.totalQuestions} ({cert.percentage}%)</p>
                    <p className="text-gray-700"><span className="font-semibold">Date:</span> {new Date(cert.completionDate).toLocaleDateString()}</p>
                    <p className="text-gray-700 text-sm"><span className="font-semibold">Cert #:</span> {cert.certificateNumber}</p>
                  </div>
                  <button
                    onClick={() => downloadPDF(cert)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                  >
                    📥 Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600">{certificates.length}</div>
            <div className="text-gray-600 mt-2">Total Certificates</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{certificates.filter(c => c.isValid).length}</div>
            <div className="text-gray-600 mt-2">Valid Certificates</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{certificates.filter(c => !c.isValid).length}</div>
            <div className="text-gray-600 mt-2">Expired Certificates</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {certificates.length > 0 
                ? (certificates.reduce((sum, c) => sum + c.percentage, 0) / certificates.length).toFixed(1)
                : '0'
              }%
            </div>
            <div className="text-gray-600 mt-2">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCertificates;
