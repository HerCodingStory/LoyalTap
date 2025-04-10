const { google } = require('googleapis');
const path = require('path');
const credentials = require('../GoogleWallet/credentials/goole-service-account.json');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const QRCode = require('qrcode');

const ISSUER_ID = '3388000000022905745'; // from Wallet Console
const CLASS_ID = `${ISSUER_ID}.loyalty_class`;

const createLoyaltyClass = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  const client = await auth.getClient();
  const wallet = google.walletobjects({ version: 'v1', auth: client });

  try {
    const res = await wallet.loyaltyclass.insert({
      requestBody: {
        id: CLASS_ID,
        issuerName: 'Loyaltap',
        programName: 'Loyalty Rewards',
        reviewStatus: 'underReview',
        rewardsTierLabel: 'Reward Level',
        rewardsTier: 'Gold',
        programLogo: {
          sourceUri: {
            uri: 'https://i.postimg.cc/KvpcFk31/Astra-Web-Miami-2.png',
            description: 'AstraWeb Miami'
          }
        },
        messages: [{
          header: 'Welcome!',
          body: 'Thanks for joining our rewards program 🎉'
        }]
      }
    });

    console.log('Loyalty class created:', res.data);
    return res.data;
  } catch (err) {
    if (err.errors?.[0]?.reason === 'duplicate') {
      console.log('Loyalty class already exists.');
    } else {
      console.error('Error creating loyalty class:', err);
    }
  }
};

const createGooglePass = (customerEmail, points, goal) => {
  if (typeof customerEmail !== 'string') {
    throw new Error('customerEmail must be a string');
  }
  const customerId = customerEmail.replace(/[@.]/g, '_'); // safe ID
  const objectId = `${ISSUER_ID}.${customerId}`;

  const payload = {
    iss: credentials.client_email,
    aud: 'google',
    typ: 'savetowallet',
    origins: ['https://astrawebmiami.com'],
    payload: {
      loyaltyObjects: [
        {
          id: objectId,
          classId: CLASS_ID,
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