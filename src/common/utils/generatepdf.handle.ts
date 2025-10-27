import fs = require('fs');
import path = require('path');
import * as puppeteer from 'puppeteer';
import * as hbs from 'handlebars';
//import { Data } from './interfaces';

export const generatePDF = async (data: any) => {
  const tipo_pdf = {
    1: 'templatebasicocontratista',
    2: 'templatecompletocontratista',
    3: 'templatebasicovehiculo',
    4: 'templatecompletovehiculo',
  };
  const logo = fs.readFileSync(
    path.join(process.cwd(), './src/common/templates/images/logo.png'),
    { encoding: 'base64' },
  );
  const tipo_header = {
    1: `<div id="header-template" style="font-size:10px!important;font-family: Arial, Helvetica, Verdana, sans-serif; color:#000; margin-left:30px; margin-right:30px; border: 1px solid #000; width:100%; display: flex;flex-direction: row;flex-wrap: nowrap;justify-content: space-between;align-items: stretch;align-content: stretch;"><div style="display: block;flex-grow: 0;flex-shrink: 1;flex-basis: auto;align-self: auto;order: 0; width: 25%;"><img src="data:image/png;base64,${logo}" alt="logo" style="width: 140px; margin-top: 10px;" /></div><div style="display: block;flex-grow: 0;flex-shrink: 1;flex-basis: auto;align-self: auto;order: 0; border-left: 1px solid #000;border-right: 1px solid #000;padding: 1% 2%;  width: 50%;"><div style="font-weight:bold; margin-top:0;margin-bottom:0; text-align:center; font-family: Arial, Helvetica, Verdana, sans-serif;">FORMATO HOJA DE VIDA CONTRATISTA<br/>AREA DE GESTION DE CUENTAS Y VINCULACIONES<br/>CIPIL.COM.CO - RED DE NEGOCIOS E INFORMACION</p></div></div><div style="display: block;flex-grow: 0;flex-shrink: 1;flex-basis: auto;align-self: auto;order: 0; text-align:center; font-family: Arial, Helvetica, Verdana, sans-serif; width: 25%; padding: 2.5% 0% 0%;">F-GCV-001 <br/>Ver. 0.1 <br /><span class="date"></span></div></div>`,
    2: `<div id="header-template" style="font-size:10px!important;font-family: Arial, Helvetica, Verdana, sans-serif; color:#000; margin-left:30px; margin-right:30px; border: 1px solid #000; width:100%; display: flex;flex-direction: row;flex-wrap: nowrap;justify-content: space-between;align-items: stretch;align-content: stretch;"><div style="display: block;flex-grow: 0;flex-shrink: 1;flex-basis: auto;align-self: auto;order: 0; width: 25%;"><img src="data:image/png;base64,${logo}" alt="logo" style="width: 140px; margin-top: 10px;" /></div><div style="display: block;flex-grow: 0;flex-shrink: 1;flex-basis: auto;align-self: auto;order: 0; border-left: 1px solid #000;border-right: 1px solid #000;padding: 1% 2%;  width: 50%;"><div style="font-weight:bold; margin-top:0;margin-bottom:0; text-align:center; font-family: Arial, Helvetica, Verdana, sans-serif;">FORMATO HOJA DE VIDA VEHICULO<br/>AREA DE GESTION DE CUENTAS Y VINCULACIONES<br/>CIPIL.COM.CO - RED DE NEGOCIOS E INFORMACION</p></div></div><div style="display: block;flex-grow: 0;flex-shrink: 1;flex-basis: auto;align-self: auto;order: 0; text-align:center; font-family: Arial, Helvetica, Verdana, sans-serif; width: 25%; padding: 2.5% 0% 0%;">F-GCV-001 <br/>Ver. 0.1 <br /><span class="date"></span></div></div>`,
  };
  const tpdf = tipo_pdf[data.type];
  const hpdf = tipo_header[data.head];
  const templateHtml = fs.readFileSync(
    path.join(process.cwd(), `./src/common/templates/${tpdf}.hbs`),
    'utf8',
  );
  const template = hbs.compile(templateHtml);
  hbs.registerHelper('splitValue', (value: string) => {
    if (value !== undefined) {
      return value.split(' - ').slice(1);
    }
  });
  hbs.registerHelper('renderStars', (rating) => {
    let result = '';
    for (let i = 1; i <= 5; i++) {
      const checked = rating >= i ? 'fa-solid fa-star' : 'fa-regular fa-star';
      result += `<span class='${checked} text-yellow-500 text-xl'></span>`;
    }
    return new hbs.SafeString(result);
  });

  hbs.registerHelper(
    'compareStrings',
    function (p: string | number, q: string | number, options) {
      return p == q ? options.fn(this) : options.inverse(this);
    },
  );

  const html = template(data);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-setuid-sandbox', '--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: 'networkidle2',
  });
  await page.emulateMediaType('screen');
  const pdfBuffer = await page.pdf({
    width: '1024px',
    headerTemplate: hpdf,
    footerTemplate:
      '<div id="footer-template" style="font-size:10px!important; font-family: sans-serif; color: rgb(0, 0, 0); padding-left:30px;">http://www.cipil.com.co – Central de Información @ Todos los derechos reservados. info@cipil.com.co - +57-3124326197 &nbsp;&nbsp;&nbsp; -- Pag&nbsp;<span class="pageNumber"></span>&nbsp;de&nbsp;<span class="totalPages"></span></div>',
    displayHeaderFooter: true,
    format: 'LETTER',
    margin: { left: '1cm', top: '2.7cm', right: '1cm', bottom: '1.2cm' },
    printBackground: true,
    //path: path.join('pdf', `${milis}.pdf`) //guarda el pdf en un folder
  });
  await browser.close();
  return pdfBuffer;
};
