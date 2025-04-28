const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);


exports.processPayment = async(req,res, next)=>{
    const mypayment = await stripe.paymentIntents.create({
        amount:"Dollar",
        metadata:{
            company:"Ecommerce",
        },
    })
    res.status(200).json({
        sucess:true,client_secrete:mypayment.client_secrete  });
}


exports.sendSripeApiKey = async(req,res, next)=>{
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY
 });
}