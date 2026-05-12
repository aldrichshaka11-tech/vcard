import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Home() {
  const [activeStep, setActiveStep] = useState(0)
  const [testiIndex, setTestiIndex] = useState(0)
  const [isAnnual, setIsAnnual] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pricing = {
    pro: isAnnual ? 499 : 624,
    enterprise: isAnnual ? 1999 : 2499,
  }

  const formatPrice = (value) => value.toLocaleString('en-IN')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), 60)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // Add scroll effect to navigation
    const handleScroll = () => {
      const nav = document.querySelector('nav')
      if (window.scrollY > 50) {
        nav.classList.add('scrolled')
      } else {
        nav.classList.remove('scrolled')
      }
    }

    const stepsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'))
          setActiveStep(index)
        }
      })
    }, {
      threshold: 0.8,
      rootMargin: '-35% 0px -35% 0px'
    })
    document.querySelectorAll('.step').forEach(el => stepsObserver.observe(el))

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      stepsObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const testiTimer = setInterval(() => setTestiIndex(i => (i + 1) % 6), 6000)
    return () => {
      clearInterval(testiTimer)
    }
  }, [])

  return (
    <div className="landing-page">
      <div className="page-bg" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
        .landing-page *, .landing-page *::before, .landing-page *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .landing-page { font-family: 'Roboto', sans-serif; background: #F5F7FF; color: #0F172A; overflow-x: hidden; }
        .landing-page html { scroll-behavior: smooth; }
        /* ── Global Abstract Background ── */
        .landing-page .page-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(180deg, #F5F7FF, #EDEBFF);
        }
        .landing-page .page-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(123, 92, 255, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(79, 140, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .text-gradient {
          background: linear-gradient(90deg, #4F8CFF, #7B5CFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        /* Enhanced Navigation Bar */
        .landing-page nav { 
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          z-index: 100; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 16px 60px; 
          background: rgba(255, 255, 255, 0.95); 
          backdrop-filter: blur(20px); 
          border-bottom: 1px solid rgba(0, 87, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .landing-page nav.scrolled {
          padding: 12px 60px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
        }
        
        .landing-page .logo { 
          font-family: 'Roboto', sans-serif; 
          font-weight: 800; 
          font-size: 22px; 
          letter-spacing: -0.5px; 
          color: #0F172A; 
          text-decoration: none; 
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .landing-page .logo:hover {
          transform: translateY(-2px);
        }
        
        .landing-page .logo span { 
          color: #4F8CFF; 
        }
        
        .landing-page .logo-icon {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4F8CFF;
          position: relative;
        }
        
        .landing-page .logo-icon::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: rgba(79, 140, 255, 0.2);
          animation: pulse 2s ease infinite;
        }
        
        .landing-page .nav-links { 
          display: flex; 
          gap: 48px; 
          list-style: none; 
          align-items: center;
        }
        
        .landing-page .nav-links a { 
          text-decoration: none; 
          color: #6B7280; 
          font-size: 15px; 
          font-weight: 500; 
          letter-spacing: 0.2px; 
          transition: all 0.3s ease;
          position: relative;
          padding: 8px 20px;
        }
        .landing-page .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #4F8CFF;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .landing-page .nav-links a:hover { color: #4F8CFF; transform: translateY(-2px); }
        .landing-page .nav-links a:hover::after { width: 100%; }
        .landing-page .nav-cta { 
          background: linear-gradient(90deg, #4F8CFF, #7B5CFF) !important; 
          color: #fff !important; 
          padding: 12px 28px; 
          border-radius: 50px; 
          font-weight: 600 !important; 
          font-size: 15px;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(79, 140, 255, 0.3);
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          z-index: 0;
        }
        .landing-page .nav-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #3A78E8, #6A4AE8);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 50px;
          z-index: -1;
        }
        .landing-page .nav-cta:hover {
          transform: translateY(-3px) scale(1.04) !important;
          box-shadow: 0 10px 28px rgba(79, 140, 255, 0.45) !important;
          color: #fff !important;
        }
        .landing-page .nav-cta:hover::after { opacity: 1; }
        /* ── Hero Video & Floating UI ── */
        .landing-page .hero {
          margin-top: 70px;
          height: calc(100vh - 70px);
          position: relative;
          overflow: hidden;
        }
        .landing-page .hero-video {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }
        .landing-page .desktop-video { display: block; }
        .landing-page .mobile-video { display: none; }
        
        .floating-ui-card {
          position: absolute;
          z-index: 5;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .float-1 { top: 20%; left: 15%; animation-delay: 0s; }
        .float-2 { bottom: 30%; right: 15%; animation-delay: 2s; }
        .float-3 { top: 40%; right: 10%; animation-delay: 4s; }
        
        .glass-color-picker { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #4F8CFF, #7B5CFF); }
        .glass-toggle { width: 36px; height: 20px; border-radius: 10px; background: #4F8CFF; position: relative; }
        .glass-toggle::after { content: ''; position: absolute; right: 2px; top: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; }
        /* every slide fills the hero box */
        .landing-page .slide {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0;
          transition: opacity 0.9s ease;
          pointer-events: none;
        }
        .landing-page .slide.active {
          opacity: 1;
          pointer-events: auto;
        }
        /* slide 1 – full background image, no overlay */
        .landing-page .slide-fullbg {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .landing-page .slide-fullbg.slide-contain {
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
        }
        /* slides 2 & 3 – full bg with left text overlay */
        .landing-page .slide-fullbg .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, transparent 100%);
        }
        .landing-page .slide-fullbg .slide-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 80px;
          z-index: 2;
          max-width: 620px;
        }
        .landing-page .slide-fullbg .slide-content.slide-content-short {
          top: auto;
          bottom: auto;
          inset: 0;
          justify-content: flex-end;
          padding-bottom: 120px;
          background: none;
        }
        .landing-page .slide-fullbg.slide-short {
          background-size: cover;
          background-position: center center;
        }
        .landing-page .slide-fullbg .slide-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #4ade80;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .landing-page .slide-fullbg .slide-badge::before {
          content: '';
          width: 28px; height: 2px;
          background: #4ade80;
          display: inline-block;
          flex-shrink: 0;
        }
        .landing-page .slide-fullbg .slide-h1 {
          font-family: 'Roboto', sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 4.5vw, 60px);
          line-height: 1.1;
          letter-spacing: -1.5px;
          color: #fff;
          white-space: pre-line;
          margin-bottom: 20px;
        }
        .landing-page .slide-fullbg .slide-p {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin-bottom: 32px;
          max-width: 440px;
        }
        .landing-page .slide-fullbg .slide-trust {
          margin-top: 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
        }
        /* slides 2 & 3 – split layout */
        .landing-page .slide-split {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .landing-page .slide-split-inner {
          width: 100%;
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 60px;
          display: flex;
          align-items: center;
          gap: 60px;
        }
        .landing-page .slide-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }
        .landing-page .slide-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 40px 0;
        }
        .landing-page .slide-right img {
          max-width: 100%;
          max-height: calc(100vh - 160px);
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
          display: block;
        }
        /* text colours for dark bg slides */
        .landing-page .slide-dark .slide-badge { color: #4ade80; }
        .landing-page .slide-dark .slide-badge::before { background: #4ade80; }
        .landing-page .slide-dark .slide-h1 { color: #fff; }
        .landing-page .slide-dark .slide-h1 em { color: #a5b4fc; font-style: normal; }
        .landing-page .slide-dark .slide-p { color: rgba(255,255,255,0.75); }
        .landing-page .slide-dark .slide-trust { color: rgba(255,255,255,0.4); }
        /* text colours for light bg slides */
        .landing-page .slide-light .slide-badge { color: #5665a9; }
        .landing-page .slide-light .slide-badge::before { background: #5665a9; }
        .landing-page .slide-light .slide-h1 { color: #1a1a3e; }
        .landing-page .slide-light .slide-h1 em { color: #7c3aed; font-style: normal; }
        .landing-page .slide-light .slide-p { color: #3a3a5a; }
        .landing-page .slide-light .slide-trust { color: rgba(26,26,62,0.45); }
        /* shared text styles */
        .landing-page .slide-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .landing-page .slide-badge::before {
          content: '';
          width: 28px; height: 2px;
          display: inline-block;
          flex-shrink: 0;
        }
        .landing-page .slide-h1 {
          font-family: 'Roboto', sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 4.5vw, 60px);
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }
        .landing-page .slide-p {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.7;
          max-width: 460px;
          margin-bottom: 32px;
        }
        .landing-page .slide-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #5665a9;
          color: #fff;
          padding: 15px 34px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          width: fit-content;
          box-shadow: 0 8px 28px rgba(86,101,169,0.45);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .landing-page .slide-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.5s ease;
        }
        .landing-page .slide-btn:hover::before { left: 100%; }
        .landing-page .slide-btn:hover {
          background: #4554a0;
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 16px 40px rgba(86,101,169,0.6);
          letter-spacing: 0.3px;
        }
        .landing-page .slide-trust {
          margin-top: 14px;
          font-size: 12px;
        }
        /* slide 1 CTA */
        .landing-page .slide1-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(90deg, #4F8CFF, #7B5CFF);
          color: #fff;
          padding: 18px 44px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          position: absolute;
          bottom: 80px;
          left: 80px;
          z-index: 6;
          box-shadow: 0 10px 40px rgba(79,140,255,0.4);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .landing-page .slide1-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .landing-page .slide1-cta:hover { transform: translateY(-5px) scale(1.04); box-shadow: 0 20px 50px rgba(79,140,255,0.55); }
        .landing-page .slide1-cta:hover::before { opacity: 1; }
        /* dots */
        .landing-page .slider-dots {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        .landing-page .dot {
          width: 28px; height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }
        .landing-page .dot:hover { background: rgba(255,255,255,0.75); width: 38px; }
        .landing-page .dot.active { background: #fff; width: 52px; }
        /* mobile */
        @media (max-width: 768px) {
          .landing-page .hero { margin-top: 56px; height: calc(100vh - 56px); }
          .landing-page .desktop-video { display: none; }
          .landing-page .mobile-video { display: block; }
          .landing-page .slide-fullbg { background-image: var(--mobile-bg) !important; background-size: cover; background-position: center; }
          .landing-page .slide-badge,
          .landing-page .slide-fullbg .slide-p,
          .landing-page .slide-fullbg .slide-trust { display: none !important; }
          .landing-page .slide-fullbg .slide-overlay { background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.05) 65%, rgba(0,0,0,0.65) 100%); }
          .landing-page .slide-fullbg .slide-content {
            justify-content: space-between;
            padding: 36px 20px 52px;
            max-width: 100%;
          }
          .landing-page .slide-fullbg .slide-h1 { font-size: clamp(22px, 5.5vw, 32px); letter-spacing: -1px; margin-bottom: 0; }
          .landing-page .slide-btn { display: inline-flex !important; padding: 13px 28px; font-size: 14px; width: fit-content; }
          .landing-page .slide1-cta { left: 20px; bottom: 52px; padding: 13px 28px; font-size: 14px; }
          .landing-page .slider-dots { bottom: 16px; }
        }
        

        .landing-page section { padding: 100px 60px; }
        .landing-page .section-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #0057ff; font-weight: 500; margin-bottom: 16px; }
        .landing-page .section-title { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: clamp(32px, 4vw, 48px); letter-spacing: -1px; line-height: 1.1; color: #0F172A; max-width: 560px; }
        .landing-page .section-desc { font-size: 17px; color: #6B7280; font-weight: 300; line-height: 1.7; max-width: 480px; margin-top: 16px; }
        .landing-page .features { background: transparent; }
        .landing-page .features-header { text-align: center; margin-bottom: 72px; display: flex; flex-direction: column; align-items: center; }
        .landing-page .features-grid { display: flex; flex-wrap: wrap; gap: 32px; max-width: 1100px; margin: 0 auto; justify-content: center; }
        .landing-page .feature-cell { 
          position: relative;
          flex: 1 1 300px; max-width: 340px; background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 44px 40px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 24px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04); border: 1px solid rgba(255, 255, 255, 0.8); 
        }
        .landing-page .feature-cell::before {
          content: ''; position: absolute; inset: -2px; border-radius: 26px; z-index: -1;
          background: linear-gradient(135deg, rgba(79,140,255,0.6), rgba(123,92,255,0.6), transparent 60%);
          opacity: 0; filter: blur(6px); transition: opacity 0.5s ease;
        }
        .landing-page .feature-cell:hover::before { opacity: 1; }
        .landing-page .feature-cell:hover { background: rgba(255, 255, 255, 0.8); transform: translateY(-8px); box-shadow: 0 20px 50px rgba(79, 140, 255, 0.15); border-color: transparent; }
        .landing-page .feature-cell:hover h3, .landing-page .feature-cell:hover p { color: #0F172A; }
        .landing-page .feature-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 24px; transition: all 0.3s ease; }
        .landing-page .feature-cell h3 { font-family: 'Roboto', sans-serif; font-weight: 600; font-size: 18px; color: #0F172A; margin-bottom: 10px; transition: color 0.3s ease; }
        .landing-page .feature-cell p { font-size: 14px; color: #6B7280; line-height: 1.7; transition: color 0.3s ease; }
        .landing-page .how { background: #ffffff; position: relative; padding: 120px 60px; overflow: hidden; }
        .landing-page .how::before { content: ''; position: absolute; top: -20%; left: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(79, 140, 255, 0.05), transparent 60%); pointer-events: none; }
        .landing-page .how::after { content: ''; position: absolute; bottom: -20%; right: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(123, 92, 255, 0.05), transparent 60%); pointer-events: none; }
        .landing-page .how-inner { 
          max-width: 1250px; 
          margin: 0 auto; 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 80px; 
          align-items: center; 
        }
        .landing-page .how-content { position: relative; z-index: 2; padding: 40px 0; }
        .landing-page .steps { 
          margin-top: 56px; 
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
          position: relative;
        }
        .landing-page .steps::before {
          content: '';
          position: absolute;
          top: 36px;
          bottom: 36px;
          left: 27px;
          width: 2px;
          background: linear-gradient(to bottom, rgba(0, 87, 255, 0.1), rgba(123, 92, 255, 0.1));
          border-radius: 2px;
        }
        .landing-page .timeline-progress {
          position: absolute;
          top: 36px;
          left: 27px;
          width: 2px;
          background: linear-gradient(to bottom, #4F8CFF, #7B5CFF);
          transition: height 1s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 1;
          box-shadow: 0 0 10px rgba(123, 92, 255, 0.4);
        }
        .landing-page .step { 
          display: flex; 
          align-items: flex-start;
          gap: 24px; 
          padding: 24px; 
          cursor: pointer; 
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1); 
          position: relative;
          z-index: 1;
          border-radius: 24px;
          border: 1px solid transparent;
        }
        .landing-page .step:hover {
          background: rgba(245, 247, 255, 0.5);
        }
        /* Hide mobile image on desktop */
        .landing-page .step-mobile-img { display: none; }
        .landing-page .step-num { 
          font-family: 'Roboto', sans-serif; 
          font-weight: 700; 
          font-size: 16px; 
          color: #94A3B8; 
          width: 56px; 
          height: 56px;
          background: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0; 
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          position: relative;
          z-index: 2;
        }
        .landing-page .step-content { flex: 1; padding-top: 4px; }
        .landing-page .step-content h4 { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 20px; color: #334155; margin-bottom: 8px; transition: color 0.5s ease; }
        .landing-page .step-content p { font-size: 15px; color: #64748B; line-height: 1.6; transition: color 0.5s ease; }
        
        .landing-page .step.active {
          background: #ffffff;
          border-color: rgba(79, 140, 255, 0.15);
          box-shadow: 0 20px 40px rgba(79, 140, 255, 0.08);
          transform: translateX(10px);
        }
        .landing-page .step.active .step-num { 
          background: linear-gradient(135deg, #4F8CFF, #7B5CFF);
          color: #fff; 
          border-color: transparent;
          box-shadow: 0 10px 20px rgba(79, 140, 255, 0.3);
          transform: scale(1.1);
        }
        .landing-page .step.active h4 { color: #0F172A; }
        .landing-page .step.active p { color: #475569; }
        
        .landing-page .how-visual { 
          position: sticky; 
          top: 140px; 
          height: calc(100vh - 200px); 
          min-height: 600px;
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        .landing-page .how-visual-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .landing-page .how-visual img {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 95%;
          height: 95%;
          object-fit: contain;
          opacity: 0;
          z-index: 2;
          transform: translate(-50%, calc(-50% + 20px)) scale(1.05);
          transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          filter: drop-shadow(0 20px 50px rgba(79, 140, 255, 0.2));
          -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 65%, transparent 100%);
          mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 65%, transparent 100%);
        }
        .landing-page .how-visual img.active {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        .landing-page .pricing { background: #0a0a0f; text-align: center; position: relative; overflow: hidden; }
        .landing-page .pricing::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,87,255,0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 10% 100%, rgba(201,168,76,0.08) 0%, transparent 60%); pointer-events: none; }
        .landing-page .pricing-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; }
        .landing-page .pricing-header { margin-bottom: 72px; position: relative; z-index: 1; }
        .landing-page .pricing-header .section-label { color: #5a8fff; }
        .landing-page .pricing-header .section-title { color: #ffffff; margin: 0 auto; text-align: center; }
        .landing-page .pricing-header .section-desc { color: rgba(255,255,255,0.45); margin: 16px auto 0; text-align: center; }
        .landing-page .billing-toggle { display: inline-flex; align-items: center; gap: 14px; margin-top: 32px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; padding: 6px 8px 6px 20px; }
        .landing-page .billing-toggle span { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 400; }
        .landing-page .billing-toggle span.active { color: #fff; font-weight: 500; }
        .landing-page .toggle-track { width: 44px; height: 24px; border-radius: 50px; background: #0057ff; position: relative; cursor: pointer; flex-shrink: 0; transition: background 0.3s; border: 0; }
        .landing-page .toggle-thumb { width: 18px; height: 18px; border-radius: 50%; background: white; position: absolute; top: 3px; left: 3px; transition: transform 0.25s cubic-bezier(.4,0,.2,1); box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
        .landing-page .toggle-track.annual .toggle-thumb { transform: translateX(20px); }
        .landing-page .save-badge { background: rgba(90,255,180,0.15); color: #5affb4; font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 50px; border: 1px solid rgba(90,255,180,0.2); margin-right: 6px; }
        .landing-page .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 1040px; margin: 0 auto; position: relative; z-index: 1; align-items: start; }
        .landing-page .pricing-card { border-radius: 28px; text-align: left; transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s; position: relative; overflow: hidden; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
        .landing-page .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 32px 80px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.14); }
        .landing-page .card-top { padding: 36px 36px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; }
        .landing-page .card-body { padding: 28px 36px 36px; }
        .landing-page .pricing-card.featured { background: #fff; border-color: transparent; box-shadow: 0 24px 80px rgba(0,87,255,0.25), 0 0 0 1px rgba(0,87,255,0.3); transform: translateY(-12px); }
        .landing-page .pricing-card.featured:hover { transform: translateY(-18px); box-shadow: 0 40px 100px rgba(0,87,255,0.35), 0 0 0 1px rgba(0,87,255,0.4); }
        .landing-page .featured-glow { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #0057ff, #5a8fff, #0057ff); background-size: 200% 100%; animation: shimmer 3s ease infinite; border-radius: 28px 28px 0 0; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .landing-page .pricing-card.featured .card-top { background: #f7f9ff; border-bottom-color: rgba(0,87,255,0.1); }
        .landing-page .enterprise-border-glow { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); border-radius: 28px 28px 0 0; }
        .landing-page .plan-badge-featured { display: inline-flex; align-items: center; gap: 6px; background: #0057ff; color: white; font-size: 11px; font-weight: 500; padding: 6px 14px; border-radius: 50px; margin-bottom: 20px; letter-spacing: 0.3px; }
        .landing-page .plan-badge-featured::before { content: '✦'; font-size: 9px; }
        .landing-page .plan-badge-enterprise { display: inline-flex; align-items: center; gap: 6px; background: rgba(201,168,76,0.12); color: #c9a84c; font-size: 11px; font-weight: 500; padding: 6px 14px; border-radius: 50px; margin-bottom: 20px; border: 1px solid rgba(201,168,76,0.25); }
        .landing-page .plan-name { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.5px; color: rgba(255,255,255,0.9); margin-bottom: 4px; }
        .landing-page .pricing-card.featured .plan-name { color: #0a0a0f; }
        .landing-page .plan-tagline { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; }
        .landing-page .pricing-card.featured .plan-tagline { color: #7a7a8e; }
        .landing-page .price { display: flex; align-items: flex-start; gap: 2px; margin-bottom: 4px; }
        .landing-page .price-currency { font-family: 'Roboto', sans-serif; font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 10px; }
        .landing-page .pricing-card.featured .price-currency { color: #7a7a8e; }
        .landing-page .price-amount { font-family: 'Roboto', sans-serif; font-weight: 800; font-size: 60px; color: #fff; line-height: 1; letter-spacing: -2px; transition: all 0.3s; }
        .landing-page .pricing-card.featured .price-amount { color: #0a0a0f; }
        .landing-page .price-period { font-size: 12px; color: rgba(255,255,255,0.3); margin-bottom: 0; }
        .landing-page .pricing-card.featured .price-period { color: #7a7a8e; }
        .landing-page .features-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 16px; font-weight: 500; }
        .landing-page .pricing-card.featured .features-label { color: #7a7a8e; }
        .landing-page .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .landing-page .plan-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: rgba(255,255,255,0.6); line-height: 1.5; }
        .landing-page .pricing-card.featured .plan-features li { color: #3a3a4a; }
        .landing-page .check-wrap { width: 18px; height: 18px; border-radius: 50%; background: rgba(90,255,180,0.12); border: 1px solid rgba(90,255,180,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .landing-page .pricing-card.featured .check-wrap { background: rgba(0,87,255,0.1); border-color: rgba(0,87,255,0.25); }
        .landing-page .pricing-card.enterprise .check-wrap { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.25); }
        .landing-page .check { font-size: 10px; color: #5affb4; }
        .landing-page .pricing-card.featured .check { color: #0057ff; }
        .landing-page .pricing-card.enterprise .check { color: #c9a84c; }
        .landing-page .plan-cta { width: 100%; padding: 15px 20px; border-radius: 14px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s cubic-bezier(.4,0,.2,1); text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); letter-spacing: 0.1px; }
        .landing-page .plan-cta .cta-arrow { transition: transform 0.2s; font-size: 16px; }
        .landing-page .plan-cta:hover { background: rgba(255,255,255,0.12); color: white; border-color: rgba(255,255,255,0.2); }
        .landing-page .plan-cta:hover .cta-arrow { transform: translateX(3px); }
        .landing-page .plan-cta.featured-cta { background: #5665a9; color: white; border-color: #0057ff; box-shadow: 0 8px 32px rgba(0,87,255,0.35); font-weight: 600; }
        .landing-page .plan-cta.featured-cta:hover { background: #5665a9; border-color: #0040cc; box-shadow: 0 12px 40px rgba(0,87,255,0.45); transform: translateY(-1px); }
        .landing-page .plan-cta.enterprise-cta { background: rgba(201,168,76,0.1); color: #c9a84c; border-color: rgba(201,168,76,0.3); }
        .landing-page .plan-cta.enterprise-cta:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.5); color: #e0b84f; }
        .landing-page .plan-note { text-align: center; font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 12px; }
        .landing-page .pricing-card.featured .plan-note { color: #7a7a8e; }
        .landing-page .testimonials { background: transparent; padding: 100px 20px; overflow: hidden; }
        .landing-page .testi-inner { max-width: 800px; margin: 0 auto; position: relative; }
        .landing-page .testi-header { text-align: center; margin-bottom: 56px; display: flex; flex-direction: column; align-items: center; }
        .landing-page .testi-slider { 
          position: relative; 
          width: 100%; 
          height: 380px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        .landing-page .testi-card { 
          position: absolute; 
          inset: 0; 
          background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6)); 
          backdrop-filter: blur(20px); 
          -webkit-backdrop-filter: blur(20px);
          border-radius: 40px; 
          padding: 60px 48px; 
          border: 1px solid rgba(255,255,255,0.9); 
          text-align: center; 
          box-shadow: 0 20px 50px rgba(79, 140, 255, 0.08), inset 0 0 0 1px rgba(255,255,255,0.8); 
          opacity: 0;
          visibility: hidden;
          transform: translateX(60px) scale(0.92);
          transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .landing-page .testi-card::before {
          content: '"';
          position: absolute;
          top: -20px;
          left: 40px;
          font-size: 200px;
          font-family: Georgia, serif;
          color: rgba(79, 140, 255, 0.06);
          line-height: 1;
          pointer-events: none;
        }
        .landing-page .testi-card.active {
          opacity: 1;
          visibility: visible;
          transform: translateX(0) scale(1);
          box-shadow: 0 30px 80px rgba(79, 140, 255, 0.15), inset 0 0 0 1px rgba(255,255,255,0.9);
        }
        .landing-page .testi-dots { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
        .landing-page .testi-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(79, 140, 255, 0.2); cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
        .landing-page .testi-dot:hover { background: rgba(79, 140, 255, 0.4); transform: scale(1.2); }
        .landing-page .testi-dot.active { background: linear-gradient(135deg, #4F8CFF, #7B5CFF); width: 36px; border-radius: 12px; box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3); }
        .landing-page .stars { color: #c9a84c; font-size: 22px; letter-spacing: 4px; margin-bottom: 24px; filter: drop-shadow(0 2px 4px rgba(201,168,76,0.3)); }
        .landing-page .testi-text { font-size: 22px; line-height: 1.7; color: #1E293B; font-weight: 400; margin-bottom: 40px; max-width: 650px; font-style: italic; position: relative; z-index: 1; }
        .landing-page .testi-author { display: flex; align-items: center; gap: 20px; flex-direction: row; text-align: left; background: rgba(255,255,255,0.5); padding: 12px 24px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .landing-page .testi-avatar { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 20px; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 3px solid #fff; }
        .landing-page .testi-name { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 18px; color: #0F172A; margin-bottom: 2px; }
        .landing-page .testi-role { font-size: 14px; color: #64748B; }
        .landing-page .testi-nav { 
          position: absolute; 
          top: 50%; 
          transform: translateY(-50%); 
          width: 64px; 
          height: 64px; 
          border-radius: 50%; 
          background: #fff; 
          border: 1px solid rgba(79, 140, 255, 0.15); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          z-index: 10; 
          box-shadow: 0 10px 30px rgba(79, 140, 255, 0.1); 
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          font-size: 24px;
          color: #4F8CFF;
        }
        .landing-page .testi-nav:hover { 
          background: linear-gradient(135deg, #4F8CFF, #7B5CFF); 
          color: #fff; 
          transform: translateY(-50%) scale(1.1); 
          box-shadow: 0 15px 40px rgba(79, 140, 255, 0.3); 
          border-color: transparent;
        }
        .landing-page .testi-nav.prev { left: -80px; }
        .landing-page .testi-nav.next { right: -80px; }
        @media (max-width: 1000px) {
          .landing-page .testi-nav.prev { left: 10px; }
          .landing-page .testi-nav.next { right: 10px; }
        }
        .landing-page .cta-band { 
          background: #5665a9; 
          padding: 80px 40px; 
          text-align: center; 
          position: relative; 
          overflow: hidden; 
          max-width: 1100px; 
          margin: 40px auto 100px; 
          border-radius: 40px; 
          box-shadow: 0 30px 60px rgba(86,101,169,0.2);
        }
        .landing-page .cta-band::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,87,255,0.2) 0%, transparent 70%); }
        .landing-page .cta-band h2 { font-family: 'Roboto', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 64px); color: #fff; letter-spacing: -1.5px; line-height: 1.05; max-width: 700px; margin: 0 auto 24px; position: relative; z-index: 1; }
        .landing-page .cta-band p { font-size: 17px; font-weight: 300; color: rgba(255,255,255,0.6); max-width: 420px; margin: 0 auto 48px; line-height: 1.7; position: relative; z-index: 1; }
        .landing-page .cta-band .btn-primary { 
          background: linear-gradient(90deg, #4F8CFF, #7B5CFF); 
          color: #fff;
          box-shadow: 0 10px 40px rgba(79, 140, 255, 0.3); 
          position: relative; 
          z-index: 1; 
          font-size: 16px; 
          font-weight: 700;
          padding: 20px 48px; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          border: none;
          border-radius: 50px;
        }
        .landing-page .cta-band .btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        .landing-page .cta-band .btn-primary:hover::before { left: 100%; }
        .landing-page .cta-band .btn-primary:hover { 
          transform: translateY(-5px) scale(1.04); 
          box-shadow: 0 20px 50px rgba(79, 140, 255, 0.45);
          color: #fff;
          letter-spacing: 0.3px;
        }
        /* ── Footer ── */
        .landing-page footer {
          background: #0F172A;
          color: #ffffff;
          padding: 80px 60px 40px;
          position: relative;
          overflow: hidden;
        }
        .landing-page footer::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(79,140,255,0.15), transparent 60%);
          pointer-events: none;
        }
        .landing-page footer::after {
          content: '';
          position: absolute;
          bottom: -150px; left: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(123,92,255,0.15), transparent 60%);
          pointer-events: none;
        }
        .landing-page .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          position: relative; z-index: 1;
        }
        .landing-page .footer-brand { max-width: 300px; }
        .landing-page .footer-brand .logo {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          text-decoration: none;
          display: block;
          margin-bottom: 16px;
        }
        .landing-page .footer-brand .logo span { color: #ff9d9d; }
        .landing-page .footer-brand p {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .landing-page .footer-social { display: flex; gap: 12px; }
        .landing-page .social-link {
          width: 42px; height: 42px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          font-size: 18px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }
        .landing-page .social-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #4F8CFF, #7B5CFF);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        .landing-page .social-link:hover {
          transform: translateY(-5px) scale(1.05);
          border-color: transparent;
          box-shadow: 0 10px 25px rgba(79, 140, 255, 0.3);
        }
        .landing-page .social-link:hover::before {
          opacity: 1;
        }
        .landing-page .footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(79, 140, 255, 0.1);
          border: 1px solid rgba(79, 140, 255, 0.2);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 13px;
          color: #4F8CFF;
          font-weight: 500;
          margin-top: 20px;
          transition: all 0.3s ease;
        }
        .landing-page .footer-badge:hover {
          background: rgba(79, 140, 255, 0.15);
          border-color: rgba(79, 140, 255, 0.3);
          transform: translateY(-2px);
        }
        .landing-page .footer-badge-icon {
          width: 16px; height: 16px;
          background: #4F8CFF;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: #fff;
          box-shadow: 0 0 10px rgba(79, 140, 255, 0.5);
        }
        .landing-page .footer-col h5 {
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 24px;
          position: relative;
          display: inline-block;
        }
        .landing-page .footer-col h5::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 24px;
          height: 2px;
          background: #4F8CFF;
          border-radius: 2px;
        }
        .landing-page .footer-col ul { list-style: none; }
        .landing-page .footer-col ul li { margin-bottom: 14px; }
        .landing-page .footer-col ul li a {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 15px;
          transition: all 0.3s ease;
          position: relative;
          display: inline-flex;
          align-items: center;
          padding-bottom: 2px;
        }
        .landing-page .footer-col ul li a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: 0;
          left: 0;
          background-color: #4F8CFF;
          transition: width 0.3s ease;
        }
        .landing-page .footer-col ul li a:hover { 
          color: #ffffff; 
          transform: translateX(6px); 
        }
        .landing-page .footer-col ul li a:hover::after { 
          width: 100%; 
        }
        .landing-page .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative; z-index: 1;
        }
        .landing-page .footer-bottom p { font-size: 14px; color: rgba(255,255,255,0.5); }
        .landing-page .footer-bottom-links { display: flex; gap: 32px; }
        .landing-page .footer-bottom-links a {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }
        .landing-page .footer-bottom-links a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #ffffff;
          transition: width 0.3s ease;
        }
        .landing-page .footer-bottom-links a:hover { color: #ffffff; }
        .landing-page .footer-bottom-links a:hover::after { width: 100%; }
        @media (max-width: 900px) {
          .landing-page .footer-top { flex-direction: column; text-align: center; padding: 40px 32px; }
          .landing-page .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 768px) {
          .landing-page .floating-ui-card { display: none; }
          .landing-page footer { padding: 60px 20px 32px; }
          .landing-page .footer-top { padding: 32px 24px; margin-bottom: 40px; }
          .landing-page .footer-top-text h3 { font-size: 20px; }
          .landing-page .footer-inner { grid-template-columns: 1fr; gap: 0; padding-bottom: 32px; }
          .landing-page .footer-brand { max-width: 100%; padding-bottom: 28px; border-bottom: 1px solid rgba(86,101,169,0.1); margin-bottom: 8px; }
          .landing-page .footer-col { padding: 20px 0; border-bottom: 1px solid rgba(86,101,169,0.08); }
          .landing-page .footer-col:last-child { border-bottom: none; }
          .landing-page .footer-col h5 { margin-bottom: 14px; }
          .landing-page .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
          .landing-page .footer-bottom-links { flex-wrap: wrap; justify-content: center; gap: 16px; }
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .landing-page .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .landing-page .reveal.visible { opacity: 1; transform: translateY(0); }
        /* Mobile Responsiveness */
        @media (max-width: 1200px) {
          .landing-page .features-grid { max-width: 900px; }
        }

        @media (max-width: 900px) {
          .landing-page nav { padding: 12px 24px; }
          .landing-page .logo { font-size: 20px; }
          .landing-page .nav-links { display: none; }
          .landing-page section { padding: 72px 24px; }
          .landing-page .features-grid, .landing-page .pricing-grid, .landing-page .testi-grid { grid-template-columns: 1fr; }
          .landing-page .how { padding: 80px 24px; }
          .landing-page .how-inner { grid-template-columns: 1fr; gap: 40px; }
          .landing-page .how-visual { display: none; }
          
          /* Mobile step accordion */
          .landing-page .step {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 16px;
            background: rgba(255,255,255,0.7);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 24px;
            padding: 24px !important;
            margin-bottom: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            transform: none !important;
          }
          .landing-page .step.active {
            border-color: rgba(79, 140, 255, 0.3);
            box-shadow: 0 12px 30px rgba(79, 140, 255, 0.12);
            background: #ffffff;
          }
          .landing-page .step-num {
            width: 44px; height: 44px; font-size: 14px; border-radius: 12px;
          }
          .landing-page .step-content {
            width: calc(100% - 60px);
            padding-top: 0;
          }
          .landing-page .step-content h4 {
            line-height: 44px;
            margin-bottom: 0;
            font-size: 18px;
          }
          .landing-page .step-content p {
            margin-top: 12px;
            margin-bottom: 0;
            font-size: 14px;
            display: none;
          }
          .landing-page .step.active .step-content p {
            display: block;
            animation: fadeIn 0.5s ease forwards;
          }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
          
          .landing-page .step-mobile-img {
            display: block;
            width: 100%;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease, transform 0.6s ease;
            opacity: 0;
            transform: translateY(10px);
            margin-top: 0;
            margin-left: 0;
          }
          .landing-page .step.active .step-mobile-img {
            max-height: 600px;
            opacity: 1;
            transform: translateY(0);
            margin-top: 16px;
            margin-bottom: 8px;
          }
          .landing-page .step-mobile-img img {
            width: 100%;
            height: auto;
            max-height: 380px;
            object-fit: contain;
            border-radius: 16px;
            filter: drop-shadow(0 10px 30px rgba(0,0,0,0.08));
            display: block;
          }
          /* Hide desktop timeline line on mobile */
          .landing-page .steps::before, .landing-page .timeline-progress { display: none; }
          .landing-page .footer-inner { grid-template-columns: 1fr 1fr; }
          .mobile-menu-toggle {
            display: block;
          }

          .mobile-nav {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .landing-page nav { padding: 12px 20px; }
          .landing-page .logo { font-size: 18px; }
          .landing-page section { padding: 60px 20px; }
          .landing-page .features-header { margin-bottom: 48px; }
          .landing-page .feature-cell { padding: 30px 24px; }
          .landing-page .feature-icon { width: 44px; height: 44px; font-size: 20px; margin-bottom: 20px; }
          .landing-page .feature-cell h3 { font-size: 16px; }
          .landing-page .feature-cell p { font-size: 13px; }
          .landing-page .steps { margin-top: 32px; }
          .landing-page .step-content h4 { font-size: 16px; }
          .landing-page .step-content p { font-size: 13px; }
          .landing-page .cta-band { padding: 80px 20px; }
          .landing-page .cta-band .btn-primary { padding: 18px 36px; font-size: 15px; }
        }

        @media (max-width: 640px) {
          .landing-page nav { padding: 10px 16px; }
          .landing-page .logo { font-size: 16px; }
          .landing-page section { padding: 48px 16px; }
          .landing-page .section-title { font-size: clamp(28px, 4vw, 40px); }
          .landing-page .section-desc { font-size: 16px; }
          .landing-page .features-header { margin-bottom: 32px; }
          .landing-page .feature-cell { padding: 24px 20px; }
          .landing-page .feature-icon { width: 40px; height: 40px; font-size: 18px; margin-bottom: 16px; }
          .landing-page .feature-cell h3 { font-size: 15px; }
          .landing-page .feature-cell p { font-size: 12px; }
          .landing-page .steps { margin-top: 24px; }
          .landing-page .step-num { font-size: 12px; width: 36px; height: 36px; }
          .landing-page .step-content { width: calc(100% - 48px); }
          .landing-page .step-content h4 { font-size: 15px; line-height: 36px; }
          .landing-page .step-content p { font-size: 12px; margin-top: 8px; }
          .landing-page .testi-header { margin-bottom: 40px; }
          .landing-page .testi-card { padding: 24px 20px; }
          .landing-page .testi-text { font-size: 14px; }
          .landing-page .cta-band { padding: 60px 16px; }
          .landing-page .cta-band .btn-primary { padding: 16px 32px; font-size: 14px; }
          .landing-page .footer { padding: 48px 16px 32px; }
          .landing-page .footer-inner { gap: 32px; padding-bottom: 32px; }
          .landing-page .footer-brand .logo { font-size: 22px; }
          .landing-page .footer-brand p { font-size: 13px; }
          .landing-page .footer-social { gap: 8px; }
          .landing-page .social-link { width: 32px; height: 32px; font-size: 12px; }
          .landing-page .footer-badge { font-size: 10px; padding: 5px 10px; }
          .landing-page .footer-badge-icon { width: 12px; height: 12px; font-size: 6px; }
          .landing-page .footer-col h5 { font-size: 13px; margin-bottom: 16px; }
          .landing-page .footer-col ul { gap: 12px; }
          .landing-page .footer-col ul a { font-size: 14px; }
          .landing-page .footer-bottom { gap: 12px; }
          .landing-page .footer-bottom-links { gap: 10px; }
          .landing-page .footer-bottom-links a { font-size: 12px; }
        }

        @media (max-width: 480px) {
          .landing-page .section-title { font-size: clamp(24px, 3.5vw, 36px); }
          .landing-page .section-desc { font-size: 15px; }
          .landing-page .feature-cell { padding: 20px 16px; }
          .landing-page .feature-icon { width: 36px; height: 36px; font-size: 16px; margin-bottom: 12px; }
          .landing-page .feature-cell h3 { font-size: 14px; margin-bottom: 8px; }
          .landing-page .feature-cell p { font-size: 11px; }
          .landing-page .step { padding: 16px !important; }
          .landing-page .step-content h4 { font-size: 14px; }
          .landing-page .step-content p { font-size: 11px; }
          .landing-page .testi-card { padding: 20px 16px; }
          .landing-page .testi-text { font-size: 13px; }
          .landing-page .cta-band { padding: 48px 12px; }
          .landing-page .cta-band .btn-primary { padding: 14px 28px; font-size: 13px; }
          .landing-page .footer { padding: 40px 12px 24px; }
          .landing-page .footer-inner { gap: 24px; padding-bottom: 24px; }
          .landing-page .footer-brand .logo { font-size: 20px; }
          .landing-page .footer-brand p { font-size: 12px; }
          .landing-page .footer-social { gap: 6px; }
          .landing-page .social-link { width: 28px; height: 28px; font-size: 10px; }
          .landing-page .footer-badge { font-size: 9px; padding: 4px 8px; }
          .landing-page .footer-badge-icon { width: 10px; height: 10px; font-size: 5px; }
          .landing-page .footer-col h5 { font-size: 12px; margin-bottom: 12px; }
          .landing-page .footer-col ul { gap: 8px; }
          .landing-page .footer-col ul a { font-size: 13px; }
          .landing-page .footer-bottom p { font-size: 12px; }
          .landing-page .footer-bottom-links { gap: 8px; }
          .landing-page .footer-bottom-links a { font-size: 11px; }
        }

        /* Enhanced Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: none;
          background: rgba(0, 87, 255, 0.1);
          border: 1px solid rgba(0, 87, 255, 0.2);
          cursor: pointer;
          padding: 10px;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .mobile-menu-toggle:hover {
          background: rgba(0, 87, 255, 0.15);
          transform: translateY(-2px);
        }

        .mobile-menu-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background: #0057ff;
          margin: 5px 0;
          transition: all 0.3s;
          border-radius: 2px;
        }

        .mobile-menu-toggle.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-toggle.active span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-toggle.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-nav {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(160deg, #eef4ff 0%, #f0f4ff 40%, #f5f0ff 100%);
          backdrop-filter: blur(20px);
          z-index: 200;
          padding: 100px 24px 40px;
          overflow-y: auto;
        }

        .mobile-nav.active {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .mobile-nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-nav-links li {
          margin-bottom: 0;
        }

        .mobile-nav-links a {
          display: flex;
          align-items: center;
          padding: 18px 28px;
          background: rgba(255,255,255,0.85);
          border-radius: 20px;
          text-decoration: none;
          color: #1a1a3e;
          font-size: 17px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(86,101,169,0.1);
          border: 1px solid rgba(86,101,169,0.12);
          backdrop-filter: blur(8px);
          letter-spacing: 0.2px;
        }

        .mobile-nav-links a:hover {
          background: linear-gradient(135deg, #5665a9, #7c3aed);
          color: white;
          transform: translateX(6px) scale(1.02);
          box-shadow: 0 8px 30px rgba(86,101,169,0.35);
          border-color: transparent;
        }

        .mobile-nav-links .nav-cta {
          background: linear-gradient(135deg, #ff0000, #ff4444);
          color: white;
          margin-top: 8px;
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(255,0,0,0.3);
          justify-content: center;
        }
        .mobile-nav-links .nav-cta:hover {
          background: linear-gradient(135deg, #cc0000, #ff2222);
          transform: translateX(0) scale(1.03);
          box-shadow: 0 12px 32px rgba(255,0,0,0.45);
        }

        @media (max-width: 900px) {
          .mobile-menu-toggle {
            display: block;
          }

          .mobile-nav {
            display: none;
          }
        }

        .landing-page .floating-whatsapp {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #25D366;
          color: white;
          border-radius: 50px;
          padding: 12px 24px 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Roboto', sans-serif;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
          z-index: 999;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .landing-page .floating-whatsapp:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 40px rgba(37, 211, 102, 0.5);
          color: white;
        }
        .landing-page .floating-whatsapp svg {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
      `}</style>

      <nav>
        <Link to="/" className="logo">
          <img src="/favicon.png" alt="Kaira" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          Kaira<span>Technology</span>
        </Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><Link to="/register" className="nav-cta">Get Started Now</Link></li>
        </ul>
        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-links">
          <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
          <li><a href="#how" onClick={() => setMobileMenuOpen(false)}>How it works</a></li>
          <li><Link to="/register" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>Get Started Now</Link></li>
        </ul>
      </div>

      <section className="hero">
        <video 
          className="hero-video desktop-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/phone/hero.webm" type="video/webm" />
        </video>
        <video 
          className="hero-video mobile-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/phone/heromobile.webm" type="video/webm" />
        </video>
        <div className="floating-ui-card float-1">
          <div className="glass-color-picker"></div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Brand Color</span>
        </div>
        <div className="floating-ui-card float-2">
          <div className="glass-toggle"></div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Custom Layout</span>
        </div>
        <div className="floating-ui-card float-3" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ width: '60px', height: '6px', background: 'rgba(79, 140, 255, 0.2)', borderRadius: '3px', margin: '0 0 8px 0' }}></div>
          <div style={{ width: '40px', height: '6px', background: 'rgba(79, 140, 255, 0.2)', borderRadius: '3px' }}></div>
        </div>
        <Link to="/register" className="slide1-cta">
          Get Started Now <span>→</span>
        </Link>
      </section>

      <section className="features" id="features">
        <div className="features-header reveal">
          <div className="section-label">Everything You Need</div>
          <h2 className="section-title">Built for professionals<br />who want <span className="text-gradient">Customized</span> cards</h2>
          <p className="section-desc">Every feature designed to help you make memorable first impressions and track meaningful connections.</p>
        </div>
        <div className="features-grid reveal">
          {[
            { icon: '✦', bg: '#E6F0FF', color: '#4F8CFF', title: 'Beautiful Templates', desc: 'Choose from 50+ professionally designed templates. Customise colors, fonts, and layout to match your brand identity perfectly.' },
            { icon: '📲', bg: '#F0E6FF', color: '#7B5CFF', title: 'Instant QR Sharing', desc: 'Generate a unique QR code for every card. Anyone can scan and save your contact in one tap.' },
            { icon: '📊', bg: '#FFE6F0', color: '#FF4F8C', title: 'Real-time Analytics', desc: 'See who viewed your card, when they scanned it, and where they came from.' },
            { icon: '🔗', bg: '#FFF4E6', color: '#FF8C4F', title: 'One Link, Everything', desc: 'A single shareable link houses your website, social profiles, portfolio, and contact.' },
            { icon: '🔒', bg: '#E6FFF0', color: '#4CAF50', title: 'Privacy & Control', desc: 'Choose exactly what information to share and with whom. Update your details anytime.' },
          ].map((f, i) => (
            <div key={i} className="feature-cell">
              <div className="feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how" id="how">
        <div className="how-inner">
          <div className="how-content">
            <div className="section-label">Simple Process</div>
            <h2 className="section-title">Up and running in 3 minutes</h2>
            <p className="section-desc">No design skills needed. Create a card that impresses everyone.</p>
            <div className="steps">
              <div className="timeline-progress" style={{ height: `${(activeStep / 3) * 82}%` }} />
              {[
                { title: 'Create your design', desc: 'Pick from beautifully crafted templates or customise every element to match your brand colours.', mobileImg: '/phone/mobilefirst.png' },
                { title: 'Scan QR Code', desc: 'Instantly generate your unique QR code and let others scan it to open your digital card', mobileImg: '/phone/mobilesecond.png' },
                { title: 'Get your Vcard', desc: 'Instantly generate your unique your digital card.', mobileImg: '/phone/monilethird.png' },
                { title: 'Share everywhere', desc: 'Share your VCard through WhatsApp, email, LinkedIn, QR code, or print it on physical cards.', mobileImg: '/phone/four.png' },
              ].map((step, index) => (
                <div 
                  key={step.title} 
                  className={`step ${activeStep === index ? 'active' : ''}`} 
                  onClick={() => setActiveStep(index)} 
                  onMouseEnter={() => setActiveStep(index)}
                  data-index={index}
                >
                  <div className="step-num">{`0${index + 1}`}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                  {step.mobileImg && (
                    <div className="step-mobile-img">
                      <img src={step.mobileImg} alt={step.title} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="how-visual">
            <div className="how-visual-container">
              {[
                '/phone/first.png',
                '/phone/second.png',
                '/phone/third.png',
                '/phone/heronew.png'
              ].map((src, idx) => (
                <img 
                  key={src} 
                  src={src} 
                  alt={`Step ${idx + 1}`} 
                  className={activeStep === idx ? 'active' : ''} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="testimonials">
        <div className="testi-inner">
          <div className="testi-header reveal">
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Trusted by professionals<br />across India</h2>
          </div>
          
          <div className="testi-slider">
            <button className="testi-nav prev" onClick={() => setTestiIndex(i => (i - 1 + 6) % 6)}>←</button>
            <button className="testi-nav next" onClick={() => setTestiIndex(i => (i + 1) % 6)}>→</button>
            
            {[
              { avatar: 'SP', grad: 'linear-gradient(135deg,#0057ff,#0084ff)', name: 'Suresh Pandian', role: 'Sales Director, Chennai', text: '"Kaira completely changed how I network. I shared my card with 40 people at a conference and got 15 follow-up messages the same day."' },
              { avatar: 'PM', grad: 'linear-gradient(135deg,#7c3aed,#a855f7)', name: 'Priya Muthukumar', role: 'Founder, Madurai', text: '"The analytics dashboard is a game-changer. I can see exactly when someone views my card and follow up at the right time."' },
              { avatar: 'VR', grad: 'linear-gradient(135deg,#059669,#10b981)', name: 'Vijay Raghunathan', role: 'HR Head, Coimbatore', text: '"We rolled out Kaira for our 80-person team in one afternoon. The brand consistency and the admin panel made it incredibly smooth."' },
              { avatar: 'AK', grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)', name: 'Arjun Kapoor', role: 'Real Estate Lead, Mumbai', text: '"Sharing my contact info has never been easier. The QR code feature on my business card always gets a wow from clients."' },
              { avatar: 'NL', grad: 'linear-gradient(135deg,#ec4899,#f472b6)', name: 'Neha Lakshmi', role: 'Marketing Expert, Bangalore', text: '"I love the design flexibility. I can update my social links in seconds, and my card is instantly refreshed everywhere."' },
              { avatar: 'RK', grad: 'linear-gradient(135deg,#6366f1,#818cf8)', name: 'Rajesh Kumar', role: 'Tech Consultant, Hyderabad', text: '"The analytics show me exactly which regions are engaging with my profile. It is incredibly useful for my outreach strategy."' },
            ].map((item, index) => (
              <div key={item.name} className={`testi-card ${testiIndex === index ? 'active' : ''}`}>
                <div className="stars">★★★★★</div>
                <p className="testi-text">{item.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: item.grad }}>{item.avatar}</div>
                  <div><div className="testi-name">{item.name}</div><div className="testi-role">{item.role}</div></div>
                </div>
              </div>
            ))}
          </div>

          <div className="testi-dots">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`testi-dot ${testiIndex === i ? 'active' : ''}`} onClick={() => setTestiIndex(i)} />
            ))}
          </div>
        </div>
      </section>

      <div className="cta-band">
        <h2>Ready to make your mark?</h2>
        <p>Join thousands of professionals already using Kaira to grow their network smarter.</p>
        <Link to="/register" className="btn-primary">Create Your Free vCard <span className="arrow">→</span></Link>
      </div>

      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/favicon.png" alt="Kaira" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              Kaira Technologies<span>.</span>
            </Link>
            <p>Professional digital vCards built for the way modern India networks. From freelancers to Fortune 500 teams.</p>
            <div className="footer-contact" style={{ marginBottom: '28px', fontSize: '15px', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
              <div style={{ marginBottom: '10px' }}>Email: kairateamkvp@gmail.com</div>
              <div>Phone: 6379430293</div>
            </div>
            <div className="footer-social">
              <a href="#" className="social-link">📧</a>
              <a href="#" className="social-link">💬</a>
              <a href="#" className="social-link">📱</a>
              <a href="#" className="social-link">🔗</a>
            </div>
            <div className="footer-badge">
              <div className="footer-badge-icon">✓</div>
              SSL Secured Platform
            </div>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><Link to="/editor">Features</Link></li>
              <li><Link to="/editor">Templates</Link></li>
              <li><Link to="/register">Pricing</Link></li>
              <li><Link to="/editor">Analytics</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Solutions</h5>
            <ul>
              <li><Link to="/editor">For Individuals</Link></li>
              <li><Link to="/editor">For Teams</Link></li>
              <li><Link to="/editor">For Enterprise</Link></li>
              <li><Link to="/editor">API Access</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Blog</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Kaira Technology. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
            <Link to="/">Cookie Policy</Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/916379430293" 
        target="_blank" 
        rel="noopener noreferrer"
        className="floating-whatsapp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.201.535 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.031 18.105c-1.85 0-3.6-.531-5.111-1.458l-5.69 1.493 1.528-5.547c-1.045-1.583-1.611-3.435-1.61-5.358 0-5.462 4.444-9.907 9.906-9.907s9.907 4.445 9.907 9.907c0 5.46-4.445 9.904-9.906 9.906z" />
        </svg>
        Chat with us
      </a>
    </div>
  )
}
