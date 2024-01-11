const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')

const token = '6558452165:AAHV-BC3vi0NyHDatoRKQatIeIdbeHcia2M'

const bot = new TelegramApi(token, {polling:true})

const chats = {}



const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от от 0 до 9, а ты должен его отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсствие'},
        {command: '/info', description: 'Получить инофрмацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start'){
            await bot.sendSticker(chatId, 'c:\\Users\\varde\\Downloads\\michael_scott.webp')
            return bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name}`);
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${(msg.from.last_name) ? msg.from.last_name : ''}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'I don\'t underastand you! Try again, dude!');
    })
    
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId);
        }
        if (data === chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты отадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
       
    })
}

start()