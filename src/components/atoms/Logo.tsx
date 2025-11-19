import { Bus } from 'lucide-react';

export function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <Bus />
      </div>
      <div className="logo-text">
        <span className="logo-title">HIAST Transportation</span>
        <span className="logo-subtitle">Management System</span>
      </div>
    </div>
  );
}