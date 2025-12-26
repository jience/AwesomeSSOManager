import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, title }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-900/20 border-0",
    secondary: "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-white",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
    ghost: "bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} title={title}>
      {children}
    </button>
  );
};

export interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  name?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, type = "text", required = false, name }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white placeholder-gray-600 transition-all hover:bg-black/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
    />
  </div>
);

export interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options, required = false }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest mb-2 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none text-white transition-all hover:bg-black/60"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cyan-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl ${className}`}>
    {children}
  </div>
);

export interface BadgeProps {
  active: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ active }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
    {active ? 'Active' : 'Offline'}
  </span>
);

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl max-w-sm w-full p-8 shadow-2xl transform transition-all scale-100">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-8 leading-relaxed text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} className="px-6">Cancel</Button>
          <Button variant="danger" onClick={onConfirm} className="px-6 shadow-lg shadow-red-900/20">Confirm</Button>
        </div>
      </div>
    </div>
  );
};

// Notification Toast Components
import { XIcon, CheckCircleIcon, ShieldIcon } from './Icons';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  onDismiss: (id: string) => void;
}

const toastIcons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
  error: <XIcon className="w-6 h-6 text-red-400" />,
  info: <ShieldIcon className="w-6 h-6 text-cyan-400" />,
};

const toastStyles = {
  success: 'bg-green-500/10 border-green-500/20 text-green-200',
  error: 'bg-red-500/10 border-red-500/20 text-red-200',
  info: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-200',
};

export const Toast: React.FC<ToastProps> = ({ id, type, title, message, onDismiss }) => {
  return (
    <div className={`w-full max-w-sm rounded-2xl shadow-2xl pointer-events-auto border backdrop-blur-xl overflow-hidden ${toastStyles[type]}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {toastIcons[type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="mt-1 text-xs text-gray-300">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(id)}
              className="inline-flex text-gray-500 rounded-md hover:text-gray-300 focus:outline-none"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => (
  <div
    aria-live="assertive"
    className="fixed inset-0 z-[100] flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
      {children}
    </div>
  </div>
);
