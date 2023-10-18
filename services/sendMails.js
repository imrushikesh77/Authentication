const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
async function sendMail(receiverMail,link){
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        
        const transport = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                type: 'OAuth2',
                user: 'ashishashoksutar.1@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        // Mail to be sent 
        const mailOptions = {
            from: 'Ashish Sutar ⚡ <ashishashoksutar.1@gmail.com>',
            to: `<${receiverMail}>`,
            subject: "Password Reset Link",
            text: link
        }

        const result  = await transport.sendMail(mailOptions);
        return result;
    }
    catch(error)
    {
        return error;
    }
}


module.exports = {sendMail};