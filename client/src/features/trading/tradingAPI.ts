import { apiClient } from "@/app/api-client";

export interface TradePayload {
  symbol: string;
  quantity: number;
  type: "buy" | "sell";
}

export const tradingApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    executeTrade: builder.mutation<any, TradePayload>({
      query: (body) => ({
        url: "/trading/execute",
        method: "POST",
        body,
      }),
      invalidatesTags: ["transactions", "analytics"],
    }),
  }),
});

export const { useExecuteTradeMutation } = tradingApi;
