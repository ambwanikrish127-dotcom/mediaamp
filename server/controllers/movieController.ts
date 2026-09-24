import { Request, Response } from 'express';
import { DataStore } from '../services/dataStore.js';

export async function getAllMovies(req: Request, res: Response): Promise<void> {
  try {
    const { genre, language, status, search } = req.query;
    const movies = await DataStore.getMovies({
      genre: genre as string,
      language: language as string,
      status: status as string,
      search: search as string
    });
    res.json({ success: true, count: movies.length, movies });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch movies.', error: err.message });
  }
}

export async function getMovieById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const movie = await DataStore.getMovieById(id);

    if (!movie) {
      res.status(404).json({ success: false, message: 'Movie not found.' });
      return;
    }

    // Also attach upcoming shows for this movie
    const shows = await DataStore.getShows({ movieId: id });

    res.json({ success: true, movie, shows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch movie details.', error: err.message });
  }
}

export async function createMovie(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, poster, banner, genre, language, rating, duration, certification, releaseDate, director, cast, status } = req.body;

    if (!title || !description || !poster || !language) {
      res.status(400).json({ success: false, message: 'Title, description, poster, and language are required.' });
      return;
    }

    const movie = await DataStore.createMovie({
      title,
      description,
      poster,
      banner: banner || poster,
      genre: Array.isArray(genre) ? genre : (genre ? genre.split(',').map((g: string) => g.trim()) : ['Drama']),
      language,
      rating: Number(rating) || 8.0,
      duration: duration || '120 min',
      certification: certification || 'UA',
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      director: director || 'Renowned Filmmaker',
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map((c: string) => c.trim()) : ['Featured Cast']),
      status: status || 'NOW_SHOWING'
    });

    res.status(201).json({ success: true, message: 'Movie created successfully.', movie });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create movie.', error: err.message });
  }
}

export async function updateMovie(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await DataStore.updateMovie(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Movie not found.' });
      return;
    }
    res.json({ success: true, message: 'Movie updated successfully.', movie: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update movie.', error: err.message });
  }
}

export async function deleteMovie(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await DataStore.deleteMovie(id);
    if (!success) {
      res.status(404).json({ success: false, message: 'Movie not found.' });
      return;
    }
    res.json({ success: true, message: 'Movie removed from listings.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete movie.', error: err.message });
  }
}
