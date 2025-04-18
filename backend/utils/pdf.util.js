import ejs from 'ejs';
import pdf from 'html-pdf';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const generatePdf = async (data, templateName, outputFileName) => {
  try {
    const html = await new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, `../views/${templateName}.ejs`),
        data,
        (err, renderedHtml) => {
          if (err) reject(err);
          else resolve(renderedHtml);
        }
      );
    });

    const pdfOptions = {
      height: '11.25in',
      width: '8.5in',
      header: { height: '20mm' },
      footer: { height: '20mm' },
    };

    const outputFilePath = path.join(__dirname, '../public', outputFileName); 
    const pdfFilePath = await new Promise((resolve, reject) => {
      pdf.create(html, pdfOptions).toFile(outputFilePath, (err, result) => {
        if (err) {
            console.error("Error creating PDF:", err);
            reject(err);
          } else {
            console.log("PDF created successfully");
            resolve(result.filename);
          }
      });
    });

    return pdfFilePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
