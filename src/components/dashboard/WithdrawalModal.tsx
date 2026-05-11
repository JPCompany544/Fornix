"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import WithdrawalWizard from '../withdrawal/WithdrawalWizard';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    portfolioId: string;
    availableToWithdraw: number;
    pendingWithdrawalsTotal: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ 
    isOpen, 
    onClose, 
    userId, 
    portfolioId,
    availableToWithdraw = 0,
    pendingWithdrawalsTotal = 0
}) => {
    // Lock body scroll while open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[500] flex items-end md:items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-all duration-500"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className="relative z-10 w-full md:max-w-3xl md:mx-4 bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden h-[92vh] md:h-[800px] max-h-[95vh] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]"
                style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}
            >
                {/* Fixed Top Section (Close) */}
                <div className="absolute top-6 right-6 z-40">
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-white hover:border-slate-200 transition-all shadow-sm"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile Drag Handle */}
                <div className="flex justify-center pt-4 md:hidden shrink-0">
                    <div className="w-12 h-1.5 rounded-full bg-slate-100" />
                </div>

                <WithdrawalWizard 
                    onClose={onClose} 
                    userId={userId}
                    portfolioId={portfolioId}
                    availableToWithdraw={availableToWithdraw}
                    pendingWithdrawalsTotal={pendingWithdrawalsTotal}
                />
            </div>

            <style jsx global>{`
                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default WithdrawalModal;
