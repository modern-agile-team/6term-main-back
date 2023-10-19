const namespaceURL = 'http://localhost:3000/ch-650bde3798dd4c34439c30dc';
const socket = io(namespaceURL);

socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // 예제로 'login' 이벤트를 보내는 방법
  socket.emit('login', { id: 1, rooms: [`ch-650bde3798dd4c34439c30dc`] });
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

// 해당 네임스페이스의 이벤트를 수신
socket.on('message', (data) => {
  console.log(
    'Received message notification in the specified namespace:',
    data,
  );
});
