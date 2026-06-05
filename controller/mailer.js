// const nodemailer=require("nodemailer");

// const mailer=function(email,status,callback){

//     const transport=nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth:{
//             user:process.env.USER_EMAIL,
//             pass:process.env.EMAIL_PASSWORD,
//         }
//     });

//     const endPoint=status?"student/studentRegistration": "teacher/teacherRegistration";

//     const mailOption={

//         from:process.env.USER_EMAIL,
//         to:email,
//         subject:`Registration Link for ${status?'Student':'Teacher'}`,
//         html:`Hello ${email}, This is simply a registration link which is given below, you must need to click on the 
//         below link to register yourself.
//         <br><br>
//         <form action='http://localhost:3000/${endPoint}' method='post'> 
//         <input type='hidden' name='email' id='email' value='${email}'> 
//         <button>Click To Register</button> </form>
//         `
//     }

//     transport.sendMail(mailOption, (error, info)=>{

//         if(error){

//             console.log("Error while sending mail from mailer :", error);
//             callback(false);
//         }
//         else{
//             console.log("Mail send from mailer");
//             callback(info);
//         }
//     });
// }

// module.exports={mailer:mailer};

const SibApiV3Sdk = require("sib-api-v3-sdk");
const jwt = require("jsonwebtoken");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const mailer = async function (email, status, callback) {
    try {
        const endPoint = status
            ? "student/studentRegistration"
            : "teacher/teacherRegistration";
        
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        const registrationLink =
            `${process.env.BASE_URL}/${endPoint}?token=${token}`;

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = {
            email: process.env.USER_EMAIL, 
            name: "Registration Team"
        };

        sendSmtpEmail.to = [
            {
                email: email
            }
        ];

        sendSmtpEmail.subject =
            `Registration Link for ${status ? "Student" : "Teacher"}`;

        sendSmtpEmail.htmlContent = `
            <h3>Hello ${email}</h3>

            <p>
                This is your registration link.
                Click the button below to complete your registration.
            </p>

            <br>

            <a
                href="${registrationLink}"
                style="
                    background:#2563eb;
                    color:white;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                "
            >
                Click To Register
            </a>

            <br><br>

            <p>
                If the button does not working, then click on the link below:
            </p>

            <p>${registrationLink}</p>
        `;

        const response = await emailApi.sendTransacEmail(sendSmtpEmail);

        console.log("Mail sent successfully");
        callback(response);
    } catch (error) {
        console.error("Error while sending mail:", error);
        callback(false);
    }
};

module.exports = {
    mailer
};
