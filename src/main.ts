import { Bot, Context } from 'grammy';
import { I18n } from '@grammyjs/i18n';

import { type I18nFlavor } from '@grammyjs/i18n';
import LocaleKey from './locale-keys';

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

// Set bot description in all supported languages
// for (const loc of i18n.locales) {
//   const desc = i18n.translate(loc, LocaleKey.GREETING);
//   await bot.api.setMyDescription(desc, { language_code: loc });
// }

// Setup bot commands and menus
const IMAGE_BANNER = process.env['IMAGE_BANNER'] ?? '';
bot.command('start', async (ctx) => {
  try {
    await ctx.replyWithPhoto(IMAGE_BANNER, {
      caption: ctx.t(LocaleKey.GREETING),
      parse_mode: 'HTML',
    });
  } catch {
    // Fallback send without photo
    await ctx.reply(ctx.t(LocaleKey.GREETING), {
      parse_mode: 'HTML',
    });
  }
});
await bot.api.setMyCommands([
  { command: 'start', description: 'Start the bot' },
]);

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
