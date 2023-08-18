import axios from 'axios';
import { IGif, ITenorResponse } from '../models';

export default class TenorService {
  private static url = 'https://g.tenor.com/v1';

  // Return 20 gifs from tenor
  static async search(term: string): Promise<IGif[]> {
    console.log('Calling TenorService.search');
    return await axios
      .get<ITenorResponse>(`${this.url}/search?q=${term}&key=${process.env.TENOR_TOKEN}`)
      .then((response) => {
        return response.data.results;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
}
