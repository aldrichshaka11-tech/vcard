import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import snake from '../assets/snake.png'

export default function Home() {
  const [activeStep, setActiveStep] = useState(0)
  const [testiIndex, setTestiIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    }, { threshold: 0.8, rootMargin: '-35% 0px -35% 0px' })
    document.querySelectorAll('.step').forEach(el => stepsObserver.observe(el))

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      stepsObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const testiTimer = setInterval(() => setTestiIndex(i => (i + 1) % 4), 6000)
    return () => clearInterval(testiTimer)
  }, [])

  const testimonials = [
    { 
      name: 'Sophia Anderson', 
      role: 'Marketing Director', 
      initial: 'SA',
      color: '#4b98b4',
      text: '"Their digital business card platform made a huge impact on our team\'s networking. We listened to our goals, crafted a strong strategy, and delivered consistent results. A trusted partner for any business."'
    },
    { 
      name: 'Suresh Pandian', 
      role: 'Sales Director', 
      initial: 'SP',
      color: '#4b98b4',
      text: '"Kaira completely changed how I network. I shared my card with 40 people at a conference and got 15 follow-up messages the same day. Memorable impressions every time."'
    },
    { 
      name: 'Priya Muthukumar', 
      role: 'Founder, Madurai', 
      initial: 'PM',
      color: '#4b98b4',
      text: '"The analytics dashboard is a game-changer. I can see exactly when someone views my card and follow up at the right time. Incredibly smooth transition from paper cards."'
    },
    { 
      name: 'Vijay Raghunathan', 
      role: 'HR Head', 
      initial: 'VR',
      color: '#4b98b4',
      text: '"We rolled out Kaira for our team in one afternoon. The brand consistency and the admin panel made it incredibly smooth and professional."'
    }
  ]

  return (
    <div className="landing-page">
      <div className="page-bg" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
        .landing-page *, .landing-page *::before, .landing-page *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .landing-page { font-family: 'Roboto', sans-serif; background: #ffffff; color: #0F172A; }
        html { scroll-behavior: smooth; }
        body { min-height: 100vh; }
        
        .landing-page .page-bg { position: fixed; inset: 0; z-index: -1; background: #ffffff; }
        .text-gradient { background: #4b98b4; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* Navigation */
        .landing-page nav { 
          position: fixed; top: 0; left: 0; right: 0; z-index: 100; 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 16px 60px; background: rgba(255, 255, 255, 0.95); 
          backdrop-filter: blur(20px); border-bottom: 1px solid rgba(193, 79, 62, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08); transition: all 0.3s ease;
        }
        .landing-page nav.scrolled { padding: 12px 60px; }
        .landing-page .logo { 
          font-weight: 800; font-size: 22px; color: #0F172A; 
          text-decoration: none; display: flex; align-items: center; gap: 8px;
        }
        .landing-page .logo span { color: #4b98b4; }
        .landing-page .nav-links { display: flex; gap: 48px; list-style: none; align-items: center; }
        .landing-page .nav-links a {
          text-decoration: none; color: #444; font-weight: 500; font-size: 15px; transition: 0.3s;
          position: relative; padding: 5px 0;
        }

        .landing-page .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #4b98b4;
          transition: width 0.3s ease;
        }

        .landing-page .nav-links a:hover { color: #4b98b4; }
        .landing-page .nav-links a:hover::after { width: 100%; }
        .landing-page .nav-cta { 
          background: #4b98b4 !important; color: #fff !important; 
          padding: 12px 28px; border-radius: 50px; font-weight: 600 !important; 
          text-decoration: none;
        }

        .landing-page .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          color: #0F172A;
          cursor: pointer;
          z-index: 1001;
        }

        @media (max-width: 991px) {
          .landing-page .menu-toggle { display: block; }
          .landing-page .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            height: 100vh;
            background: #ffffff;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 40px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            padding: 80px 20px;
          }
          .landing-page .nav-links.open { right: 0; }
          .landing-page .nav-links a { font-size: 20px; font-weight: 700; color: #0F172A; }
          .landing-page .nav-cta { width: 100%; text-align: center; font-size: 18px; padding: 18px; }
        }

        /* Hero */
        .landing-page .hero {
          background-color: #f8fafc; display: flex; align-items: center; 
          position: relative; padding: 140px 60px 80px; color: #1a1a1a;
          overflow: hidden;
        }

        @media (max-width: 991px) {
          .landing-page .hero { padding: 120px 24px 60px; flex-direction: column; text-align: center; min-height: auto; }
          .landing-page .hero > div { flex-direction: column !important; align-items: center !important; }
          .hero-text { max-width: 100% !important; order: 1; margin-bottom: 40px; }
          .hero-modern-image { width: 100% !important; order: 2; margin-top: 20px; }
          .phone-container { transform: none !important; height: 550px !important; margin: 0 auto; }
          .phone-frame { transform: rotate(0) !important; left: 50% !important; transform: translateX(-50%) !important; }
          .phone-screen-content { transform: rotate(0) !important; left: 50% !important; transform: translateX(-50%) !important; }
          .landing-page .hero h1 { font-size: 42px !important; margin: 0 auto 20px !important; }
          .landing-page .hero p { margin: 0 auto 30px !important; font-size: 16px !important; }
          .landing-page .hero-modern-btns { justify-content: center !important; }
        }

        @media (max-width: 480px) {
          .phone-container { height: 420px !important; }
          .landing-page .hero h1 { font-size: 34px !important; }
        }
        
        /* Background Decorations */
        .hero-bg-decorations { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .decor-circle { 
          position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(75, 152, 180, 0.1) 0%, transparent 70%); 
        }
        .decor-1 { width: 600px; height: 600px; right: -50px; top: -50px; z-index: 0; }
        .decor-2 { width: 400px; height: 400px; right: 20%; bottom: -50px; background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%); z-index: 0; }
        .decor-3 { 
          position: absolute; width: 350px; height: 350px; right: 10%; bottom: 10%; 
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%); 
          z-index: 0; border-radius: 50%;
        }
        .decor-4 {
          position: absolute; width: 250px; height: 250px; right: 35%; top: 15%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
          z-index: 0; border-radius: 50%;
        }
        
        .dots-grid {
          position: absolute; width: 180px; height: 180px; 
          background-image: radial-gradient(circle, #4b98b4 1.5px, transparent 1.5px);
          background-size: 15px 15px; opacity: 0.15;
          border-radius: 50%;
          z-index: 0;
        }
        .dots-1 { top: 22%; right: 36%; left: auto; }
        .dots-2 { bottom: 10%; right: 2%; }

        .arrow-decor {
          position: absolute; width: 180px; height: auto;
          opacity: 0.6; transform: rotate(10deg);
          z-index: 0;
        }
        .arrow-1 { bottom: 12%; left: 48%; }
        
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px; background: #f0fdf4; border: 1px solid #dcfce7;
          padding: 8px 16px; border-radius: 100px; font-size: 14px; font-weight: 600; color: #166534;
          margin-bottom: 24px;
        }
        .hero-badge span { font-size: 18px; }
        .hero-modern-content { max-width: 650px; text-align: left; }
        .hero-modern-h1 { font-family: 'Roboto', sans-serif; font-size: clamp(40px, 6vw, 85px); font-weight: 800; line-height: 1.05; margin-bottom: 30px; letter-spacing: -3px; }
        .hero-modern-p { font-size: clamp(18px, 1.4vw, 22px); line-height: 1.6; color: #444; margin-bottom: 45px; }
        .hero-modern-btns { display: flex; gap: 20px; flex-wrap: wrap; }
        .btn-modern-primary { 
          background-color: #1a1a1a; color: #fff; padding: 18px 45px; border-radius: 50px; 
          font-weight: 700; text-decoration: none; transition: all 0.3s ease; 
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .btn-modern-secondary { 
          background-color: #1a1a1a; color: #fff; padding: 18px 45px; 
          border-radius: 50px; font-weight: 700; text-decoration: none;
        }
        .hero-modern-image { 
          flex: 1; 
          display: flex; 
          justify-content: center; 
          position: relative;
          perspective: 1000px;
        }
        .phone-container {
          position: relative;
          width: 100%;
          max-width: 700px;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(80px);
          z-index: 2;
        }
        .phone-frame {
          position: absolute;
          width: 320px;
          height: 650px;
          background: #1a1a1a;
          border-radius: 40px;
          padding: 12px;
          box-shadow: 0 50px 100px rgba(0,0,0,0.3);
          border: 4px solid #333;
          overflow: hidden;
          transition: all 0.5s ease;
        }
        .phone-frame::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 30px;
          background: #000;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          z-index: 10;
        }
        .phone-1 {
          transform: rotate(-10deg) translateX(-80px);
          z-index: 2;
        }
        .phone-2 {
          transform: rotate(10deg) translateX(80px);
          z-index: 1;
          opacity: 0.8;
          filter: blur(1px);
        }
        .phone-container:hover .phone-1 { transform: rotate(-5deg) translateX(-50px) translateY(-10px); z-index: 3; }
        .phone-container:hover .phone-2 { transform: rotate(5deg) translateX(50px) translateY(-10px); opacity: 1; filter: blur(0); }
        
        .phone-screen {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
        }
        .phone-screen video, .phone-screen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .phone-container { height: 500px; }
          .phone-frame { width: 260px; height: 520px; }
          .phone-1 { transform: rotate(-5deg) translateX(-30px); }
          .phone-2 { display: none; }
        }

        /* Features */
        .landing-page section { padding: 30px 60px 20px; }
        .landing-page .features-header { text-align: center; margin-bottom: 60px; }
        .landing-page .section-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #4b98b4; font-weight: 600; margin-bottom: 16px; }
        .landing-page .section-title { font-weight: 800; font-size: clamp(32px, 4vw, 48px); letter-spacing: -1px; line-height: 1.1; color: #0F172A; }
        .landing-page .features-grid { 
          display: flex; flex-wrap: wrap; gap: 32px; max-width: 1300px; margin: 0 auto; justify-content: center; 
        }
        .landing-page .feature-icon { 
          width: 64px; height: 64px; background: #0F172A; display: flex; 
          align-items: center; justify-content: center; border-radius: 18px; 
          font-size: 28px; margin-bottom: 24px; color: #10b981;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .landing-page .feature-cell { 
          flex: 1 1 380px; max-width: 420px; background: #f8fafc; padding: 56px 48px; 
          border-radius: 32px; transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); color: #0F172A;
          position: relative; overflow: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 
            inset 8px 0 15px -10px rgba(16, 185, 129, 0.3),
            inset -8px 0 15px -10px rgba(16, 185, 129, 0.3),
            0 20px 40px rgba(0,0,0,0.05);
        }
        
        .landing-page .feature-cell::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, transparent 40%, transparent 60%, rgba(16, 185, 129, 0.12) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .feature-hover-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          transform: scale(1.1);
        }

        .landing-page .feature-cell.show-normal-img .feature-hover-img {
          opacity: 1;
          transform: scale(1);
        }

        .landing-page .feature-cell.show-normal-img .feature-cell-content {
          opacity: 0;
        }

        .landing-page .feature-cell:hover .feature-hover-img {
          opacity: 1;
          transform: scale(1);
          filter: none;
        }

        .feature-cell-content {
          position: relative;
          z-index: 2;
          transition: all 0.4s ease;
        }

        /* Default: Hide content on hover (for text-first cards) */
        .landing-page .feature-cell:not(.show-normal-img):hover .feature-cell-content {
          opacity: 0;
          transform: translateY(-20px);
        }

        /* For Image-first cards: Show content on hover */
        .landing-page .feature-cell.show-normal-img:hover .feature-cell-content {
          opacity: 1;
          transform: translateY(0);
          color: #fff;
        }

        .landing-page .feature-cell.show-normal-img:hover p { color: rgba(255,255,255,0.9); }
        .landing-page .feature-cell.show-normal-img:hover h3 { color: #fff; }

        .landing-page .feature-cell:hover .feature-hover-img {
          opacity: 1;
          transform: scale(1.05);
          filter: brightness(0.4); 
        }

        /* Ensure regular cards show full clear image on hover */
        .landing-page .feature-cell:not(.show-normal-img):hover .feature-hover-img {
          filter: none;
          opacity: 1;
        }

        .landing-page .feature-cell:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          background: #4b98b4; /* Fallback/Brand color during transition */
        }

        .landing-page .feature-cell::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -150%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: rotate(25deg);
          transition: none;
          pointer-events: none;
          z-index: 3;
          opacity: 0;
        }
        
        .landing-page .feature-cell:hover::after {
          left: 150%;
          opacity: 1;
          transition: all 0.6s ease-in-out;
        }

        .landing-page .feature-cell:hover {
          transform: rotateY(-10deg) translateY(-10px) scale(1.02);
          box-shadow: 
            inset 12px 0 20px -10px rgba(16, 185, 129, 0.5),
            inset -12px 0 20px -10px rgba(16, 185, 129, 0.5),
            0 30px 60px rgba(0,0,0,0.1);
          border-color: rgba(16, 185, 129, 0.2);
        }
        @media (min-width: 992px) {
          .landing-page .feature-cell { flex: 0 0 calc(33.33% - 32px); }
          .landing-page .feature-cell:nth-child(4), .landing-page .feature-cell:nth-child(5) { flex: 0 0 calc(33.33% - 32px); }
        }
        .landing-page .feature-icon { width: 56px; height: 56px; background: #fff; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 28px; }
        .landing-page .feature-icon img { width: 36px; height: 36px; }

        @media (max-width: 768px) {
          .landing-page section { padding: 40px 20px 20px; }
          .landing-page .feature-cell { 
            flex: 1 1 100%; 
            max-width: 100%; 
            padding: 40px 30px;
          }
          .landing-page .features-grid { gap: 16px; }
          .landing-page .stack-card { 
            padding: 40px 24px; 
            min-height: auto; 
            flex-direction: column; 
            text-align: center;
            justify-content: flex-start;
            margin-bottom: 40px !important;
            position: relative; /* Disable sticky on mobile for better visibility */
            top: 0;
          }
          .landing-page .stack-card h2 { font-size: 32px; }
          .landing-page .stacking-section { padding: 40px 20px 0; }
        }

        /* How it works */
        .landing-page .how { background: #ffffff; padding: 100px 60px; }
        .landing-page .how-inner { max-width: 1250px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .landing-page .steps { margin-top: 32px; display: flex; flex-direction: column; gap: 20px; text-align: left; }
        .landing-page .step { 
          display: flex; align-items: flex-start; gap: 24px; padding: 24px; cursor: pointer; 
          transition: all 0.5s ease; border-radius: 24px; border: 1px solid transparent;
        }
        .landing-page .step.active { background: #ffffff; border-color: rgba(193, 79, 62, 0.15); box-shadow: 0 20px 40px rgba(193, 79, 62, 0.08); transform: translateX(10px); }
        .landing-page .step-num { 
          width: 56px; height: 56px; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 16px; 
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700;
        }
        .landing-page .step.active .step-num { background: #c14f3e; color: #fff; border-color: transparent; }
        .landing-page .how-visual { position: sticky; top: 140px; height: 600px; display: flex; align-items: center; justify-content: center; }
        .landing-page .how-visual img { position: absolute; width: 95%; height: 95%; object-fit: contain; opacity: 0; transition: all 0.8s ease; transform: translate(0, 20px) scale(1.05); }
        .landing-page .how-visual img.active { opacity: 1; transform: translate(0, 0) scale(1); }

        /* Testimonials Section */
        .landing-page .testimonials-premium {
          background-color: #ffffff; padding: 40px 60px 40px; position: relative; overflow: hidden;
          margin-top: -400px; z-index: 10;
        }
        .testimonials-premium .testi-top-row {
          display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; flex-wrap: wrap; gap: 30px;
        }
        .testimonials-premium .testi-header-text { max-width: 600px; }
        .testimonials-premium .client-feedback-label { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #4b98b4; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .testimonials-premium .testi-main-title { font-size: clamp(32px, 4.5vw, 56px); font-weight: 800; color: #0F172A; line-height: 1.1; }
        .testimonials-premium .rating-pill { background: #ffffff; border-radius: 100px; padding: 12px 30px; display: flex; align-items: center; gap: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05); }
        .testimonials-premium .avatar-group { display: flex; align-items: center; }
        .testimonials-premium .avatar-item { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; margin-left: -12px; background: #eee; overflow: hidden; }
        .testimonials-premium .avatar-item:first-child { margin-left: 0; }
        .testimonials-premium .avatar-item.count { background: #1a1a1a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
        .testimonials-premium .review-stats { text-align: left; }
        .testimonials-premium .stars-row { color: #facc15; font-size: 16px; margin-bottom: 4px; }
        .testimonials-premium .reviews-count { font-size: 13px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 8px; }

        /* The Main Speech Bubble Card - DECREASED INITIAL SIZE */
        .testimonials-premium .testi-card-container {
          position: relative; max-width: 1000px; margin: 0 auto; display: flex; align-items: center; gap: 0;
        }
          .testimonials-premium .testi-initial-wrapper {
          width: 180px; height: 180px; border-radius: 50%; border: 6px solid #fff; overflow: hidden; position: relative; z-index: 5; box-shadow: 0 15px 40px rgba(0,0,0,0.1); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'Roboto', sans-serif; font-weight: 900; font-size: 75px; color: #fff; text-transform: uppercase; transition: all 0.5s ease;
        }
        .testimonials-premium .testi-bubble {
          background: #1a1a1a; color: #fff; padding: 50px 80px 50px 80px; border-radius: 60px 200px 200px 60px; margin-left: -40px; position: relative; z-index: 1; flex-grow: 1; text-align: left; min-height: 280px; display: flex; flex-direction: column; justify-content: center; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .testimonials-premium .testi-quote-text { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; font-weight: 400; margin-bottom: 24px; font-style: italic; }
        .testimonials-premium .testi-author-info h4 { font-size: 20px; font-weight: 700; margin-bottom: 2px; }
        .testimonials-premium .testi-author-info p { font-size: 13px; opacity: 0.6; font-weight: 500; }

        .testimonials-premium .testi-pagination { display: flex; justify-content: center; gap: 12px; margin-top: 30px; }
        .testimonials-premium .page-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(15, 23, 42, 0.2); cursor: pointer; transition: all 0.3s ease; }
        /* FAQ Section */
        .landing-page .faq-section {
          padding: 60px 60px 20px;
          background: #ffffff;
        }
        
        /* Pricing Section */
        .landing-page .pricing-section {
          padding: 60px 60px 100px;
          background: #ede7e1;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .price-card {
          background: #ffffff;
          border-radius: 40px;
          padding: 48px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.4s ease;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
        }
        .price-card:hover { transform: translateY(-15px); box-shadow: 0 30px 70px rgba(0,0,0,0.1); }
        .price-card.popular {
          border: 2px solid #4b98b4;
          transform: scale(1.05);
        }
        .price-card.popular:hover { transform: scale(1.05) translateY(-15px); }
        
        .popular-badge {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          background: #4b98b4;
          color: #fff;
          padding: 8px 24px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        .plan-icon { width: 48px; height: 48px; background: #f8fafc; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
        .plan-name { font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 8px; }
        .plan-price { font-size: 48px; font-weight: 900; color: #0F172A; margin-bottom: 24px; display: flex; align-items: baseline; }
        .plan-price span { font-size: 16px; font-weight: 500; color: #64748b; margin-left: 4px; }
        
        .features-list { list-style: none; margin-bottom: 40px; flex-grow: 1; }
        .feature-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 15px; color: #475569; }
        .feature-item.disabled { color: #cbd5e1; }
        .feature-item svg { width: 18px; height: 18px; flex-shrink: 0; }
        .check-icon { color: #10b981; }
        .cross-icon { color: #cbd5e1; }
        
        .pricing-cta {
          width: 100%;
          padding: 18px;
          border-radius: 20px;
          border: none;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .price-card:nth-child(1) .pricing-cta { background: #1a1a1a; color: #fff; }
        .price-card:nth-child(2) .pricing-cta { background: #4b98b4; color: #fff; }
        .price-card:nth-child(3) .pricing-cta { background: #c14f3e; color: #fff; }
        
        @media (max-width: 991px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 100%; width: 100%; margin: 0; }
          .price-card { padding: 40px 20px; width: 100%; }
          .price-card.popular { transform: none; }
          .price-card.popular:hover { transform: translateY(-15px); }
          .pricing-section { padding: 40px 10px; }
        }

        /* Final CTA Section */
        .landing-page .final-cta-section {
          padding: 20px 60px 80px;
          background: #ffffff;
        }
        .final-cta-card {
          max-width: 1200px;
          margin: 0 auto;
          background: #ede7e1;
          border-radius: 80px;
          padding: 100px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .final-cta-card h2 {
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 900;
          color: #0F172A;
          line-height: 1.1;
          margin-bottom: 32px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .final-cta-card p {
          font-size: 20px;
          color: #475569;
          max-width: 700px;
          margin: 0 auto 48px;
          line-height: 1.6;
        }
        .final-cta-btn {
          background: #c14f3e;
          color: #ffffff;
          padding: 24px 60px;
          border-radius: 100px;
          font-size: 18px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .final-cta-btn:hover { background: #4b98b4; transform: scale(1.05); }

        .stack-card-btn {
          margin-top: 32px;
          background: #ffffff;
          color: #1a1a1a;
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .stack-card-btn:hover {
          background: #1a1a1a;
          color: #ffffff;
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .final-cta-section { padding: 40px 20px; }
          .final-cta-card { padding: 60px 30px; border-radius: 40px; }
          .final-cta-btn { padding: 18px 40px; font-size: 16px; width: 100%; justify-content: center; }
        }
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .faq-item {
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          transition: all 0.3s ease;
        }
        .faq-item.active {
          border-color: #4b98b4;
          box-shadow: 0 10px 30px rgba(75, 152, 180, 0.1);
        }
        .faq-trigger {
          width: 100%;
          padding: 24px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .faq-q-text {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
        }
        .faq-num {
          color: #4b98b4;
          opacity: 0.5;
          font-size: 16px;
        }
        .faq-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 400;
          color: #0F172A;
          transition: all 0.3s ease;
        }
        .faq-item.active .faq-icon-circle {
          background: #c1ff3e; /* Lime accent from screenshot */
          transform: rotate(45deg);
        }
        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          padding: 0 30px;
          color: #64748b;
          line-height: 1.6;
          font-size: 15px;
        }
        .faq-item.active .faq-content {
          max-height: 200px;
          padding-bottom: 24px;
        }

        @media (max-width: 991px) {
          .faq-grid { grid-template-columns: 1fr; }
          .faq-section { padding: 60px 24px; }
        }

        @media (max-width: 768px) {
          .testimonials-premium { margin-top: -50px !important; padding: 40px 20px 60px; }
          .testimonials-premium .testi-top-row { margin-bottom: 30px; }
          .testimonials-premium .testi-bubble { padding: 30px; border-radius: 40px; margin-left: 0; min-height: auto; }
          .testimonials-premium .testi-card-container { flex-direction: column; text-align: center; }
          .testimonials-premium .testi-initial-wrapper { width: 100px; height: 100px; font-size: 40px; margin: 0 auto -50px; }
        }

        /* Stacking Cards Section */
        .landing-page .stacking-section {
          padding: 80px 60px;
          background: #ffffff; /* Section background to white */
          position: relative;
        }

        .landing-page .stacking-section .section-title {
          color: #0F172A;
        }

        .landing-page .stacking-section .section-desc {
          color: #6B7280;
        }

        .landing-page .stack-container {
          max-width: 1100px;
          margin: 60px auto 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-bottom: 0;
        }

        .landing-page .stack-card {
          position: sticky;
          top: 120px;
          width: 100%;
          min-height: 500px;
          border-radius: 48px;
          padding: 60px 80px;
          display: flex;
          align-items: center;
          gap: 60px;
          margin-bottom: 400px;
          background: #4b98b4; /* Card background to blue */
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          box-shadow: 0 40px 100px rgba(0,0,0,0.1);
        }

        .landing-page .stack-card:nth-child(1) { z-index: 1; }
        .landing-page .stack-card:nth-child(2) { z-index: 2; }
        .landing-page .stack-card:nth-child(3) { z-index: 3; }
        .landing-page .stack-card:nth-child(4) { z-index: 4; }

        .landing-page .stack-card h2 {
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .landing-page .stack-card p {
          font-size: 20px;
          color: rgba(255,255,255,0.8);
          max-width: 500px;
          line-height: 1.6;
        }

        @media (max-width: 991px) {
          .landing-page .stacking-section { padding: 60px 24px; }
          .landing-page .stack-card { padding: 40px; min-height: 400px; flex-direction: column; text-align: center; gap: 30px; margin-bottom: 150px; }
          .landing-page .stack-card:nth-child(1) { top: 80px; }
          .landing-page .stack-card:nth-child(2) { top: 100px; }
          .landing-page .stack-card:nth-child(3) { top: 120px; }
          .landing-page .stack-card:nth-child(4) { top: 140px; }
        }

        @media (max-width: 991px) {
          .testimonials-premium { padding: 60px 24px; }
          .testimonials-premium .testi-card-container { flex-direction: column; text-align: center; }
          .testimonials-premium .testi-initial-wrapper { width: 140px; height: 140px; margin-bottom: -40px; font-size: 55px; }
          .testimonials-premium .testi-bubble { margin-left: 0; padding: 80px 24px 40px; border-radius: 40px; text-align: center; }
          .testimonials-premium .testi-quote-text { font-size: 16px; }
        }

        /* Footer */
        .landing-page .modern-footer { background: #000000; color: #fff; padding: 80px 80px 40px; border-radius: 80px 80px 0 0; margin-top: 0; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px; }
        .footer-logo-col { display: flex; flex-direction: column; gap: 20px; }
        .footer-logo-col .logo { color: #fff; font-size: 24px; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 10px; }
        .footer-logo-col .logo span { color: #4b98b4; }
        .footer-logo-col p { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; max-width: 250px; }
        .footer-col-title { font-weight: 700; font-size: 18px; margin-bottom: 24px; color: #fff; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .footer-links li { color: rgba(255,255,255,0.7); transition: 0.3s; cursor: default; }
        .footer-links li:hover { color: #4b98b4; }
        .big-brand-text { font-weight: 900; font-size: clamp(40px, 10vw, 160px); line-height: 0.75; letter-spacing: -0.06em; margin-top: 40px; color: rgba(255, 255, 255, 0.2); overflow: hidden; white-space: nowrap; }

        @media (max-width: 991px) {
          .landing-page .modern-footer { padding: 60px 40px 40px; border-radius: 40px 40px 0 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
          .footer-logo-col { grid-column: span 2; align-items: center; text-align: center; margin-bottom: 20px; }
          .footer-logo-col p { max-width: 400px; }
        }

        @media (max-width: 580px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; text-align: center; }
          .footer-logo-col { grid-column: span 2; align-items: center; text-align: center; }
          .footer-links { align-items: center; }
          .footer-col { display: flex; flex-direction: column; align-items: center; }
        }
        
        .marquee-container {
          display: flex;
          gap: 100px;
          animation: scroll 20s linear infinite;
          width: fit-content;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 50px)); }
        }

        .marquee-text {
          flex-shrink: 0;
          display: inline-block;
        }
        
        .floating-whatsapp {
          position: fixed; bottom: 30px; right: 30px; background: #25D366; color: white; 
          border-radius: 50px; padding: 12px 24px; display: flex; align-items: center; 
          gap: 10px; font-weight: 600; text-decoration: none; z-index: 999; box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
        }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <nav>
        <Link to="/" className="logo">
          <img src="/favicon.png" alt="Kaira" style={{ width: '32px' }} />
          Kaira<span>Technologies</span>
        </Link>
        <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
          <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
          <li><a href="#how" onClick={() => setMobileMenuOpen(false)}>How it works</a></li>
          <li><Link to="/register" className="nav-cta" onClick={() => setMobileMenuOpen(false)}>Get Started Now</Link></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-bg-decorations">
          <div className="decor-circle decor-1" />
          <div className="decor-circle decor-2" />
          <div className="decor-circle decor-3" />
          <div className="decor-circle decor-4" />
          <div className="dots-grid dots-1" />
          <div className="dots-grid dots-2" />
          <img src={snake} className="arrow-decor arrow-1" alt="Snake decoration" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div className="hero-modern-content">
              <div className="hero-badge"><span>✧</span> #1 Smart Digital Business Card Platform</div>
              <h1 className="hero-modern-h1">Create. Share. Connect. <br /> Your <span style={{color: '#4b98b4'}}>Smart Digital Identity.</span></h1>
              <p className="hero-modern-p">Create a modern digital visiting card with instant contact sharing, social media links, WhatsApp integration, QR code access, portfolio showcase, and lead generation features.</p>
              <div className="hero-modern-btns">
                <Link to="/register" className="btn-modern-primary">Create my card</Link>
              </div>
            </div>
          </div>
          <div className="hero-modern-image">
            <div className="phone-container">
              <div className="phone-frame phone-1">
                <div className="phone-screen">
                  <video 
                    src="/phone/asss.webm" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                  />
                </div>
              </div>
              <div className="phone-frame phone-2">
                <div className="phone-screen">
                  <img src="/phone/second.png" alt="Reference" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="features-header">
          <div className="section-label">Everything You Need</div>
          <h2 className="section-title">Built for Professionals Who Want <span className="text-gradient">Smarter Networking</span></h2>
          <p className="section-desc">Every feature is designed to help you connect faster, build trust instantly, and grow your professional presence digitally.</p>
        </div>
        <div className="features-grid reveal">
          {[
            { icon: 'https://img.icons8.com/fluency/96/layers.png', title: 'Smart Contact Sharing', desc: 'Share your contact details instantly with a single tap or scan. Make networking faster, easier, and more professional.', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
            { icon: 'https://img.icons8.com/fluency/96/qr-code.png', title: 'Instant QR Access', desc: 'Each digital card comes with a unique QR code for quick sharing. Anyone can scan and save your details in seconds.', img: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=800' },
            { icon: 'https://img.icons8.com/fluency/96/area-chart.png', title: 'Real-Time Analytics', desc: 'Track profile visits, QR scans, and customer engagement with detailed real-time insights and performance analytics.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
            { icon: 'https://img.icons8.com/fluency/96/link.png', title: 'One Link, Everything', desc: 'Showcase your contact info, social media profiles, website, portfolio, and business details — all from one smart link.', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800' },
            { icon: 'https://img.icons8.com/fluency/96/shield.png', title: 'Privacy & Full Control', desc: 'Update your information anytime and control exactly what you want to share with clients, customers, or connections.', img: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=800' },
          ].map((f, i) => (
            <div key={i} className={`feature-cell ${(i === 0 || i === 2 || i === 4) ? 'show-normal-img' : ''}`}>
              <img src={f.img} className="feature-hover-img" alt="" />
              <div className="feature-cell-content">
                <div className="feature-icon"><img src={f.icon} alt={f.title} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stacking Cards Section (Process) */}
      <section className="stacking-section">
        <div className="features-header reveal">
          <div className="section-label">Process</div>
          <h2 className="section-title">Get Your Digital VCard Ready in <span className="text-gradient">3 Minutes</span></h2>
          <p className="section-desc">Create, customize, and start sharing your professional identity with a modern digital networking experience.</p>
        </div>
        
        <div className="stack-container">
          {[
            { title: 'Create Your Digital VCard', desc: 'Set up your professional profile with contact details, social links, business information, and branding in just minutes.', icon: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800' },
            { title: 'Customize Your Presence', desc: 'Personalize your digital card with your brand colors, profile image, business details, and professional information.', icon: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800' },
            { title: 'Share Anywhere Instantly', desc: 'Share your smart VCard through QR codes, WhatsApp, social media, email, or direct link with a single tap.', icon: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800' },
            { title: 'Build Better Connections', desc: 'Help clients and customers save your contact instantly while growing your professional network more effectively.', icon: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800' },
          ].map((card, i) => (
            <div key={i} className="stack-card">
              <div className="stack-card-content">
                <h2>{card.title}</h2>
                <p>{card.desc}</p>
                <Link to="/register" className="stack-card-btn">Create my card <span>→</span></Link>
              </div>
              <div className="stack-card-icon">
                <img src={card.icon} alt={card.title} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Testimonials Section with Google Review Initials */}
      <section className="testimonials-premium">
        <div className="testi-top-row reveal">
          <div className="testi-header-text">
            <div className="client-feedback-label">✦ Client Feedback ✦</div>
            <h2 className="testi-main-title">What our Customers<br />Saying About us</h2>
          </div>

          <div className="rating-pill">
            <div className="avatar-group">
              <div className="avatar-item" style={{ background: '#4285F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>S</div>
              <div className="avatar-item" style={{ background: '#EA4335', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>V</div>
              <div className="avatar-item" style={{ background: '#FBBC05', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>P</div>
              <div className="avatar-item count">4k</div>
            </div>
            <div className="review-stats">
              <div className="stars-row">★★★★★</div>
              <div className="reviews-count">
                1000+ Reviews
                <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" style={{ width: '18px' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="testi-card-container reveal">
          <div className="testi-initial-wrapper" style={{ background: testimonials[testiIndex].color }}>
            {testimonials[testiIndex].initial}
          </div>
          
          <div className="testi-bubble">
            <p className="testi-quote-text">{testimonials[testiIndex].text}</p>
            <div className="testi-author-info">
              <h4>{testimonials[testiIndex].name}</h4>
              <p>{testimonials[testiIndex].role}</p>
            </div>
          </div>
        </div>

        <div className="testi-pagination">
          {testimonials.map((_, i) => (
            <div key={i} className={`page-dot ${testiIndex === i ? 'active' : ''}`} onClick={() => setTestiIndex(i)} />
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="features-header reveal">
          <div className="section-label">Pricing Plans</div>
          <h2 className="section-title">Ready to Upgrade Your <span className="text-gradient">Networking?</span></h2>
          <p className="section-desc">Choose the plan that best fits your professional needs.</p>
        </div>
        
        <div className="pricing-grid reveal">
          {[
            { 
              name: 'Basic', price: '299', icon: 'https://img.icons8.com/fluency/96/flash-on.png', 
              features: ['1 Digital Card', 'Profile Photo', '5 Social Links', '7-day Analytics', 'QR Code Share'],
              disabled: ['Cover & Logo Photo', 'Custom Colors', 'Lead Capture', 'Virtual Background', 'CSV Export']
            },
            { 
              name: 'Pro', price: '599', icon: 'https://img.icons8.com/fluency/96/crown.png', popular: true,
              features: ['3 Digital Cards', 'Profile Photo', 'Unlimited Links', '30-day Analytics', 'QR Code Share', 'Cover & Logo Photo', 'Custom Colors', 'Lead Capture'],
              disabled: ['Virtual Background', 'CSV Export']
            },
            { 
              name: 'Advanced', price: '999', icon: 'https://img.icons8.com/fluency/96/rocket.png',
              features: ['Unlimited Cards', 'Profile Photo', 'Unlimited Links', 'Full Analytics History', 'QR Code Share', 'Cover & Logo Photo', 'Custom Colors', 'Lead Capture', 'Virtual Background', 'CSV Export'],
              disabled: []
            }
          ].map((plan, i) => (
            <div key={i} className={`price-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="plan-icon"><img src={plan.icon} alt={plan.name} style={{ width: '32px' }} /></div>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">₹{plan.price}<span>/month</span></div>
              
              <ul className="features-list">
                {plan.features.map((f, j) => (
                  <li key={j} className="feature-item">
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.disabled.map((f, j) => (
                  <li key={j} className="feature-item disabled">
                    <svg className="cross-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              
              <Link to="/register" className="pricing-cta" style={{display:'block', textAlign:'center', textDecoration:'none'}}>Upgrade to {plan.name}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="features-header reveal">
          <div className="section-label">✦ FAQS ✦</div>
          <h2 className="section-title">Have Questions in Your Mind?<br />Get the <span className="text-gradient">Answers Now</span></h2>
        </div>
        
        <div className="faq-grid reveal">
          {[
            { q: "What is a digital business card?", a: "A digital business card is a modern, eco-friendly way to share your professional information via a QR code or a link, instantly savable to contacts." },
            { q: "How do I share my card?", a: "You can share your card by showing your unique QR code, sending a link via WhatsApp, email, or social media, or even using NFC-enabled products." },
            { q: "Can I update my details anytime?", a: "Yes! Any changes you make to your card are updated in real-time. You don't need to re-share your link or print new cards." },
            { q: "Does it work on all devices?", a: "Absolutely. Kaira cards are web-based and work seamlessly on iPhones, Androids, and any device with a browser." },
            { q: "Is my data secure?", a: "We prioritize your privacy. You have full control over what information is visible and who can see your contact details." },
            { q: "Do you offer custom designs?", a: "Yes, our Pro and Enterprise plans allow for deep customization of colors, fonts, and layouts to match your brand." },
            { q: "Can I track my card views?", a: "Yes, our built-in analytics show you exactly how many people viewed your card and when they scanned it." },
            { q: "Is there a free version?", a: "We do not offer a free version or free trials. Our professional digital VCard services start with our affordable Basic plan, ensuring premium value for every user." }
          ].map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-q-text">
                  <span className="faq-num">{`0${i + 1}.`}</span>
                  {faq.q}
                </div>
                <div className="faq-icon-circle">+</div>
              </button>
              <div className="faq-content">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-card reveal">
          <h2>Your First Impressions are in <span className="text-gradient">Safe Hands</span> 🏆</h2>
          <p>
            We handle the digital infrastructure so you can focus on building relationships. 
            Trusted digital vcard solution serving professionals worldwide.
          </p>
          <Link to="/register" className="final-cta-btn">
            CREATE YOUR FREE CARD <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-grid">
          <div className="footer-logo-col">
            <Link to="/" className="logo">
              <img src="/favicon.png" alt="Kaira" style={{ width: '40px' }} />
              Kaira<span>Technologies</span>
            </Link>
            <p>Elevate your professional networking with our smart digital business cards. Connect instantly, share seamlessly.</p>
          </div>
          <div className="footer-col">
            <h5 className="footer-col-title">Product</h5>
            <ul className="footer-links">
              <li>Features</li>
              <li>Pricing</li>
              <li>How it works</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="footer-col-title">Get Started</h5>
            <ul className="footer-links">
              <li>Create Account</li>
              <li>Login</li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="footer-col-title">Company</h5>
            <ul className="footer-links">
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="footer-col-title">Legal</h5>
            <ul className="footer-links">
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="big-brand-text">
          <div className="marquee-container">
            <span className="marquee-text">KAIRA</span>
            <span className="marquee-text">KAIRA</span>
            <span className="marquee-text">KAIRA</span>
            <span className="marquee-text">KAIRA</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.5 }}>© 2026 Kaira Technologies. All rights reserved.</div>
      </footer>

      <a href="https://wa.me/916379430293" target="_blank" rel="noreferrer" className="floating-whatsapp">
        <img src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="WA" style={{ width: '24px' }} />
        Chat with us
      </a>
    </div>
  )
}
