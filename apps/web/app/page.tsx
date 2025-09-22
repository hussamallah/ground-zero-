
'use client';
import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(1200px 700px at 15% -10%, #121625, #0a0b0f)',
      color: '#f7f3ea',
      fontFamily: 'Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial',
      padding: '40px 20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#d4af37',
          marginBottom: '1rem',
          lineHeight: '1.1'
        }}>
          Ground Zero
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#aeb7c7',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          Discover your personality profile through our comprehensive assessment
        </p>
        <Link 
          href="/quiz"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: 'linear-gradient(90deg, #d4af37, #e3c566)',
            color: '#1a1208',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            textDecoration: 'none',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
            minWidth: '200px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #e3c566, #f0d675)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #d4af37, #e3c566)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
          }}
        >
          Start Here
        </Link>
      </div>
    </div>
  );
}
