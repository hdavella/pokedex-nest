import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,

      private readonly httpAdapter: AxiosAdapter,
    ){}

  async executeSeed() {
    
    await this.pokemonModel.deleteMany({});

    const insertPromiseArray= [];
    const data = await this.httpAdapter.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650");
    
    data.results.forEach( ({name, url})=> {
      const segments= url.split('/');
      const no = +segments[segments.length -2];

      insertPromiseArray.push(this.pokemonModel.create({name, no}));
    });

    await Promise.all(insertPromiseArray);
    return "Seed executed";
  }
}
