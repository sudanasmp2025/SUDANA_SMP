const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

let baseUsername = 'SUDANA_smp';
let botInstance = null;
let reconnecting = false;

function createBot() {
  if (botInstance || reconnecting) return;

  reconnecting = false;

  const bot = mineflayer.createBot({
    host: 'sudana_smp.aternos.me',
    port: 53659,
    username: baseUsername,
    version: '1.16.5',
  });

  botInstance = bot;

  const funnyMessages = [
    "Main toh sirf spawn hone aaya tha… server ne thappad se welcome kiya!",
    "Nether gaya tha blaze marne… blaze ne mujhe hi fry kar diya!",
    "Villager trade de raha tha… par aankhon mein toh EMI ka dard tha!",
    "Skeleton aur I ka rishta deep hai… har roz gift deta hai, arrow ka!",
    "Main toh chill kar raha tha… creeper ne surprise birthday diya!",
    "Zombie mujhe dekhta hai jaise main uska bhatija hoon jo chappal le gaya tha!",
    "Pickaxe tut gaya… aur mood bhi!",
    "Main jump kar raha tha… gravity serious le liya bhai!",
    "Warden aaya toh laga DJ aaya… next moment: RIP headphones!",
    "Abhi toh mining shuru ki thi… bedrock ne bol diya: aur kitna neeche jaega re?",
    "Phir se ghar bhool gaya… GPS toh kisi witch ne le liya hoga!",
    "Ender dragon ne toh aise maara… jaise main uska rent nahi diya ho!",
    "Lag aaya, creeper gaya… main bhi gaya!",
    "Jab creeper nazar milaaye… tabhi game over samjho!",
    "Nether portal khula… par back ticket book nahi kiya tha!",
    "Redstone ka engineer banna tha… ab bell bhi nahi bajti!",
    "Diamond dhoondhne gaya tha… coal ne hi gali de di!",
    "Aaj tak sirf ek fight jeeta… wo bhi AFK player se!",
    "Server me join kiya tha style se… exit hua sadness se!",
    "Mujhe laga main pro hoon… server bola 'Noob of the Year' ",
    "Skeleton ne aaj fir headshot mara... helmet sirf design ke liye tha kya?",
    "Creeper ke saath bonding kar raha tha... ab respawn pe milte hain.",
    "Beech mine mein tha, aur net gaya... ab toh gravel hi gravel hai.",
    "Villager mujhe aise ghoor raha tha jaise loan ka due date ho aaj!",
    "Main toh potion peeke aaya tha... server ne mujhe hi invis kar diya!",
    "Bed lagaya tha aaram ke liye... ab wahi respawn point ban gaya!",
    "Enderman se aankh mil gayi... ab toh family photo bhi nahi bachi.",
    "Pickaxe tut gaya aur diamond mila nahi... bas aansu hi mile!",
    "Server bola: You died. Main bola: Tu kaun hota hai bolne wala?",
    "Jab maine fight jeeti thi... tab creative mode on tha ",
    "Zombie aaya, sword nikala... par galti se fishing rod pakad li!",
    "Mujhe laga enchant karne gaya hoon... saara XP gaya tel lene!",
    "Main redstone ka engineer hoon... par gate khulta hi nahi bhai!",
    "Bow liya tha power 5 wala... par arrows ghar pe bhool aaya!",
    "Server me join kiya aur laga sab theek hai... phir creeper aaya "
  ];

  bot.on('spawn', () => {
    bot.chat('/register aagop04');
    setTimeout(() => bot.chat('/login aagop04'), 1000);
    setTimeout(() => bot.chat('/tp -247 200 62'), 2000);
    startHumanLikeBehavior();
    scheduleFunnyMessage();
    scheduleRandomDisconnect();
  });

  function startHumanLikeBehavior() {
    const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];

    function moveRandomly() {
      const action = actions[Math.floor(Math.random() * actions.length)];
      bot.setControlState(action, true);
      setTimeout(() => {
        bot.setControlState(action, false);
        const delay = 1000 + Math.random() * 6000;
        setTimeout(moveRandomly, delay);
      }, 300 + Math.random() * 1000);
    }

    moveRandomly();
  }

  function scheduleFunnyMessage() {
    const delay = Math.floor(Math.random() * (15 - 10 + 1) + 10) * 60 * 1000;
    setTimeout(() => {
      const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
      bot.chat(msg);
      scheduleFunnyMessage();
    }, delay);
  }

  function scheduleRandomDisconnect() {
    const minutes = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
    console.log(`Next disconnect scheduled in ${minutes} minutes.`);
    setTimeout(() => {
      console.log("Random disconnecting...");
      bot.quit();
    }, minutes * 60 * 1000);
  }

  bot.on('kicked', reason => {
    console.log("Kicked or banned. Reason:", reason);
    if (!reconnecting) {
      reconnecting = true;
      botInstance = null;
      const randomSuffix = Math.floor(Math.random() * 900 + 100);
      baseUsername = `SUDANA_smp${randomSuffix}`;
      const delay = Math.floor(Math.random() * 11 + 10) * 1000;
      console.log(`Reconnecting in ${delay / 1000} seconds with new username: ${baseUsername}`);
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, delay);
    }
  });

  bot.on('end', () => {
    botInstance = null;
    if (!reconnecting) {
      const delay = Math.floor(Math.random() * 21 + 10) * 1000;
      console.log(`Bot disconnected. Reconnecting in ${delay / 1000} seconds...`);
      setTimeout(createBot, delay);
    }
  });

  bot.on('error', console.log);
}

createBot();
