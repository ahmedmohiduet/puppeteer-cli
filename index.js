#!/usr/bin/env node

const puppeteer = require('puppeteer');
const parseUrl = require('url-parse');
const fileUrl = require('file-url');
const isUrl = require('is-url');

const argv = require('yargs')
    .command({
        command: 'print <input> <output>',
        desc: 'Print an html file to pdf',
        builder: {
            background: {
                default: true
            },
            marginTop: {
                default: '6.25mm'
            },
            marginRight: {
                default: '6.25mm'
            },
            marginBottom: {
                default: '14.11mm'
            },
            marginLeft: {
                default: '6.25mm'
            },
            format: {
                default: 'Letter'
            },
            landscape: {
                boolean: true,
                default: false
            }
        },
        handler: async argv => {
            try {
                await print(argv);
            } catch (err) {
                console.error('Failed to generate pdf:', err);
                process.exit(1);
            }
        }
    }).command({
        command: 'screenshot <input> <output>',
        desc: 'Take screenshot of an html file',
        handler: async argv => {
            try {
                await screenshot(argv);
            } catch (err) {
                console.error('Failed to take screenshot:', err);
                process.exit(1);
            }
        }
    })
    .demandCommand()
    .help()
    .argv;

async function print(argv) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    console.log(`Loading ${url}`);
    await page.goto(url);

    console.log(`Writing ${argv.output}`);
    await page.pdf({
        path: argv.output,
        format: argv.format,
        landscape: argv.landscape,
        printBackground: argv.background,
        margin: {
            top: argv.marginTop,
            right: argv.marginRight,
            bottom: argv.marginBottom,
            left: argv.marginLeft
        }
    });

    console.log('Done');
    await browser.close();
}

async function screenshot(argv) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    console.log(`Loading ${url}`);
    await page.goto(url);

    console.log(`Writing ${argv.output}`);
	await page.screenshot({
			path: argv.output
	});

    console.log('Done');
    await browser.close();
}
