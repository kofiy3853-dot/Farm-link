import cron from 'node-cron';
import { prisma } from '../../config/prisma.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../config/logger.js';
import crypto from 'crypto';

// Initialize Gemini (Will gracefully fail/skip if no API key is provided)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Categories to map news into
const CATEGORIES = ['Crops', 'Livestock', 'Market Prices', 'Weather', 'Pest & Disease', 'Government Policies', 'Agri Technology'];

/**
 * Summarize article content using Gemini
 */
async function summarizeArticle(content: string, title: string): Promise<{ summary: string, category: string }> {
    if (!genAI || !content) {
        // Fallback if no AI or empty content
        return {
            summary: content ? content.substring(0, 150) + '...' : 'Agriculture update.',
            category: 'Crops' // Default
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        You are an agriculture expert summarizing news for farmers.
        Read the following news article title and content.
        1. Summarize it into 2-3 short, clear sentences suitable for a farmer.
        2. Categorize it exactly into ONE of the following: ${CATEGORIES.join(', ')}.

        Title: ${title}
        Content: ${content.substring(0, 3000)} // Using first 3000 chars

        Format your response EXACTLY like this:
        CATEGORY: [Your chosen category]
        SUMMARY: [Your 2-3 sentence summary]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const catMatch = text.match(/CATEGORY:\s*(.+)/i);
        const sumMatch = text.match(/SUMMARY:\s*(.+)/is);

        let category = (catMatch && catMatch[1]) ? catMatch[1].trim() : 'Crops';
        let summary = (sumMatch && sumMatch[1]) ? sumMatch[1].trim() : text.substring(0, 150) + '...';

        // Ensure valid category
        if (!CATEGORIES.includes(category)) category = 'Crops';

        return { category, summary };
    } catch (error) {
        logger.error(`Gemini summarization failed: ${error}`);
        return { summary: (content || '').substring(0, 150) + '...', category: 'Crops' };
    }
}

/**
 * Fetch and process news
 */
export async function fetchAndProcessNews() {
    logger.info('Starting Agric-News fetch cycle...');
    try {
        // MOCK: In a real scenario, we'd fetch from NewsAPI or an RSS feed.
        // E.g., const res = await fetch(`https://newsapi.org/v2/everything?q=agriculture&apiKey=${process.env.NEWS_API_KEY}`);

        // Since we don't have configured API keys, let's mock the layout of a fetched API array
        // to demonstrate the processing, summarization, and upsert logic.
        const mockFetchedArticles = [
            {
                title: "New Drought-Resistant Maize Variety Released in West Africa",
                description: "Researchers have introduced a new strain of maize that requires 40% less water, a major breakthrough for regions experiencing prolonged dry spells. The new seed is expected to roll out to local distributors by next month.",
                content: "Full content about the maize variety released by the agriculture institute...",
                url: "https://example.com/news/drought-maize-" + Date.now(), // Dynamic URL to prevent DB unique blocks on run
                urlToImage: "https://images.unsplash.com/photo-1595856461944-cedb9691b0bc?q=80&w=600&auto=format&fit=crop",
                source: "AgriTech Daily",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Fall Armyworm Outbreak Detected in Ashanti Region",
                description: "Farmers in the Ashanti region are advised to inspect their farms immediately as a severe outbreak of Fall Armyworm has been reported. The Ministry of Agriculture is deploying teams to assist with pesticides.",
                content: "Full content detailing the armyworm outbreak and pesticide distribution efforts...",
                url: "https://example.com/news/armyworm-alert-" + Date.now(),
                urlToImage: "https://images.unsplash.com/photo-1599388370776-47b22a0ec163?q=80&w=600&auto=format&fit=crop",
                source: "Ghana News Agency",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Cocoa Prices Surge 15% Amidst Global Shortage Concerns",
                description: "International cocoa prices hit a 5-year high today as reports of lower-than-expected harvests in major producing countries hit the market.",
                content: "Full financial report on cocoa market trends...",
                url: "https://example.com/news/cocoa-surge-" + Date.now(),
                urlToImage: "https://images.unsplash.com/photo-1542844222-29fcff03f19e?q=80&w=600&auto=format&fit=crop",
                source: "Global Market Times",
                publishedAt: new Date().toISOString()
            }
        ];

        let processedCount = 0;

        for (const article of mockFetchedArticles) {
            // Check if URL already exists to prevent duplicate processing
            const exists = await prisma.agricNews.findUnique({ where: { url: article.url } });
            if (exists) continue;

            // Generate AI Summary and Category
            const { summary, category } = await summarizeArticle(article.description || article.content, article.title);

            // Save to DB
            await prisma.agricNews.create({
                data: {
                    title: article.title,
                    summary: summary,
                    content: article.content,
                    source: article.source,
                    image: article.urlToImage,
                    url: article.url,
                    category: category,
                    region: 'Overall', // Can be dynamically mapped via AI too
                    published_at: new Date(article.publishedAt)
                }
            });
            processedCount++;
        }

        logger.info(`Agric-News fetch cycle complete. Processed ${processedCount} new articles.`);
    } catch (error) {
        logger.error(`Error during Agric-News fetch cycle: ${error}`);
    }
}

/**
 * Initialize Background Scheduler (Every 12 Hours)
 */
export function initNewsScheduler() {
    // Run at 00:00 and 12:00 every day
    cron.schedule('0 0,12 * * *', () => {
        fetchAndProcessNews();
    });

    logger.info('Agric-News background scheduler initialized (runs every 12 hours).');

    // Optional: Run once on startup for initial data pop
    setTimeout(() => {
        fetchAndProcessNews();
    }, 5000);
}
