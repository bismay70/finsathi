import { getSocketIO } from "../../socket";

const MOCK_STOCKS = [
  { symbol: "AAPL", price: 150.0, volatility: 0.005 },
  { symbol: "TSLA", price: 200.0, volatility: 0.015 },
  { symbol: "GOOGL", price: 130.0, volatility: 0.008 },
  { symbol: "AMZN", price: 100.0, volatility: 0.012 },
];

export const processMarketTick = async () => {
  try {
    const io = getSocketIO();
    const updates = MOCK_STOCKS.map((stock) => {
      // Random walk: price changes by a random percentage between -volatility and +volatility
      const change = 1 + (Math.random() * 2 - 1) * stock.volatility;
      stock.price = Number((stock.price * change).toFixed(2));
      return {
        symbol: stock.symbol,
        price: stock.price,
        timestamp: new Date().toISOString(),
      };
    });

    // Broadcast to all connected clients
    io.emit("market_tick", updates);
  } catch (error) {
    // If Socket.io is not initialized yet, just ignore
  }
};
