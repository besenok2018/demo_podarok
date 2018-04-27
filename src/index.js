const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const cheerio = require('cheerio')
const config = require('./config')
const helper = require('./helper')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
var fs = require('fs');
const bot = new TelegramBot(config.TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

helper.logStart()

const text_opisan = fs.readFileSync('./files/opisanie.txt')
const text_html2 = fs.readFileSync('./files/html2.txt')
const text_instr = fs.readFileSync('./files/instrukciya.txt')
//console.log(text1.toString())
bot.on('message', msg => {
//    console.log(msg)
    console.log('Отправил сообщение', msg.from.first_name)
    var id = msg.from.id
    var username = msg.from.username

    const chatId = helper.getChatId(msg)
    const messageOptions = {
        parse_mode: 'HTML',
        disable_web_page_preview: true
    }

//    const html = `${text1.toString()}`
//    console.log(html)

    const html2 = `${text_html2.toString()}`
    const opisan = `${text_opisan.toString()}`
    const instr = `${text_instr.toString()}`
    const otv_pologh = `Вы прошли проверку и действительно являетесь подписчиком канала`
    const otv_otric = `Вы не подписаны на канал, срочно подпишитесь...`

        switch (msg.text) {
            case kb.home.instrukciya:
            bot.sendMessage(chatId, instr, {
                reply_markup: {keyboard: keyboard.podarok}
                })
            setTimeout(() => {
                bot.sendMessage(chatId, `Итак, кликайте по кнопке "Да, я - подписчик" или "Подписаться"`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Подписаться',
                                url: 'https://t.me/joinchat/AAAAAErwO9uwQplMTPNOOA'
                            }],
                            [{
                                text: 'Да, я - подписчик',
                                callback_data: 'yes'


                            }]
                        ]
                    }
                })
            }, 1000)

bot.on('callback_query', function (msg) {
    if (msg.data === 'yes') {

var url = `https://api.telegram.org/bot${config.TOKEN}/getChatMember?chat_id=@ForGoodHealth&user_id=${id}`

        request(url, function(error, response, body) {

            var json = JSON.parse(body)
            //    console.log(json)

            const who_user = json.result.status
            if (who_user === 'creator') {

            bot.sendMessage(chatId, otv_pologh),
                setTimeout(() => {
                    bot.sendMessage(chatId, html2, messageOptions ),
                        fs.appendFileSync('./files/users.txt', `${id}:@${username}; `)
                }, 1000)
        } else {

                if (who_user === 'member') {

                    bot.sendMessage(chatId, otv_pologh),
                        setTimeout(() => {
                            bot.sendMessage(chatId, html2, messageOptions ),
                                fs.appendFileSync('./files/users.txt', `${id}:@${username}; `)
                        }, 1000)
                } else {


                    if (who_user === 'administrator') {

                        bot.sendMessage(chatId, otv_pologh),
                            setTimeout(() => {
                                bot.sendMessage(chatId, html2, messageOptions),
                                    fs.appendFileSync('./files/users.txt', `${id}:@${username}; `)
                            }, 1000)
                    } else {
                     //   console.log(json)
                        bot.sendMessage(chatId, otv_otric, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                        text: 'Подписаться',
                                        url: 'https://t.me/joinchat/AAAAAErwO9uwQplMTPNOOA'
                                    }]
                                ]
                            }
                        })
                    }
                }

            }

        })

        }


})
                break

        case kb.back:
            bot.sendMessage(chatId, `Чтобы посмотреть более подробное описание подарка кликни на кнопку - Описание подарка.
Чтобы узнать, как забрать подарок кликни на кнопку - Инструкция.`, {
                reply_markup: {keyboard: keyboard.home}
            })
            break


            case kb.home.opisanie:
                bot.sendMessage(chatId, opisan, {
                    reply_markup: {keyboard: keyboard.podarok}
                })

                break
    }
})

bot.onText(/\/start/, msg => {
    const text = `Здравствуйте, ${msg.from.first_name}!\nЧтобы посмотреть более подробное описание подарка кликни на кнопку - Описание подарка.\nЧтобы узнать, как забрать подарок кликни на кнопку - Инструкция.`
    bot.sendMessage(helper.getChatId(msg), text, {
        reply_markup: {
           keyboard: keyboard.home
        }
    })
})