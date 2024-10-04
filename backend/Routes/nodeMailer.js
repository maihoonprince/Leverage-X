const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any service like Outlook, Yahoo, etc.
    auth: {
      user: 'piper.pfeffer12@ethereal.email',
      pass: 'YmmRWChzTUKsEn5SXX', // Use an app-specific password for security
    },
  });

  app.post('/api/users/withdraw', async (req, res) => {
    const { userId, accountHolderName, accountNo, ifscCode, panCardNo, upiId, withdrawalId } = req.body;
    
    try {
      // Fetch the user's balance and handle any other withdrawal logic here
      // For demonstration purposes, we assume withdrawalBalance is already calculated
  
      const withdrawalBalance = 5000; // Replace with actual balance calculation logic
  
      // Compose the email
      const mailOptions = {
        from: 'your-email@gmail.com', // Sender's email
        to: 'admin-email@gmail.com',  // Admin's email
        subject: 'User Withdrawal Request',
        html: `
          <h3>User Withdrawal Request</h3>
          <p>User ID: ${userId}</p>
          <p>Account Holder Name: ${accountHolderName}</p>
          <p>Account No: ${accountNo}</p>
          <p>IFSC Code: ${ifscCode}</p>
          <p>PAN Card No: ${panCardNo}</p>
          <p>UPI ID: ${upiId}</p>
          <p>Withdrawal ID: ${withdrawalId}</p>
          <p>Withdrawal Balance: ₹${withdrawalBalance}</p>
        `,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Respond with a success message
      res.status(200).json({
        message: 'Withdrawal processed successfully, email sent to admin.',
        withdrawalBalance,
      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      res.status(500).json({ message: 'Error processing withdrawal' });
    }
  });
  