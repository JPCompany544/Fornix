import { useEffect } from "react";
import { createClientClient } from "@/lib/supabaseClient";

export function useAdminRealtime(refresh: () => void) {
  const supabase = createClientClient();

  useEffect(() => {
    // Withdrawal realtime channel
    const withdrawalChannel = supabase
      .channel("admin-withdrawals-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "withdrawal_requests",
        },
        () => {
          console.log("[Realtime] Withdrawal change detected, refreshing...");
          refresh();
        }
      )
      .subscribe();

    // Deposit realtime channel
    const depositChannel = supabase
      .channel("admin-deposits-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deposit_requests",
        },
        () => {
          console.log("[Realtime] Deposit change detected, refreshing...");
          refresh();
        }
      )
      .subscribe();

    // Audit/Transaction realtime channel
    const transactionChannel = supabase
      .channel("admin-transactions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        () => {
          console.log("[Realtime] Transaction change detected, refreshing...");
          refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(withdrawalChannel);
      supabase.removeChannel(depositChannel);
      supabase.removeChannel(transactionChannel);
    };
  }, [refresh, supabase]);
}
