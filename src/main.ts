// Guida: https://www.ludusrusso.dev/blog/2022/06/telegram-bot-node
// Deploy: https://www.cyclic.sh/posts/how-to-build-a-telegram-bot/

import { Telegraf } from "telegraf";
import fetch  from "isomorphic-fetch";
require('dotenv').config();


var menu = "Comandi:\n"
// menu += "/cacca fai cacca\n";
// menu += "/uva mangia uva\n";
menu += "/BTCfees get btc fees\n";

const bot = new Telegraf(`${process.env.BOT_TOKEN}`);

//bot.start((ctx) => ctx.reply("Welcome"));

// ---------------------------------------- START BOT
bot.command("start", (ctx) => {
    const msg = ctx.message;
    const intro = ` Benvenuto ${msg.from.first_name}!\n `

    ctx.reply(intro + menu);
});

// ---------------------------------------- COMANDI BOT
/* 
    TEMPLATE COMANDI

    bot.command("uva", (ctx) => {
        ctx.reply("uva!");
    });

    bot.hears("hi", (ctx) => ctx.reply("Hey there"));
*/

bot.command("menu", (ctx) => {
    ctx.reply(menu);
});

bot.command("BTCfees", async (ctx) => {
   var data =  await getData("https://mempool.space/api/v1/fees/recommended");
   data = JSON.stringify(data);

   var reply = "High: \t" + getFees("FASTEST", data) + "\n";
   reply += "Med: \t" + getFees("HALFHOUR", data) + "\n";
   reply += "Slow: \t" + getFees("HOUR", data) + "\n";
   //reply += "Very slow: " + getFees("ECONOMY", data) + "\n";
   
   ctx.reply("Priority (sat/vB): \n" + reply);
   ctx.reply(menu);
});

// ---------------------------------------- FUNZIONI VARIE
// Effettua fetch di un URL
async function getData(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    //console.log(data);
    return data;
}

// Serve per il comando BTCfees, ritorna le fees
function getFees(type: string, data: string) {
    var inizio = 0, fine;
    switch(type){
        case "FASTEST": 
            inizio = data.indexOf("fastestFee\":") + 12;
            break;
        
        case "HALFHOUR":
            inizio = data.indexOf("halfHourFee\":") + 13;
            break;
        
        case "HOUR":
            inizio = data.indexOf("hourFee\":") + 9;
            break;
        
        case "ECONOMY":
            inizio = data.indexOf("economyFee\":") + 12;
            break;   
    }
    
    fine = data.indexOf(",", inizio + 1);
    return data.substring(inizio, fine);
}

// ---------------------------------------- AVVIO BOT
bot.launch();