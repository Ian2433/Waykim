import React, { useState } from 'react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    
    setStatus('sending');
    // Simulate API request
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="contact-card reveal visible" style={{ transitionDelay: '0.3s' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', textAlign: 'left' }}>
        <div>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--lime)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Email</p>
          <a href="mailto:joachimhanzp@gmail.com" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontFamily: 'monospace' }}>joachimhanzp@gmail.com</a>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--lime)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px', marginTop: '24px' }}>Phone</p>
          <a href="tel:+639708818353" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontFamily: 'monospace' }}>0970 881 8353</a>
        </div>
        <div>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--lime)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Location</p>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>Purok 4 Kalubihan, New Visayas, Panabo City</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="contact-form-grid">
          <div className="form-left">
            <div>
              <label className="form-label">Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name" 
                className="form-input" 
                required 
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com" 
                className="form-input" 
                required 
              />
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project / Inquiry" 
                className="form-input" 
              />
            </div>
          </div>
          <div className="form-right">
            <label className="form-label">Message</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..." 
              className="form-textarea"
              required
            />
          </div>
        </div>
        
        <div className="form-footer">
          <div className="form-status">
            <div className="status-dot"></div>
            {status === 'idle' && 'Usually responds within 24h'}
            {status === 'sending' && 'Sending message...'}
            {status === 'success' && 'Message sent successfully!'}
            {status === 'error' && 'Something went wrong. Try again.'}
          </div>
          <button type="submit" className="btn-send font-display" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message →'}
          </button>
        </div>
      </form>
    </div>
  );
};
