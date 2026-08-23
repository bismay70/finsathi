import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/socket-provider";
import { useExecuteTradeMutation } from "@/features/trading/tradingAPI";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StockTick {
  symbol: string;
  price: number;
  timestamp: string;
}

const TradingDashboard = () => {
  const { socket } = useSocket();
  const [marketData, setMarketData] = useState<Record<string, StockTick[]>>({});
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState(1);
  const [executeTrade, { isLoading }] = useExecuteTradeMutation();

  useEffect(() => {
    if (!socket) return;

    socket.on("market_tick", (updates: StockTick[]) => {
      setMarketData(prev => {
        const newData = { ...prev };
        updates.forEach(tick => {
          if (!newData[tick.symbol]) {
            newData[tick.symbol] = [];
          }
          newData[tick.symbol] = [...newData[tick.symbol].slice(-20), tick]; // Keep last 20 ticks
        });
        return newData;
      });
    });

    return () => {
      socket.off("market_tick");
    };
  }, [socket]);

  const handleTrade = async (type: "buy" | "sell") => {
    try {
      await executeTrade({ symbol: selectedSymbol, quantity, type }).unwrap();
      toast.success(`Successfully ${type === 'buy' ? 'bought' : 'sold'} ${quantity}x ${selectedSymbol}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Trade failed");
    }
  };

  const chartData = marketData[selectedSymbol]?.map(tick => ({
    time: new Date(tick.timestamp).toLocaleTimeString(),
    price: tick.price
  })) || [];

  const currentPrice = marketData[selectedSymbol]?.slice(-1)[0]?.price || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Algorithmic Trading Simulator</h1>
        <p className="text-muted-foreground">Real-time mock market data fed via WebSockets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div className="flex gap-2">
               {["AAPL", "TSLA", "GOOGL", "AMZN"].map(sym => (
                 <button 
                   key={sym} 
                   onClick={() => setSelectedSymbol(sym)}
                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedSymbol === sym ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
                 >
                   {sym}
                 </button>
               ))}
             </div>
             <div className="text-right">
               <div className="text-sm text-muted-foreground">{selectedSymbol} Current Price</div>
               <div className="text-3xl font-mono font-bold">${currentPrice.toFixed(2)}</div>
             </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="time" opacity={0.5} fontSize={12} />
                <YAxis domain={['auto', 'auto']} opacity={0.5} fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold border-b pb-4 mb-6">Execute Trade</h3>
          
          <div className="space-y-6 flex-1">
            <div>
              <label className="text-sm font-medium mb-2 block">Symbol</label>
              <div className="p-3 bg-muted rounded-lg font-mono">{selectedSymbol}</div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-3 border rounded-lg bg-background"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Estimated Total</span>
                <span className="font-mono font-bold">${(currentPrice * quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button 
              onClick={() => handleTrade("sell")}
              disabled={isLoading || currentPrice === 0}
              className="py-3 rounded-lg bg-red-500/10 text-red-600 border border-red-200 font-bold hover:bg-red-500/20 transition disabled:opacity-50"
            >
              Sell
            </button>
            <button 
              onClick={() => handleTrade("buy")}
              disabled={isLoading || currentPrice === 0}
              className="py-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition disabled:opacity-50 shadow-md"
            >
              Buy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TradingDashboard;
