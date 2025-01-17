const io = require('../app.js').io;
const {
	VERIFY_USER,
	USER_CONNECTED,
	USER_DISCONNECTED,
	LOGOUT,
	COMMUNITY_CHAT,
	MESSAGE_RECIEVED,
	MESSAGE_SENT,
	TYPING,
	PRIVATE_MESSAGE,
	NEW_CHAT_USER,
} = require('../../src/components/chatFolder/Events');

const { createUser, createMessage, createChat } = require('../../src/components/chatFolder/Factories');

let connectedUsers = {};

let communityChat = createChat({ isCommunity: true });

module.exports = function (socket) {
	// console.log('\x1bc'); //clears console
	console.log('Socket Id:' + socket.id);

	let sendMessageToChatFromUser;

	let sendTypingFromUser;

	//Verify Username
	socket.on(VERIFY_USER, (nickname, callback) => {
		if (isUser(connectedUsers, nickname)) {
			callback({ isUser: true, user: null });
		} else {
			callback({ isUser: false, user: createUser({ name: nickname, socketId: socket.id }) });
		}
	});

	//User Connects with username
	socket.on(USER_CONNECTED, (user) => {
		user.socketId = socket.id;
		connectedUsers = addUser(connectedUsers, user);
		socket.user = user;

		sendMessageToChatFromUser = sendMessageToChat(user.name);
		sendTypingFromUser = sendTypingToChat(user.name);

		io.emit(USER_CONNECTED, connectedUsers);
		console.log(connectedUsers);
	});

	//User disconnects
	socket.on('disconnect', () => {
		if ('user' in socket) {
			connectedUsers = removeUser(connectedUsers, socket.user.name);

			io.emit(USER_DISCONNECTED, connectedUsers);
			console.log('Disconnect', connectedUsers);
		}
	});

	//User logsout
	socket.on(LOGOUT, () => {
		connectedUsers = removeUser(connectedUsers, socket.user.name);
		io.emit(USER_DISCONNECTED, connectedUsers);
		console.log('Disconnect', connectedUsers);
	});

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat);
	});

	socket.on(MESSAGE_SENT, ({ chatId, message }) => {
		sendMessageToChatFromUser(chatId, message);
	});

	socket.on(TYPING, ({ chatId, isTyping }) => {
		sendTypingFromUser(chatId, isTyping);
	});

	socket.on(PRIVATE_MESSAGE, ({ reciever, sender, activeChat }) => {
		if (reciever in connectedUsers) {
			const recieverSocket = connectedUsers[reciever].socketId;
			if (activeChat === null || activeChat.id === communityChat.id) {
				const newChat = createChat({ name: `${reciever}&${sender}`, users: [reciever, sender] });
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat);
				socket.emit(PRIVATE_MESSAGE, newChat);
			} else {
				if (!(reciever in activeChat.users)) {
					activeChat.users
						.filter((user) => user in connectedUsers)
						.map((user) => connectedUsers[user])
						.map((user) => {
							socket.to(user.socketId).emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever });
						});
					socket.emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: reciever });
				}
				socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat);
			}
		}
	});
};

function sendTypingToChat(user) {
	return (chatId, isTyping) => {
		io.emit(`${TYPING}-${chatId}`, { user, isTyping });
	};
}

function sendMessageToChat(sender) {
	return (chatId, message) => {
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({ message, sender }));
	};
}

function addUser(userList, user) {
	let newList = Object.assign({}, userList);
	console.log(user);
	newList[user.name] = user;
	return newList;
}

function removeUser(userList, userName) {
	let newList = Object.assign({}, userList);
	delete newList[userName];
	return newList;
}

function isUser(userList, userName) {
	return userName in userList;
}
