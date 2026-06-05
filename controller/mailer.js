const nodemailer=require("nodemailer");

const mailer=function(email,status,callback){

    const transport=nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            user:process.env.USER_EMAIL,
            pass:process.env.EMAIL_PASSWORD,
        }
    });

    const endPoint=status?"student/studentRegistration": "teacher/teacherRegistration";

    const mailOption={

        from:process.env.USER_EMAIL,
        to:email,
        subject:`Registration Link for ${status?'Student':'Teacher'}`,
        html:`Hello ${email}, This is simply a registration link which is given below, you must need to click on the 
        below link to register yourself.
        <br><br>
        <a
        href="http://localhost:3000/student/studentRegistration?email=${encodeURIComponent(email)}"
        style="
            background:#2563eb;
            color:white;
            padding:10px 20px;
            text-decoration:none;
            border-radius:5px;
            display:inline-block;
        "
        >
        Click To Register
        </a>
        `
    }

    transport.sendMail(mailOption, (error, info)=>{

        if(error){

            console.log("Error while sending mail from mailer :", error);
            callback(false);
        }
        else{
            console.log("Mail send from mailer");
            callback(info);
        }
    });
}

module.exports={mailer:mailer};
