import { Request, Response } from 'express';
import parse from 'csv-parse/sync';
import xlsx from 'xlsx';
import fs from 'fs';
import promptfoo from 'promptfoo';
import { generateConfig } from '../utils/configGenerator';


export const evaluateHandler = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        let rows: any[] = [];
        const filePath = req.file.path;

        if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            rows = parse.parse(fileContent, { columns: true, skip_empty_lines: true });
        } else if (
            req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            req.file.originalname.endsWith('.xlsx')
        ) {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            rows = xlsx.utils.sheet_to_json(sheet);
        } else {
            return res.status(400).json({ error: 'Unsupported file format. Please upload CSV or Excel.' });
        }

        // Generate Promptfoo configuration
        const config = generateConfig(rows);

        // Run evaluation
        // We strictly use the programmatic API here.
        // We need to register our custom provider manually or ensure promptfoo can find it.
        // A simpler way for custom providers in programmatic usage is passing the provider instance directly if supported,
        // or mapping the provider ID in the config to the actual function.
        // However, promptfoo's evaluate() expects a config object.

        // Workaround: We can't easily register a class instance via simple JSON config for `evaluate`.
        // But we can use the `providers` array in options if we were using the library differently.
        // Let's try to adapt the config to use the registered provider if possible, OR
        // just map the provider ID to an actual instance in the `evaluate` call if supported.

        // Actually, promptfoo allows defining providers as objects in the config.
        // We will instantiate our provider and use a wrapper or register it.
        // For simplicity in this constraints, let's look at how we can pass the provider.

        // We will use a clearer approach: Overwrite the providers list in the config with actual instances 
        // if the library supports it, or use a custom provider module path if we were CLI based.
        // Since we are programmatic:

        // Use file-based provider loading
        const providerPath = require.resolve('../providers/n8nProvider');

        const evaluateConfig = {
            ...config,
            providers: [{
                id: `file://${providerPath}`,
                config: {
                    webhookUrl: process.env.WEBHOOK_URL
                }
            }],
        };

        const results = await promptfoo.evaluate(evaluateConfig as any);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json(results);

    } catch (error: any) {
        console.error('Evaluation error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
