const { google } = require('googleapis');
const path = require('path');
const credentials = require('../GoogleWallet/credentials/goole-service-account.json');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const QRCode = require('qrcode');

const issuerId = '3388000000022905745';

const createLoyaltyClass = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  const client = await auth.getClient();
  const wallet = google.walletobjects({ version: 'v1', auth: client });

  const classId = `${issuerId}.loyalty_class`; // Must match the ID in object generator

  try {
    const res = await wallet.loyaltyclass.insert({
      requestBody: {
        id: classId,
        issuerName: 'Loyaltap',
        programName: 'Loyalty Rewards',
        reviewStatus: 'underReview',
        messages: [{
          header: 'Welcome!',
          body: 'Thanks for joining our rewards program 🎉',
        }],
        rewardsTierLabel: 'Reward Level',
        rewardsTier: 'Gold',
        programLogo: {
          sourceUri: {
            uri: 'https://i.postimg.cc/KvpcFk31/Astra-Web-Miami-2.png',
            description: 'AstraWeb Miami'
          }
        }
      },
    });

    console.log('Loyalty class created:', res.data);
    return res.data;
  } catch (err) {
    if (err.errors && err.errors[0].reason === 'duplicate') {
      console.log('Class already exists.');
    } else {
      console.error('Error creating loyalty class:', err);
    }
  }
};

const createGooglePass = (customerEmail, points, goal) => {
    const customerId = customerEmail.replace(/[@.]/g, '_'); // ID-safe string
    const objectId = `${issuerId}.${customerId}`; // Must match class issuer prefix
    const classId = `${issuerId}.loyalty_class`;
  
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
                string: `${points}/${goal}`,
              },
            },
          },
        ],
      },
    };
  
    const token = jwt.sign(payload, credentials.private_key, {
      algorithm: 'RS256',
      expiresIn: '1h',
      keyid: credentials.private_key_id,
      header: {
        kid: credentials.private_key_id,
        typ: 'JWT',
        alg: 'RS256',
      },
    });
  
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    return saveUrl;
  };

const generateQRCode = async (url) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url);
      return qrDataUrl; // base64 string that can be used in HTML or frontend
    } catch (err) {
      console.error('QR generation failed:', err);
      throw err;
    }
};

module.exports = { createLoyaltyClass, createGooglePass, generateQRCode };
