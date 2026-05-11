import { createClientClient } from './supabaseClient';

export async function executeTrade(
    portfolioId: string,
    symbol: string,
    type: 'buy' | 'sell',
    quantity: number,
    price: number
) {
    const supabase = createClientClient();

    // The execution is strictly handled in PostgreSQL via RPC to guarantee 
    // All-or-Nothing atomic transactions and robust accounting logic.
    const { data, error } = await supabase.rpc('execute_trade', {
        p_portfolio_id: portfolioId,
        p_symbol: symbol.toUpperCase().trim(),
        p_trade_type: type,
        p_quantity: quantity,
        p_price: price
    });

    if (error) {
        console.error("[TradeExecution] RPC Error:", error.message, error.details);
        throw new Error(error.message);
    }

    return { success: true, data };
}
