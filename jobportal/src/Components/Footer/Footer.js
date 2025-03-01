import React from "react";
import "./Footer.css";
import { Brain, ShieldCheck, BarChart3, Mail, PhoneCall, Globe } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      {/* Features Section */}
      <div className="footer-features">
        <div className="feature">
          <Brain size={40} color="#facc15" />
          <h3>AI-Powered Job Matching</h3>
          <p>Our smart system filters jobs based on skills and preferences using AI.</p>
        </div>
        <div className="feature">
          <ShieldCheck size={40} color="#22c55e" />
          <h3>Verified Companies</h3>
          <p>Only trusted companies can post jobs, ensuring secure and quality hires.</p>
        </div>
        <div className="feature">
          <BarChart3 size={40} color="#3b82f6" />
          <h3>Data-Driven Insights</h3>
          <p>Get personalized job recommendations and insights for better career decisions.</p>
        </div>
      </div>

      {/* Contact & Footer Section */}
      <div className="footer-contact">
        <div className="contact-item">
          <Mail size={24} color="white" />
          <p>support@jobportal.com</p>
        </div>
        <div className="contact-item">
          <PhoneCall size={24} color="white" />
          <p>+1 (555) 123-4567</p>
        </div>
        <div className="contact-item">
          <Globe size={24} color="white" />
          <p>www.jobportal.com</p>
        </div>
      </div>

      {/* Copyright */}
      <p className="footer-copyright">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
