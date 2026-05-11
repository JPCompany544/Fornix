export interface DepositRequest {
    id: string;
    user_id: string;
    amount: number;
    method: string;
    reference: string;
    proof_url: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    profiles: {
        email: string;
    };
}

export interface WithdrawalRequest {
    id: string;
    user_id: string;
    portfolio_id: string;
    amount: number;
    method: 'crypto' | 'bank';
    status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
    created_at: string;
    reference_code: string;
    token?: string;
    network?: string;
    wallet_address?: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    routing_number?: string;
    swift_code?: string;
    profiles: {
        email: string;
        full_name?: string;
    };
}

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    type: string;
    status: string;
    description: string;
    created_at: string;
    profiles: {
        email: string;
    };
}
