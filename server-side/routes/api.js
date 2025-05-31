import express from 'express';
import { body, validationResult } from 'express-validator';
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import fs from 'fs/promises'; // Using promise-based fs for async/await
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join} from 'path'; // Use join for constructing paths

// Import the model (ensure the path is correct and includes .js extension)
import Submission from '../models/Submission.js';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// --- Helper function to replace placeholders in HTML templates ---
function populateTemplate(templateContent, data) {
    let populatedHtml = templateContent;
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            const placeholderIf = new RegExp(`{{#if ${key}}}([\\s\\S]*?){{\\/if}}`, 'g');

            populatedHtml = populatedHtml.replace(placeholderIf, (match, content) => {
                return data[key] ? content : '';
            });
            populatedHtml = populatedHtml.replace(placeholder, data[key] || '');
        }
    }
    populatedHtml = populatedHtml.replace(/{{#if \w+}}[\s\S]*?{{\/if}}/g, '');
    return populatedHtml;
}

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10), // Ensure port is a number
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    // secure: process.env.MAIL_PORT === '465', // true for 465, false for other ports like 587 or 2525
});

// --- Form Submission Endpoint ---
router.post(
    '/submit-form',
    [
        body('firstName').notEmpty().trim().escape().withMessage('First name is required.'),
        body('lastName').notEmpty().trim().escape().withMessage('Last name is required.'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
        body('phone').notEmpty().trim().escape().withMessage('Phone number is required.'),
        body('customId').optional().trim().escape(),
        body('submissionDate').optional({ checkFalsy: true }).isISO8601().toDate(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, phone, customId, submissionDate } = req.body;
        const systemTimestamp = new Date();

        const formData = {
            firstName,
            lastName,
            email,
            phone,
            customId: customId || '',
            submissionDate: submissionDate ? new Date(submissionDate).toLocaleString() : '',
            systemTimestamp: systemTimestamp.toLocaleString(),
            brandName: process.env.MAIL_FROM_NAME || "Our Company"
        };

        try {
            // 1. (Optional) Save to Database
            if (process.env.MONGO_URI) {
                const newSubmission = new Submission({
                    firstName, lastName, email, phone, customId, submissionDate, systemTimestamp
                });
                await newSubmission.save();
                console.log('Submission saved to database.');
            } else {
                console.log('Database logging skipped (MONGO_URI not set).');
            }

            // 2. Generate PDF in memory
            const pdfTemplatePath = join(__dirname, '..', 'templates', 'pdfTemplate.html');
            const pdfHtmlTemplate = await fs.readFile(pdfTemplatePath, 'utf-8');
            const populatedPdfHtml = populateTemplate(pdfHtmlTemplate, formData);

            const browser = await puppeteer.launch({
              headless: true, // 'new' is the default in recent versions, true is fine too
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(populatedPdfHtml, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
            await browser.close();
            console.log('PDF generated in memory.');

            // 3. Send Email with PDF attachment
            const emailTemplatePath = join(__dirname, '..', 'templates', 'emailTemplate.html');
            const emailHtmlTemplate = await fs.readFile(emailTemplatePath, 'utf-8');
            const populatedEmailHtml = populateTemplate(emailHtmlTemplate, formData);

            const mailOptions = {
                from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
                to: email,
                subject: `Your Submission Confirmation - ${firstName} ${lastName}`,
                html: populatedEmailHtml,
                attachments: [
                    {
                        filename: `submission_${firstName}_${lastName}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    },
                ],
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully to:', email);

            res.status(200).json({ message: 'Form submitted, PDF generated, and email sent successfully!' });

        } catch (error) {
            console.error('Error processing submission:', error);
            res.status(500).json({ message: 'Server error during submission processing.', error: error.message });
        }
    }
);

export default router;