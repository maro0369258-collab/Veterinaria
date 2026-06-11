const nodemailer = require('nodemailer');
const twilio = require('twilio');
const pool = require('../db/pool');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@vet.local';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || null;

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+1415...'

let transporter;
let _usingTestAccount = false;
async function ensureTransporter() {
  if (transporter) return transporter;
  if (SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    return transporter;
  }

  // No SMTP configured - create a test account (Ethereal) for development
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    _usingTestAccount = true;
    console.log('Created Ethereal test account for email previews');
    return transporter;
  } catch (e) {
    console.error('Failed to create test SMTP account', e.message || e);
    return null;
  }
}

let twilioClient;
if (TWILIO_SID && TWILIO_TOKEN) twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);

async function sendEmail(to, subject, text, html) {
  const tr = await ensureTransporter();
  if (!tr) {
    console.log('SMTP not configured and test account creation failed, skipping email to', to);
    return;
  }
  try {
    const info = await tr.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent to', to, info.messageId);
    if (_usingTestAccount) {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log('Ethereal preview URL:', preview);
    }
  } catch (e) {
    console.error('Error sending email to', to, e.message || e);
  }
}

async function sendWhatsApp(toPhone, body) {
  if (!toPhone) {
    console.log('No phone for WhatsApp message');
    return;
  }
  const country = process.env.DEFAULT_COUNTRY_CODE || '';
  const toNormalized = toPhone.startsWith('+') ? toPhone : (country ? `${country}${toPhone}` : toPhone);

  if (!twilioClient || !TWILIO_WHATSAPP_FROM) {
    // Simulate/send-preview when Twilio not configured
    const simulatedSid = `SIMULATED-SID-${Date.now()}`;
    console.log(`Twilio not configured — simulated WhatsApp to ${toNormalized}:`, body);
    return { sid: simulatedSid };
  }

  try {
    const msg = await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${toNormalized}`,
      body,
    });
    console.log('WhatsApp sent to', toNormalized, msg.sid);
    return msg;
  } catch (e) {
    console.error('Error sending WhatsApp to', toNormalized, e.message || e);
  }
}

async function notifyPaymentUpdate(pedidoId, status, meta = {}) {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.total, p.estado, u.id AS usuario_id, u.nombre, u.correo, u.telefono
       FROM pedidos p JOIN usuarios u ON p.cliente_id = u.id WHERE p.id = ?`,
      [pedidoId]
    );
    const pedido = rows[0];
    if (!pedido) return;

    const subject = `Estado de pago pedido #${pedidoId}: ${status}`;
    const text = `Hola ${pedido.nombre},\n\nEl estado de su pedido #${pedidoId} ha cambiado a: ${status}.\nTotal: ${pedido.total}\n\nGracias.`;
    const html = `<p>Hola <strong>${pedido.nombre}</strong>,</p><p>El estado de su pedido <strong>#${pedidoId}</strong> ha cambiado a: <strong>${status}</strong>.</p><p>Total: <strong>${pedido.total}</strong></p>`;

    // send email to customer
    if (pedido.correo) await sendEmail(pedido.correo, subject, text, html);

    // notify admin if configured
      if (ADMIN_EMAIL) await sendEmail(ADMIN_EMAIL, `Notificación: ${subject}`, `Pedido ${pedidoId} -> ${status}`);

      // send WhatsApp to customer phone
      if (pedido.telefono) {
        const waBody = `Pedido #${pedidoId} - estado: ${status}. Total: ${pedido.total}`;
        await sendWhatsApp(pedido.telefono, waBody);
      }

      // also notify admin phone if configured
      const ADMIN_PHONE = process.env.ADMIN_PHONE || null;
      if (ADMIN_PHONE) {
        const waBodyAdmin = `Notificación: Pedido #${pedidoId} -> ${status} (cliente: ${pedido.nombre})`;
        await sendWhatsApp(ADMIN_PHONE, waBodyAdmin);
      }
  } catch (e) {
    console.error('notifyPaymentUpdate error', e.message || e);
  }
}

module.exports = { notifyPaymentUpdate, sendEmail, sendWhatsApp };
