const nodemailer = require('nodemailer');
(async ()=>{
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('testAccount created');
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    const info = await transporter.sendMail({
      from: 'no-reply@vet.local',
      to: process.env.TEST_EMAIL || 'josesanabria036925@gmail.com',
      subject: 'Prueba Ethereal desde script',
      text: 'Este es un email de prueba (Ethereal)'
    });
    console.log('MessageId:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
