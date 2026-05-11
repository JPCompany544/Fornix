/**
 * FORNIX Institutional Funding Configuration
 * Defines addresses and instructions for capital onboarding.
 */

export const CRYPTO_CONFIG = {
    USDC: {
        Ethereum: {
            address: "0x89205A3A3b2A6aDbad810a483a5422d90467c9c2", // Placeholder
            memo: false
        },
        Solana: {
            address: "8x9205A3A3b2A6aDbad810a483a5422d90467c9c2", // Placeholder
            memo: false
        },
        BSC: {
            address: "0x89205A3A3b2A6aDbad810a483a5422d90467c9c2", // Placeholder
            memo: false
        }
    },
    USDT: {
        Ethereum: {
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            memo: false
        },
        Solana: {
            address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            memo: false
        },
        TRON: {
            address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            memo: false
        }
    },
    BTC: {
        Bitcoin: {
            address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            memo: false
        }
    },
    ETH: {
        Ethereum: {
            address: "0x0000000000000000000000000000000000000000",
            memo: false
        }
    }
};

export const BANK_CONFIG = {
    WIRE: {
        accountName: "FORNIX CAPITAL MANAGEMENT LLC",
        bankName: "J.P. Morgan Chase & Co.",
        routingNumber: "021000021",
        accountNumber: "987654321098",
        swift: "CHASUS33",
        instructions: "Ensure reference code is included in the wire instructions for automatic reconciliation."
    },
    ACH: {
        accountName: "FORNIX CAPITAL MANAGEMENT LLC",
        bankName: "J.P. Morgan Chase & Co.",
        routingNumber: "021000021",
        accountNumber: "987654321098",
        instructions: "Standard ACH transfers settle within 1-3 business days."
    }
};
