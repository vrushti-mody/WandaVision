

//

const users=[]
const meets = []

const addUser = ({id, username, room,email, userid}) =>{

    room = room.trim().toLowerCase()

    if(!username || !room ){
        return{
            error:'Username and room are required'
        }
    }

    const user={id,username,room,email,userid}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if (index!= -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
    return users.find((user)=> user.id===id)
}

const getUsersInRoom=(room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}

const numberOfUsersInRoom=(room)=>{
    room1 = room.trim().toLowerCase()
    console.log(room1,users)
    const a= users.filter((user)=>user.room===room).length
    console.log(a)
    return a
}

const getRoomDescription=(room)=>{
    console.log("ROOM IS " + room)
    let re = /subject:(.*?);mic:(.*?);video:(.*?);/
    var description = room.match(re)
    var a = {
     
      subject: description[1],
      mic: description[2],
      video: description[3]
    }
    return a
}

const addMeet = ({room, meet}) =>{
    if (meet.length > 0){
        const meet1={room,meet}
        meets.push(meet1)
    }
}

const getMeet = (room)=>{
    return meets.find((meet1)=> meet1.room===room)
}


module.exports={
    addUser,
    getUser,
    getUsersInRoom,
    getRoomDescription,
    numberOfUsersInRoom,
    removeUser,
    addMeet,
    getMeet
}
