const namespaceURL = 'http://localhost:3000/ch-653383a4468680bc4e9f8491';
const socket = io(namespaceURL);

socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // 예제로 'login' 이벤트를 보내는 방법
  socket.emit('login', {
    userId: 1,
    rooms: ['653383a4468680bc4e9f8491'],
  });
  // socket.emit('messages', {
  //   roomId: '650bde3798dd4c34439c30dc',
  //   message: 'asdf',
  // });
  // console.log(socket);

  // 해당 네임스페이스의 이벤트를 수신
});

socket.on('hello', (data) => {
  console.log('Received hello message:', data);
});

socket.on('msgNoti', (data) => {
  console.log('Received message notification:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('message', (data) => {
  console.log('Received message:', data);
  // 여기에서 메시지를 처리하거나 화면에 표시하는 로직을 추가하세요..
});
