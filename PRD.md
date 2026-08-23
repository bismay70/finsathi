FinSathi: Unified Finance Platform (Personal Finance, ATM, and Trading)
Executive Summary: We propose transforming FinSathi into an integrated finance platform that unifies personal expense tracking with real-time banking and trading features. The flagship application will incorporate: (1) an AI-powered expense manager with OCR receipt scanning, budgeting, and analytics; (2) a real-time ATM-style banking terminal (PIN-authenticated withdrawals, deposits, transfers, mini-statements, and cash-dispensing logic) accessible via web or mobile; and (3) a trading portfolio module leveraging AlgoCash portfolio analytics and Finlatics internship insights. This platform will demonstrate event-driven, real-time architecture (Node.js/Socket.IO + Redis pub/sub) and rigorous security (TLS, JWT auth, PCI-aligned PIN handling). Core integration points include feeding Finlatics research and simulated trades into FinSathi’s analytics dashboards, and using AlgoCash’s equal-weight S&P 500 strategy for portfolio recommendations. We provide detailed functional requirements, data flows, code examples (Node.js, Python, OCR), tables comparing key libraries/APIs, and mermaid diagrams for transaction and ATM flows. All designs prioritize scalability (horizontal WebSocket servers), reliability, and bank-grade security standards.

Functional Requirements
User Accounts & Security: Each user has secure login (email/password) and optionally an ATM-style card/PIN. All sessions use JWT tokens. PINs and passwords are salted and hashed, PIN entry is encrypted end-to-end (see Security). Multi-factor or device-binding can be added for bank-level assurance.
Expense Tracking & Analytics: Users link bank accounts (mock or real via APIs), then record transactions manually or via OCR. The app categorizes expenses (food, rent, etc.), tracks budgets, and shows charts/insights (monthly spend, top categories, overshoot alerts).
OCR Receipt Scanning: Users upload receipt images; the system runs OCR to extract store name, date, line items, totals, taxes, etc., then auto-creates transactions. Users review/correct parsed fields as needed.
Real-Time Sync & Notifications: Any change (new transaction, account balance update, trading P/L) is broadcast in real time to all connected clients (web/mobile) via WebSockets. Users see instant updates (for example, if a withdrawal is made on one device, all others immediately show the new balance and transaction).
ATM-Style Terminal UI: A dedicated interface simulates an ATM kiosk. Users “insert” their virtual card (select account) and enter a PIN. The terminal offers menu choices: Withdraw, Deposit, Transfer, Mini-Statement, Change PIN. It must compute cash denominations (e.g. dispense ₹2,000s, ₹500s), update balances, and print digital receipts. The mini-statement shows recent transactions (in real time). This feature showcases synchronous backend banking logic with a unique UI/UX.
Trading Simulation & Portfolio Module: Integrate AlgoCash and Finlatics functionality: Users can simulate stock trades or allocate funds to a portfolio. The system fetches market data (via APIs or websockets), executes simulated buy/sell orders, and tracks positions/P&L. An equal-weight S&P 500 portfolio is implemented (rebalance quarterly) and compared versus the market-cap-weighted index. Performance metrics (return, volatility, Sharpe, drawdown) are displayed. Finlatics internship outputs (sector research, stock picks) can feed into trade recommendations or backtests.
Insights & Reporting: The app delivers AI/ML insights (e.g. “You spent ₹12,340 on Food last month, 18% higher than before”). It also includes warnings (low-balance alerts, budget breaches). The Finlatics research (industry growth rates, company analysis) can be distilled into tips or sector watchlists.
Multi-Device & Scalability: The platform is full-stack (Next.js frontend, Node/Express backend, Redis, and Postgres/Mongo). It must handle many concurrent users and sessions with horizontal scaling (discussed below).
System Architecture & Data Flows
FinSathi will adopt an event-driven microservices architecture. Core components:

Frontend clients: React/Next.js web and mobile apps. They connect over HTTPS for REST APIs and over WebSockets (Socket.IO) for real-time streams.
Backend API Server (Node.js/Express): Handles authentication (JWT), REST endpoints (CRUD for accounts, transactions, orders), and hosts a Socket.IO server for pub/sub messaging.
WebSocket Layer (Socket.IO): Manages persistent client connections for real-time push updates. Uses a Redis adapter for cross-instance pub/sub (see WebSocket section).
Redis: Serves as a lightweight message broker for WebSocket events (pub/sub channels) and may also be used for cache/session store and connection tracking.
Database: PostgreSQL (or another ACID DB) stores user data, transactions, account balances, and portfolio holdings. We use relational DB for transactional integrity (withdrawals, transfers).
OCR Service: A separate service (Node.js or Python) that receives images, calls Tesseract or Google Vision, and returns parsed data. Could be a microservice container.
Trading/Backtest Service (Python): Fetches market data (APIs or websockets), runs strategies/backtests (AlgoCash code), and processes simulated trades. It exposes REST/WS endpoints or publishes results to the main app.
External APIs: Finance data sources (Yahoo/AlphaVantage/IEX/Tiingo, etc.). Possibly a WebSocket market feed for live quotes.
A high-level event flow: when the user requests a withdrawal in the ATM UI, the client sends a REST call to the Node API. The API checks the DB (balance/PIN), updates records, and publishes a “transaction” event to Redis. The Socket.IO servers (all instances) subscribe to this channel and emit a transaction_update to all relevant clients (other logged-in devices). The clients receive the event and refresh balances/charts in real time.

Similarly, when OCR processing completes, the OCR service (or backend) pushes the new transaction into the DB and publishes an event, triggering UI updates. Trading orders follow a similar path: a buy request -> API -> executes on TradingService -> updates portfolio in DB -> publishes update -> clients see new holdings. This event-driven architecture ensures low-latency updates. (Event-driven designs “detect, process, manage, and react to real-time events as they happen,” a pattern widely adopted for online banking and analytics.)

Frontend
DB
Redis
API Server
Frontend (JS)
User App
Frontend
DB
Redis
API Server
Frontend (JS)
User App
Withdraw request (amount)
POST /withdraw (amount, PIN)
Verify PIN & balance, update balance
PUBLISH channel: "transactions" (new transaction JSON)
200 OK (withdraw confirmed, new balance)
Redis broadcasts transaction event on all subscribers
SOCKET EMIT "transaction_update" (new tx data)
Receive update, refresh balance/tx list


Show code
WebSockets and Scalability
All real-time updates use Socket.IO (WebSockets). A single Node server can handle direct broadcasts, but we must plan for horizontal scaling. As one analysis notes, “when you scale beyond a single server, you need a message broker – a client on Server A won’t get messages from Server B without coordination”. Our solution: run multiple Node/WebSocket servers behind a load balancer (with sticky sessions). We attach the official Socket.IO Redis adapter so that io.emit(...) from any server publishes via Redis pub/sub, and all other servers subscribed to that channel forward it to their connected clients.

The Ably diagram below illustrates this architecture: a load balancer distributes connections to Socket.IO server instances, each linked to Redis. Any message published enters Redis and is received by all servers. This ensures low-latency broadcasts across nodes without duplicating connections. Redis pub/sub is ideal here: it “hits the sweet spot – fast, simple to set up, and handles the ephemeral nature of WebSocket messages”. (Unlike durable message queues, Redis pub/sub is in-memory and not persisted, but that’s acceptable for real-time alerts.)

Figure: Scaled WebSocket architecture – a load balancer with sticky sessions fronts multiple Socket.IO servers; servers use Redis pub/sub to relay messages among themselves so that any event (e.g. a transaction) can be broadcast to all connected clients.

Example Node.js server setup:

js
Copy
// app.js (Node/Express + Socket.IO + Redis)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const redisAdapter = require('socket.io-redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Attach Redis adapter (given REDIS_URL environment)
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on('connection', socket => {
  console.log(`WS connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`WS disconnected: ${socket.id}`));
});

// Example: on API route, broadcast via Socket.IO
app.post('/api/transaction', async (req, res) => {
  // ... validate user/PIN, create transaction in DB, update balance ...
  const newTx = { /* userId, amount, type, timestamp ... */ };
  await db.insertTransaction(newTx);

  // Publish over Socket.IO (goes to all Redis-synced servers)
  io.emit('transaction_update', newTx);
  res.json({ success: true });
});

server.listen(3000);
Message schema: All WebSocket messages should use small JSON objects with a type field, e.g. { type: "transaction_update", data: { id, amount, timestamp } } or { type: "balance_alert", data: {...} }. Using a consistent schema simplifies client handling. Clients should implement auto-reconnection logic to handle intermittent disconnects (Socket.IO auto-reconnect). Periodic heartbeats can keep sessions alive.

OCR Pipeline (Receipt Scanning)
The OCR feature lets users snap or upload receipts to auto-log expenses. Two main OCR engines are common:

Tesseract OCR: Open-source, runs locally, no service cost (only CPU). It’s fast but may falter on small or noisy text. It has multi-language support and can be fine-tuned, but results can vary. (One study found Google Vision beat Tesseract on tiny invoice text.)
Google Cloud Vision OCR: Cloud service with high accuracy, especially on structured receipts. Google’s TEXT_DETECTION is recommended for receipts (it avoids splitting on punctuation). Costs are ~$1.50 per 1000 units for the first 5M images/month, then $0.60/1000. It requires network calls but returns JSON including text, bounding boxes, and confidence scores.
We should weigh cost vs. accuracy: for a production demo, Google Vision gives robust results out-of-the-box, but if budget is tight, Tesseract is free (but may need post-processing). For FinSathi we might offer both: default to Tesseract and, on low-confidence or premium mode, call Google.

Pipeline: When a receipt image is uploaded, do optional pre-processing (deskew, denoise). Run OCR to get raw text. Then parse the text to extract fields: store name, date, line items (qty, price), total, taxes. Regular expressions or ML entity extraction can identify amounts and categories. For example, use NLP or rule-based parsing for invoices (vendor names, item lists). Unrecognized or low-confidence fields prompt user review.

Error handling: Always allow the user to correct OCR errors manually. Implement confidence checks: e.g. if the total is missing or nonsensical, highlight it. Log OCR errors for improvement.

Example (Node.js with Tesseract):

js
Copy
const Tesseract = require('tesseract.js');
async function parseReceipt(imagePath) {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
  // rudimentary parsing
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  let total = null, date = null;
  lines.forEach(line => {
    if (line.match(/Total\s+([0-9]+\.[0-9]{2})/)) {
      total = parseFloat(RegExp.$1);
    }
    if (line.match(/(\d{2}\/\d{2}\/\d{4})/)) {
      date = RegExp.$1;
    }
  });
  // return parsed output (simplified)
  return { raw: text, date, total, items: lines };
}
Table: OCR Options Comparison

Feature	Tesseract	Google Vision OCR
Cost	Free (open-source)	Paid (≈$1.50/1000 images, then $0.60)
Accuracy	Good on clear text; struggles with small/noisy text	Very high, especially on complex receipts; handles small text better
Setup	Local binary or library (Node/Python wrappers)	Cloud API (REST, easy libraries)
Latency	Fast (local compute)	Slower (network call)
Customization	Open to training/customization	Proprietary, no model tuning
Language Support	Many (via trained data)	Many (auto-detect)

Based on [16], Google Vision yields cleaner results on invoices, whereas Tesseract is fast/cheap but error-prone on tiny print. For FinSathi, one could default to Tesseract and failover to Google when needed.

Trading Data & Simulation Pipeline
To leverage trading research, FinSathi will include a data pipeline for market data and backtesting. Key parts:

Market Data Sources: Possible APIs:

Yahoo Finance (via yfinance in Python) – free, easy but unofficial and rate-limited.
Alpha Vantage – free tier (5 calls/min), JSON; good for equity/forex (5-year history).
IEX Cloud – free limited tier for US stocks.
Tiingo/Polygon/CoinGecko – others (some paid after free tier).
CCXT library – unified crypto exchange API (node/python).
WebSocket Feeds – for real-time quotes (e.g., IEX wss, Binance, or even socket.io from a feed service).
We should compare: Yahoo/Alpha are free but slower (REST, ~1-min resolution). Paid services have lower latency and more data. For portfolio analytics (daily returns), REST is fine. For any live price updates in the UI, we can use free websockets from exchanges or a library like [14]. For BNY level, one could mention Bloomberg/Refinitiv (but not practical for intern demo).

Backtesting / Simulation Engine: We can build a Python service (or even do in Node) that:

Fetches historical price series (pandas DataFrames).
Implements trading strategies (e.g. equal-weight S&P rebalance, moving average, etc.).
Maintains a simulated order book: when user places a buy, assume execution at next available price (or current bid/ask).
Tracks cash balance, positions, realized/unrealized P&L.
Applies commissions/slippage (optional).
Records each trade in the DB (so FinSathi can display it as transactions).
Existing libraries like Backtesting.py or backtrader can simplify strategy testing. For example, using [19], “Backtesting.py is an open-source library” for testing strategies. We could integrate a simple strategy class with AlgoCash logic.

Order Matching: In simulation, an order can be simply filled at the market price. For a realistic mini-engine, maintain a queue: a buy order reduces cash, increases shares; a sell does the reverse.

Example (Python): Basic P&L logic:

python
Copy
import pandas as pd
import yfinance as yf

prices = yf.download("AAPL MSFT", start="2020-01-01", end="2020-12-31")["Close"]
cash = 100000.0
holdings = {"AAPL": 0, "MSFT": 0}
tx_log = []
# Example: equal-weight rebalancing each quarter
rebalance_dates = ["2020-03-31","2020-06-30","2020-09-30","2020-12-31"]
for date in rebalance_dates:
    prices_on_date = prices.loc[date]
    total_value = cash + sum(holdings[t]*prices_on_date[t] for t in holdings)
    # target each = total/2
    target_each = total_value / 2
    for stock in holdings:
        current_val = holdings[stock]*prices_on_date[stock]
        diff = target_each - current_val
        qty = int(diff / prices_on_date[stock])
        # execute trade
        if qty > 0:  # buy
            cost = qty * prices_on_date[stock]
            cash -= cost
            holdings[stock] += qty
            tx_log.append((date, stock, qty, prices_on_date[stock]))
        elif qty < 0:  # sell
            proceeds = -qty * prices_on_date[stock]
            cash += proceeds
            holdings[stock] += qty
            tx_log.append((date, stock, qty, prices_on_date[stock]))
# Final portfolio value
final_value = cash + sum(holdings[t]*prices.loc["2020-12-31"][t] for t in holdings)
Backtesting & Metrics: After simulation, compute metrics (total return, volatility, max drawdown, Sharpe). For example, compare the equal-weight portfolio’s returns vs. the cap-weighted benchmark (e.g. SPY). Historical data suggests equal-weight often outperforms: “over two decades, the equal-weight version delivered higher total returns than the S&P 500”. We can cite this as rationale for including it.

Integration: The simulation results are stored as transactions (so appear in the mini-statement) and as portfolio positions. FinSathi’s dashboard can then display these like normal accounts. It can also plot equity curves and factor statistics. For instance, show a chart comparing the user’s portfolio vs. the equal-weight index vs. the S&P 500 (using the wealth index from AlgoCash).

Portfolio Analytics (AlgoCash)
Building on the equal-weight S&P 500 strategy from AlgoCash: We implement a Python pipeline to fetch all S&P 500 constituents (e.g. via an API or static list), allocate capital equally, and rebalance quarterly. The code collects historical price data, then recalculates weights:

python
Copy
# Pseudocode for equal-weight S&P portfolio
symbols = get_sp500_constituents()  # ~500 tickers
weights = np.ones(len(symbols)) / len(symbols)
# Fetch historical prices (e.g. monthly)
prices = fetch_price_data(symbols, start, end)  # DataFrame (dates × symbols)
# Compute daily returns
returns = prices.pct_change().dropna()
# Portfolio returns = dot(weights, returns)
port_returns = returns.dot(weights)
# Portfolio cumulative value
port_value = (1 + port_returns).cumprod()
We also evaluate a cap-weight benchmark (just use an index price series). Metrics to report: annualized return, annualized volatility, Sharpe ratio. We can mention the finance intuition: equal weighting naturally tilts to mid/small caps and has an anti-momentum bias, which historically boosted returns. A sample table for a period might look like:

Metric	Equal-Weight S&P 500	Cap-Weight S&P 500
Total Return	+12.3%	+8.7%
Volatility	15.1%	12.2%
Sharpe Ratio	0.82	0.63
Max Drawdown	-20.5%	-25.3%

(Example numbers; real values require actual data)

Integration: The portfolio holdings table and metrics are exposed via the FinSathi UI. Users can see how their algorithmic portfolio is doing versus benchmarks. They could even “invest” virtual funds into the equal-weight strategy through the app, which would generate simulated transactions. This demonstrates data analysis (Pandas/NumPy) combined with application logic.

Integration of Finlatics & AlgoCash Outputs
Incorporating Equity Research: Finlatics internship involved sector research and company analysis. We can surface this by adding a “Research Insights” panel: for example, display sector performance charts or highlight a top pick from Finlatics (e.g. “You predicted Company X would outperform; here’s how it did”). If the user generated any trade signals during the internship, FinSathi could allow importing those trades (via CSV or API) into the simulator and calculating the realized accuracy/P&L (they mentioned ~70–80% accuracy in predictions).
Feeding Trading Results: Simulated trades made in Finlatics can be exported and imported into FinSathi as a portfolio. The app would then treat them as transactions, updating balances and displaying performance. This shows direct continuity between the internship and the app.
Combined Analytics: FinSathi’s analytics dashboard can blend personal finance and investment insights. For instance, “Your energy sector spending has been high, while your equal-weight portfolio has a heavy energy tilt – see if your investment aligns with your budget.” Or “Your internship analysis predicted high growth in healthcare; here’s an alert for healthcare stocks in your portfolio.”
The goal is to merge domain expertise: The technical achievements (WebSockets, OCR, etc.) are highlighted, but also the financial side (portfolio diversification, research analysis).
ATM Terminal UI/UX
The ATM interface mimics real kiosk flows. Here is a typical withdrawal sequence:

Figure: Sequence diagram for an ATM withdrawal. The user inserts card and enters PIN, the system checks validity (ATM ↔ Bank DB), then processes a withdrawal request or rejects it. Cash and card are returned accordingly.

Key UI/UX flows:

Login (Card + PIN): The “card” might be a selected account or a user-specific ID. The terminal prompts for PIN; the frontend masks input (●●●●). The server verifies the PIN (compare hashed values) and checks account status. After a set number of failed attempts, the system locks the account or blocks further tries (PCI PIN Security guidance).
Main Menu: Options: Withdraw, Deposit, Transfer, Mini-Statement, Change PIN, Logout.
Withdraw:
User enters amount (or selects buttons e.g. ₹2000, ₹5000).
The backend confirms sufficient funds. If insufficient, it follows the “Transaction rejected” path in the diagram: shows an error and returns card.
If approved, the system simulates cash dispense. It might ask for denomination preference (or auto-calc: e.g. 1×2000 + 1×500 for ₹2500). Balance is updated in DB.
A digital receipt is generated: can be downloaded or emailed (content: txn ID, time, new balance).
Deposit:
User enters deposit amount (assuming cash deposit). Balance increases.
Transfer:
User enters target (own account or another user’s account number/email) and amount. Backend debits sender, credits receiver. Transactions logged.
Mini-Statement:
The terminal queries the last 5–10 transactions from the DB and displays them.
Security/Encryption:
All PIN entry and sensitive data transmissions are over TLS. The PIN itself should never be logged or sent in clear.
The PIN entry device could be simulated on-screen, but in real ATMs it’s a tamper-resistant pad. We note PCI PTS-POI standards require encryption from the pad to the processing backend. In our app, we ensure no plaintext PIN storage and use strong hashing (e.g. bcrypt).
Session Timeout: If idle for too long, auto-logout.
Logout: Eject card (end session).
Overall, the ATM features demonstrate backend transaction logic, secure auth, and a polished UI. They’re resume-worthy features: “Developed a real-time, WebSocket-backed ATM terminal simulator with PIN authentication, withdrawal/transfer workflows, and secure transaction handling (including cash denomination logic and PCI-compliant PIN encryption).”

Security (Auth, PIN, Encryption, Compliance)
Security is paramount. Key points:

Authentication: Use HTTPS/TLS for all API and WebSocket traffic. Implement strong password storage (bcrypt hashing). Issue JWTs for session auth. For the ATM, require a user PIN which is also stored hashed (never plaintext).
PIN Handling: Follow PCI PIN Security guidelines. Even though this is a demo, emulate best practices: encrypt the PIN entry and never expose it. After authentication, generate a short-lived session token for ATM operations.
Data Encryption: Encrypt sensitive data at rest (e.g. PostgreSQL Transparent Data Encryption or disk encryption). Credit card or bank account numbers (if stored) should be tokenized. For receipts and images, use secure object storage.
PCI-DSS Compliance: Although FinSathi is a prototype, we design as if compliance is required. PCI DSS mandates protecting cardholder data and PINs. We avoid storing CVV/CNP data and use TLS. We build an audit log for transactions (who did what and when) in case of forensic needs.
Network Security: Use firewalls or VPC security groups. Load balancer with HTTPS, WebSockets upgraded over wss. Reject insecure connections.
Input Validation & Error Handling: Sanitize all inputs (especially from OCR parsing or file uploads). Implement rate-limits (to prevent brute PIN attempts).
Third-Party APIs: Secure API keys via environment variables/secret vaults. If using Google Vision, protect its credentials.
Monitoring & Auditing: Plan to integrate logging (e.g. Morgan for HTTP logs, Winston for app logs) and use monitoring (Prometheus/Grafana) for suspicious activity (e.g. many failed PIN attempts).
Overall, “we design FinSathi to meet financial industry standards: TLS everywhere, hashed PIN/password, and adherence to PCI Data Security Standard for any simulated card/PIN processing.”

Deployment & DevOps
Containerization: Each service (API, OCR, Trading) will run in Docker containers. We’ll have images for Node API, Python analysis, Redis, and the database (Postgres). A docker-compose.yml can orchestrate this locally.
CI/CD Pipeline: Use GitHub Actions (or similar) for automated testing and deployment. On each push: run unit tests (Node Jest, PyTest), then build Docker images and push to a registry. Deploy to a cloud service (e.g. AWS ECS/EKS or Heroku).
Infrastructure: We can target a cloud provider (e.g. AWS). Use Terraform or CloudFormation to define:
A VPC with subnets.
An Elastic Load Balancer (ALB) for the web/WS traffic.
Auto-scaling group of Node.js servers (behind sticky session LB) and Python services.
RDS for Postgres, Elasticache for Redis.
Configuration Management: Use environment variables or a secrets manager (AWS Parameter Store) for configs (DB URLs, API keys).
Logging & Monitoring: Aggregate logs (CloudWatch/ELK). Set up health checks (HTTP 200 on /health).
Testing Environments: Maintain staging vs production deployments for safe testing.
Data Models & API Contracts
Example schemas (PostgreSQL tables or Mongo docs):

User: { id, name, email, password_hash, pin_hash }
Account: { id, user_id, type (checking/savings), balance }
Transaction: { id, account_id, type (withdraw/deposit/transfer), amount, timestamp, desc }
Transfer: { id, from_account_id, to_account_id, amount, timestamp }
ReceiptOCR: { id, user_id, image_url, vendor, total_amount, date, parsed_items (JSON) }
PortfolioHolding: { id, user_id, symbol, shares, avg_price }
TradeOrder: { id, user_id, symbol, side (buy/sell), qty, price, status, timestamp }
PriceQuote: { symbol, timestamp, price } (maybe cached or ephemeral)
REST API Endpoints (sample):

POST /api/auth/login – body { email, password } → returns JWT.
POST /api/auth/atm-login – body { cardNumber, pin } → JWT for ATM session.
GET /api/accounts – lists user’s accounts.
GET /api/accounts/:id/balance – returns current balance.
POST /api/transactions – { account_id, type, amount, ... } → creates a transaction.
GET /api/transactions?account_id=xx&limit=5 – last 5 transactions (mini-statement).
POST /api/receipt/upload – form-data image → returns { receipt_id } and triggers OCR.
GET /api/receipt/:id – returns parsed data or status of OCR.
POST /api/trades/buy – { symbol, qty } → executes a buy order on the simulated portfolio.
GET /api/portfolio – shows current holdings and metrics.
WebSocket Events: (Socket.IO) e.g. transaction_update, balance_update, quote_update, order_fill, etc.
Example JSON contracts:

json
Copy
// Transaction update (WebSocket message)
{
  "type": "transaction_update",
  "data": {
    "id": 123,
    "account_id": 5,
    "type": "withdrawal",
    "amount": 200.00,
    "timestamp": "2026-08-03T12:34:56Z"
  }
}
json
Copy
// REST response for portfolio metrics
{
  "holdings": [
    {"symbol": "AAPL", "shares": 50, "marketValue": 7500.00},
    {"symbol": "MSFT", "shares": 30, "marketValue": 6000.00}
  ],
  "cash": 10000.00,
  "totalValue": 23500.00,
  "performance": {
    "annualReturn": 0.12,
    "volatility": 0.18,
    "sharpe": 0.67
  }
}
Data validation (e.g. using JSON Schema) and strict versioning of APIs will be part of implementation.

WebSocket Design & Pub/Sub (Summary)
Use Socket.IO as the client-server WebSocket library (Node/JS support, easy event API). As shown in [10], attaching io.adapter(redisAdapter(...)) automatically wires Socket.IO with Redis pub/sub.
Redis channels could be named by event type (e.g. account:{id}:events) so that only relevant subscribers get a message. Or a single transactions channel for broad broadcasts. We must consider multitenancy: isolate user data (e.g. include user/account ID in the channel).
Reconnection: Clients should enable automatic reconnect. We can also implement “last event ID” logic to catch up missed events upon reconnection if needed.
Message Schema: We standardize on {type, data} envelopes. Types include: transaction_update, balance_update, budget_alert, ocr_complete, order_executed, price_update, etc.
Performance: For high throughput, we might consider Redis Cluster for pub/sub if single Redis is a bottleneck. Socket.IO’s Redis adapter scales to many servers, but watch out for the ~10k WebSocket connections per Node instance limit.
Sticky Sessions: The load balancer (NGINX or AWS ALB) must use sticky (IP/hash) to ensure the WebSocket handshake and subsequent frames go to the same server.
Testing Plan
Unit Tests:
Backend Node.js: Use Jest or Mocha to test API endpoints (authentication, transaction logic, OCR parsing stubs). Mock DB and services.
Python Trading: PyTest for strategy logic, P&L calculations.
Utility functions (e.g. currency formatting, security routines) should be covered.
Integration Tests:
API Endpoints: Use Supertest (Node) or Postman/Newman to test full request flows (e.g. login -> withdraw -> check balance).
WebSockets: Use a test client (Socket.IO client in test) to ensure messages are broadcast correctly when multiple “servers” are instantiated (can simulate by spinning up multiple instances with Redis).
OCR Testing: Prepare a suite of sample receipt images (clear prints, skewed, low contrast). Run OCR on them and check if expected fields (e.g. “Total”) are correctly extracted. Track accuracy rates; possibly use automated vision tests.
Trading Simulation Tests:
Strategy Validation: For known simple strategies, verify known outputs. Example: a buy-and-hold should yield a specific return on known price data.
Edge Cases: Test insufficient funds (no short selling), extreme market moves.
Integration: Simulate end-to-end: call /api/trades/buy, verify that the transaction appears, balance updated, and order_executed event is emitted.
Load Testing: Simulate many concurrent WebSocket clients (Artillery.io or JMeter) to test the Redis pub/sub performance. Also simulate burst of OCR jobs or trading backtests.
Security Testing: Attempt SQL injection or XSS on inputs (though UI is React). Test that PINs are not exposed. Use linting and code scanners (npm audit, bandit for Python).
CI Integration: All tests run in CI pipeline. Code coverage goal ≥80%. Tests of WebSocket messages might be manual or semi-automated.
Library & API Comparisons
Component	Option	Cost	Latency (Est.)	Ease of Use	Language Support
WebSocket Lib	Socket.IO	Free (OSS)	~<10ms (local)	High (widely used)	Node, Python (client), many
ws (Node native)	Free	Similar	Low-level (manual parsing)	Node only
Server-Sent Events (SSE)	Free	~<20ms (one-way)	Simpler (one-way)	Any (HTTP)
Pub/Sub Broker	Redis Pub/Sub	Open-source	~<1ms	Simple setup	Many clients (Node/Py/etc)
RabbitMQ	OSS	~1-5ms	More config	Many
Kafka	OSS	~1-5ms	Complex (overkill)	Many
OCR Engine	Tesseract	Free	Fast (ms)	Moderate (needs CLI)	C/C++, Python, Node wrappers
Google Cloud Vision OCR	Paid ($1.50/1k)	~100ms+ (network)	Very easy (HTTP API)	Any (HTTP)
AWS Textract	Paid ($1-5 per page)	200ms+	Easy (SDK)	Any
Market Data API	Yahoo Finance (yfinance)	Free	1-2s (HTTP)	Very easy	Python library
Alpha Vantage	Free tier (5/m)	200ms-1s	Easy (JSON)	Any
IEX Cloud	Paid tier	~50-200ms	Good (JSON)	Any
CCXT (Crypto)	Free	50-500ms	Easy for crypto	JS/Python
Backtesting Lib	backtesting.py	Free	N/A (offline)	Easy (pip install)	Python only
backtrader	Free	N/A	Feature-rich	Python
DB	PostgreSQL	OSS	Fast (ACID)	Moderate	Many (ORMs)
MongoDB	OSS	Fast (ACID if needed)	Easy schema-flex	Many

These options help trade off speed, cost, and integration. For example, Socket.IO is chosen over raw ws for simplicity of events. Redis fits pub/sub in-memory patterns (with <1ms latency). For OCR, Tesseract is free but Google OCR has higher accuracy. We can support both.

Testing Plan Summary
We will implement:

Unit Tests: For backend functions (DB logic, OCR parsing, trading algorithms). Use Jest (Node) and pytest (Python).
Integration Tests: End-to-end API tests (login, ATM flows, transaction events). Use a tool like Supertest/Postman.
WebSocket Tests: Automated simulation of multiple clients to verify real-time updates via Redis.
Browser/E2E Tests: Use Cypress or Selenium for critical user flows (expenses entry, receipt upload, ATM withdraw).
Performance Tests: Load test WebSocket throughput (10k+ connections) and OCR job queue.
Monitoring: Set up dashboards to measure error rates and latencies in production (log collection, APM).
All code will be covered by tests in CI before merging, with coverage reports. We will have a separate testing staging environment for QA.

Sources: Our design follows current best practices and official documentation. We leverage Socket.IO’s Redis adapter for WebSockets, Redis pub/sub for scaling, and recognize the tradeoffs of polling vs streaming data. OCR engine choices cite industry comparisons. The equal-weight S&P500 rationale is drawn from S&P Dow Jones Indices research. Security and ATM flows align with PCI standards. This comprehensive design ensures FinSathi is robust, scalable, and showcases both fintech and engineering skills appropriate for a BNY Mellon internship.