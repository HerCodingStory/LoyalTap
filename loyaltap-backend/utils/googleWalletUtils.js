const { google } = require('googleapis');
const credentials = require('../GoogleWallet/credentials/google-service-account.json');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

const createLoyaltyClass = async ({ classId, restaurantName, programName, logoUrl }) => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  const client = await auth.getClient();
  const wallet = google.walletobjects({ version: 'v1', auth: client });

  try {
    const res = await wallet.loyaltyclass.insert({
      requestBody: {
        id: classId,
        issuerName: restaurantName,
        programName: programName,
        reviewStatus: 'underReview',
        rewardsTierLabel: 'Reward Level',
        rewardsTier: 'Gold',
        programLogo: {
          sourceUri: {
            uri: logoUrl,
            description: restaurantName,
          },
        },
        messages: [{
          header: 'Welcome!',
          body: 'Thanks for joining our rewards program 🎉',
        }],
      },
    });

    console.log('Loyalty class created:', res.data);
    return res.data;
  } catch (err) {
    if (err.errors?.[0]?.reason === 'duplicate') {
      console.log('Loyalty class already exists.');
      return { message: 'Class already exists' };
    } else {
      console.error('Error creating loyalty class:', err);
      throw err;
    }
  }
};

const createGooglePass = (customerEmail, points, goal, classId) => {
  if (typeof customerEmail !== 'string') {
    throw new Error('customerEmail must be a string');
  }
  const customerId = customerEmail.replace(/[@.]/g, '_'); // safe ID
  const objectId = `${process.env.GOOGLE_WALLET_ISSUER_ID}.${customerId}`;

  const payload = {
    iss: credentials.client_email,
    aud: 'google',
    typ: 'savetowallet',
    origins: ['https://astrawebmiami.com'],
    payload: {
      loyaltyObjects: [
        {
          id: objectId,
          classId: classId,
          state: 'active',
          accountId: customerEmail,
          accountName: customerEmail,
          barcode: {
            type: 'QR_CODE',
            value: objectId,
          },
          loyaltyPoints: {
            label: 'Points',
            balance: {
              string: `${points}/${goal}`
            }
          }
        }
      ]
    }
  };

  const token = jwt.sign(payload, credentials.private_key, {
    algorithm: 'RS256',
    keyid: credentials.private_key_id,
    expiresIn: '1h',
    header: {
      typ: 'JWT',
      alg: 'RS256',
      kid: credentials.private_key_id
    }
  });

  return `https://pay.google.com/gp/v/save/${token}`;
};

const generateQRCode = async (url) => {
  try {
    return await QRCode.toDataURL(url);
  } catch (err) {
    console.error('QR code generation failed:', err);
    throw err;
  }
};

module.exports = { createLoyaltyClass, createGooglePass, generateQRCode };