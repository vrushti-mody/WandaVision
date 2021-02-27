const generateMessage=(message,username,userid)=>{
    return {
        message,
        createdAt: Date.now(),
        username:username,
        userid:userid
    }
    }

    module.exports={
        generateMessage
    }
