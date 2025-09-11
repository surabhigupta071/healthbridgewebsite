// Load environment variables from a .env file at the very start
import { config } from 'dotenv';
config();

// Import the AI patch analysis flow logic so it runs when this file is loaded
import '@/ai/flows/analyze-patch-flow.ts';
