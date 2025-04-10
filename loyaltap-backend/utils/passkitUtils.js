// const path = require('path');
// const Passbook = require('passkit-generator');
//
// const createApplePass = async (customerEmail, points, goal) => {
//   try {
//     const template = await Passbook.loadTemplate(path.join(__dirname, '../passTemplate'));
//
//     template.fields.primaryFields.add({ key: 'points', label: 'Points', value: `${points}/${goal}` });
//     template.fields.secondaryFields.add({ key: 'email', label: 'Customer', value: customerEmail });
//
//     const pass = template.createPass({
//       serialNumber: `${customerEmail}-${Date.now()}`,
//       authenticationToken: 'dummy-token', // Update with real auth token
//       webServiceURL: 'https://yourdomain.com/api/apple-pass',
//     });
//
//     return pass.getAsBuffer();
//   } catch (err) {
//     console.error('Error creating Apple Wallet pass:', err);
//     throw err;
//   }
// };
//
// module.exports = { createApplePass };
