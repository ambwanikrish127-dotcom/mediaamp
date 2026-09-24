import { Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export async function getAllTheatres(req: Request, res: Response): Promise<void> {
  try {
    const { city, search } = req.query;
    const theatres = await DataStore.getTheatres({
      city: city as string,
      search: search as string
    });
    res.json({
      success: true,
      count: theatres.length,
      theatres
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch theatres.', error: err.message });
  }
}

export async function getTheatreById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const theatre = await DataStore.getTheatreById(id);
    if (!theatre) {
      res.status(404).json({ success: false, message: 'Theatre not found.' });
      return;
    }
    res.json({ success: true, theatre });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch theatre details.', error: err.message });
  }
}

export async function createTheatre(req: Request, res: Response): Promise<void> {
  try {
    const { name, city, address, location, facilities, images, totalScreens, status } = req.body;
    if (!name || !city) {
      res.status(400).json({ success: false, message: 'Theatre name and city are required.' });
      return;
    }

    const theatre = await DataStore.createTheatre({
      name,
      city,
      address: address || location || `${name}, ${city}`,
      location: location || address || `${name}, ${city}`,
      facilities: facilities || ['Dolby Atmos', '4K Projection', 'Recliners'],
      images: images || ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'],
      totalScreens: totalScreens || 2,
      status: status || 'ACTIVE'
    });

    res.status(201).json({ success: true, message: 'Theatre registered successfully.', theatre });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create theatre.', error: err.message });
  }
}
