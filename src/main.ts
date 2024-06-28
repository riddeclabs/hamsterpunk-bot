import { Bot, Context } from 'grammy';
import { I18n } from '@grammyjs/i18n';

import { type I18nFlavor } from '@grammyjs/i18n';

if (process.env['SECRETS']) {
  const secrets = JSON.parse(process.env['SECRETS']) as Record<string, string>;
  for (const key in secrets) {
    process.env[key] = secrets[key];
  }
}

export type MyContext = Context & I18nFlavor;
const bot = new Bot<MyContext>(process.env['TELEGRAM_API_TOKEN'] ?? '');

// Setup internationalization
const i18n = new I18n<MyContext>({
  defaultLocale: 'en',
  directory: 'locales',
});
bot.use(i18n);

// Setup bot commands and menus
// const IMAGE_BANNER = process.env['IMAGE_BANNER'] ?? '';

bot.command("start", async (ctx) => {
  await ctx.replyWithGame("Hamsterpunk");
});

bot.on("callback_query:game_short_name", async (ctx) => {
  await ctx.answerCallbackQuery({ url: "https://game.hamsterpunk.net/" });
});

// Photo upload handler
const BOT_ADMIN = Number(process.env['BOT_ADMIN_ID']);
bot.on(':photo', async (ctx) => {
  if (ctx.from?.id !== BOT_ADMIN) return;
  if (!ctx.message?.photo) return;

  const photo = ctx.message.photo.pop();
  await ctx.reply(`Received photo:\n\`${photo?.file_id}\``, {
    parse_mode: 'MarkdownV2',
  });
});

console.log('😼 Starting bot...');
await bot.start();
