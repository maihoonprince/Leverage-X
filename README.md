# LeverageX - Full Stack Broker Platform

**A comprehensive Full Stack Trading Platform built using the MERN stack (MongoDB, Express, React, and Node.js), allowing users to engage in stock trading, manage investments, and providing admins with advanced control over User Details and transactions.**

## Project Overview
The platform consists of two main components:

1. **User Side**
2. **Admin Dashboard**

### 1. User Side

#### Authentication and Account Management
- **User Registration and Login**: Users can register by providing details like name, email, password, Aadhaar, PAN, and mobile number. Secure login sessions are managed using JWT.
- **Persistent User Sessions**: Data such as stock purchases, balances, and PnL information are stored in the backend, ensuring persistence across sessions and devices.

#### Home Page
- The homepage provides information about the platform, its features, and how users can participate in stock trading.

#### Plans Page
- **Three Plans**: Users can choose from three trading plans—Rapid, Evolution, and Prime—each with different initial balances (₹1000, ₹5000, and ₹10,000).
- **Plan Purchase Flow**: Users click 'Buy' to purchase a plan, triggering a popup with the plan details. Upon confirmation, users are redirected to their respective WatchList pages:
  - **Rapid Plan** → WatchList 1
  - **Evolution & Prime Plans** → WatchList 2
- Purchase details are stored in the backend and linked to the user's account.

#### WatchList Pages (1 & 2)
- **Stocks Display**: Each WatchList page shows four stocks with live price fluctuations. Users can view performance graphs or buy stocks based on their balance.
- **Stock Purchase Flow**: A popup displays stock details, user balance, max quantity, and options to buy or cancel. After purchasing, data is saved in the backend, and users are redirected to the PnL page.

#### PnL (Profit & Loss) Page
- **Invested Stocks Overview**: Displays purchased stocks with details such as name, balance, buy price, and live price.
- **Selling Stocks**: Users can sell stocks, updating their balance accordingly.
- **Auto-sell Mechanism**: Automatically sells stocks if their value drops below 10% of the balance.
- **Withdraw Funds**: Users can withdraw their balance by submitting bank details/UPI ID, which are emailed to the admin.

### 2. Admin Dashboard

#### User Management
- **User Overview**: Admins can view all users' details, including their plans and balances.

#### Notifications
- Admins receive email alerts for actions like plan purchases, stock transactions, and withdrawals.


https://github.com/user-attachments/assets/a09ad231-007e-448e-a875-9ef7e06a6a99


## Technical Features

### Frontend
- **React.js**: Provides a dynamic, responsive UI.
- **SCSS**: For modular and reusable styling.
- **Real-time Data**: Uses `setInterval` and backend APIs to update stock prices in real time.

### Backend
- **Node.js and Express.js**: RESTful APIs handle platform functionality.
- **MongoDB Atlas**: Stores user data, stock information, and transaction history.
- **JWT Authentication**: Ensures secure login sessions.
- **CORS Configuration**: Supports requests from multiple domains (development/production).

### Admin Control
- **Real-time Updates**: The platform supports live updates for stock prices and user balances.

### Security & Data Persistence
- **Secure Authentication**: JWT-based login and registration.
- **Data Persistence**: User data like stock holdings and balances are stored in the backend, ensuring consistency across sessions and devices.

## Key Features
- **Interactive UI**: React with CSS ensures a dynamic and responsive design.
- **Real-time Stock Management**: Users can view and interact with live stock price data.
- **Admin Dashboard**: Full control over user Details, and notifications.
- **Data Persistence**: Backend storage maintains consistency across user sessions and devices.
- **Auto-sell Functionality**: Protects users from significant losses by auto-selling stocks below a threshold.
- **Email Notifications**: Alerts admins of significant user actions like withdrawals.

## Future Enhancements
- Adding advanced trading options like options and futures.
- Implementing an AI-based stock recommendation system.
- Enhancing the user dashboard with more analytics and visualizations.

## License
This project is open-source and available under the MIT License.

## Acknowledgments
A big thanks to the team at LeverageX for their support and guidance. Excited to continue building and innovating!
