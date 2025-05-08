import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const generatePdf = async (data, templateName, outputFileName) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, `../views/${templateName}.ejs`),
      data
    );

    const browser = await puppeteer.launch({
      headless: 'new', // 'new' works better with latest Puppeteer
    });
    const page = await browser.newPage();

    // Write HTML to temporary file or use data URL
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const outputFilePath = path.join(__dirname, '../public', outputFileName);
    await page.pdf({
      path: outputFilePath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    console.log("PDF created successfully")
    return outputFilePath;
  } catch (error) {
    console.error('Error generating PDF with Puppeteer:', error);
    throw error;
  }
};
