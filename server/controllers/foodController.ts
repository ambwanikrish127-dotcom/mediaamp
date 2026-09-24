import { Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export async function getFoodItems(req: Request, res: Response): Promise<void> {
  try {
    const items = await DataStore.getFoodItems();
    res.json({ success: true, count: items.length, foodItems: items });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch food items.', error: err.message });
  }
}
