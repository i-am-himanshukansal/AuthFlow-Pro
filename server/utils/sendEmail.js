import nodeMailer from "nodemailer";


export const sendEmail = async({email,subject,message})=>{
    try {
        const transporter = nodeMailer.createTransport({
            host:process.env.SMTP_HOST,
            service  :process.env.SMTP_SERVICE,
            port:process.env.SMTP_PORT || 587,
            auth:{
                user : process.env.SMTP_MAIL,
                pass : process.env.SMTP_PASSWORD,
            },
        });

        const options = {
            from : process.env.SMTP_MAIL,
            to : email,
            subject : subject,
            html : message,// format for message which format we use have to mention
        }
        await transporter.sendMail(options);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error.message);
        throw new Error("Failed to send email");
    }
}