import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const AboutPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-16">
          
          {/* About Us Section */}
          <section id="about" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 scroll-mt-24">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-6">About Us</h1>
            <div className="prose prose-lg text-slate-600">
              <p className="mb-4">
                Welcome to <strong>RentX</strong>, your unified platform for renting or buying properties, plus all the supporting services you need to make it home. We believe that finding a new place to live or work should be a seamless, integrated experience.
              </p>
              <p>
                Our mission is to connect tenants with property owners directly, while also providing easy access to verified service professionals like movers, cleaners, plumbers, and electricians. We remove the friction from real estate and home maintenance so you can focus on what matters most.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 scroll-mt-24">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Get in Touch</h3>
                <p className="mb-4">Have questions or need support? Our team is here to help you.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-xl">📧</span>
                    <a href="mailto:support@rentx.com" className="hover:text-green-600 transition-colors">support@rentx.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-xl">📞</span>
                    <a href="tel:+1234567890" className="hover:text-green-600 transition-colors">+1 (234) 567-890</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-600 text-xl">🏢</span>
                    <span>123 Real Estate Blvd, Suite 100, Tech City</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="Your Email" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                    <textarea className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 h-24 resize-none" placeholder="How can we help?"></textarea>
                  </div>
                  <button type="button" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors">Send Message</button>
                </form>
              </div>
            </div>
          </section>

          {/* Privacy Policy Section */}
          <section id="privacy" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 scroll-mt-24">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Privacy Policy</h2>
            <div className="prose text-slate-600 space-y-4">
              <p>Last updated: August 1, 2026</p>
              <h3 className="text-lg font-semibold text-slate-800">1. Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
              
              <h3 className="text-lg font-semibold text-slate-800">2. How We Use Your Information</h3>
              <p>We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, and develop new features.</p>
              
              <h3 className="text-lg font-semibold text-slate-800">3. Information Sharing</h3>
              <p>We may share the information we collect about you with vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf.</p>
            </div>
          </section>

          {/* Terms of Service Section */}
          <section id="terms" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 scroll-mt-24">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Terms of Service</h2>
            <div className="prose text-slate-600 space-y-4">
              <p>Last updated: August 1, 2026</p>
              <h3 className="text-lg font-semibold text-slate-800">1. Acceptance of Terms</h3>
              <p>By accessing and using RentX, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
              
              <h3 className="text-lg font-semibold text-slate-800">2. User Responsibilities</h3>
              <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
              
              <h3 className="text-lg font-semibold text-slate-800">3. Service Modifications</h3>
              <p>RentX reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time. You agree that RentX shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>
            </div>
          </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
