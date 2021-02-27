const socket = io()

//Elements

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sliderTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const params = new URL(location.href).searchParams;
const username = params.get('username')
const userid = params.get('userid')
const subject = params.get('subject')
const email = params.get('email')
const meet = params.get('meet') || ''
const mic = params.get('mic')? params.get('mic'): 'No'
const video = params.get('video')? params.get('video'): 'No'
const notes = params.get('notes')
const tasks = params.get('tasks')
const room = "Subject:" + subject + ";Mic:" + mic + ";Video:" + video +";"
console.log(room)
// const autoscroll=()=>{
//     const $newMessage =$messages.lastElementChild
//     const newMessageHeight= $newMessage.offsetHeight
//     const newMessageStyles = getComputedStyle($newMessage)
//     const newMessageMargin = parseInt(newMessageStyles.marginBottom)
// }
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message:message.message,
        createdAt: moment(message.createdAt).format('h:mm:ss a'),
        username:message.username,
        email:message.userid
    })
    $messages.insertAdjacentHTML('beforeend',html)

    // autoscroll()
})

socket.on('roomdata',({room,users})=>{
    const html = Mustache.render(sliderTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML= html

    // autoscroll()
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
  e.preventDefault()
  $messageFormButton.setAttribute('disabled','disabled')
  const message = document.querySelector('input').value
  socket.emit('send',message,(error)=>{
      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value=" "
      $messageFormInput.focus()
      if(error){
          return console.log(error)
      }
      console.log('Message delivered')
  })
})

socket.emit('join',{username,room,email,userid,meet},(error)=>{
    if(error){
        alert(error)
        location.href='/users'
    }
})

// send the first message using notes
if (notes) {
  socket.emit('send',notes,(error)=>{
      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value=" "
      $messageFormInput.focus()
      if(error){
          return console.log(error)
      }
      console.log('Message delivered')
  })
}

// fill in tasks
var taskList = tasks.split("|")
for (const [index, task] of Object.entries(taskList)) {
  let html =
      '<div class="custom-control custom-checkbox">' +
        '<input type="checkbox" class="custom-control-input" id="' + index + '">' +
        '<label class="custom-control-label" for="' + index + '" style="height: auto;">' + task.split("(")[0] + '<small class="text-muted"> (Priority ' + task.split("(")[1] + '</small></label>' +
      '</div>';
  let elem = document.createElement('li');
  elem.innerHTML = html;
  if (task.split("(")[1] != undefined) document.querySelector('.tasks-list').appendChild(elem);
}
