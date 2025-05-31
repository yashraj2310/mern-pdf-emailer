import React, { useState } from 'react';
import axios from 'axios';

const SubmissionForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        customId: '',
        submissionDate: '', 
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        try {
            const payload = { ...formData };
            if (payload.submissionDate) {
                
            } else {
                delete payload.submissionDate; 
            }
            if (!payload.customId) {
                delete payload.customId; 
            }


            const response = await axios.post('http://localhost:5001/api/submit-form', payload); 
            setMessage(response.data.message || 'Submission successful!');
            setFormData({ 
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                customId: '',
                submissionDate: '',
            });
        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.data.errors) { 
                    setError(err.response.data.errors.map(e => e.msg).join(', '));
                } else {
                    setError(err.response.data.message || 'An error occurred during submission.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Submit Your Information</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>First Name: *</label><br />
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Last Name: *</label><br />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email Address: *</label><br />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Phone Number: *</label><br />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Custom Identifier (Optional):</label><br />
                    <input type="text" name="customId" value={formData.customId} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Date & Time (Optional):</label><br />
                    <input type="datetime-local" name="submissionDate" value={formData.submissionDate} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        </div>
    );
};

export default SubmissionForm;