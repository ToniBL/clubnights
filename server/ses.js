const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

// creating in instance (obj from constructor) of SES and store in an variable
const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = function (recipient, message, subject) {
    //ses.sendEmail takes one big obj as argument
    return ses
        .sendEmail({
            Source: "Funky Chicken <knotty.wok@spicedling.email> ",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()  // this line is amazons ways of promisifying this function
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
