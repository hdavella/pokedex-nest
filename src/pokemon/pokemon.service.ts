import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ){}
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name= createPokemonDto.name.toLowerCase();

    try {
      const pokemon= await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      console.log (error);
      if(error.code === 11000) throw new BadRequestException(`Duplicate pokemon in db ${JSON.stringify(error.keyValue)}`);
      throw new InternalServerErrorException('Can´t create Pokemon, check server log');
    };
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOneService(searchTerm: string) {
    let pokemon: Pokemon;
    if(!isNaN(+searchTerm)){
      pokemon= await this.pokemonModel.findOne({no:searchTerm})
    };

    if(isValidObjectId(searchTerm)){
      pokemon= await this.pokemonModel.findById(searchTerm);
    };

    if(!pokemon){
      pokemon= await this.pokemonModel.findOne({name: searchTerm.toLowerCase().trim()})
    };

    if(!pokemon) throw new NotFoundException(`Pokemon not found`);
    return pokemon;
  }

  async update(searchTerm: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon= await this.findOneService(searchTerm);
    try {

      if(updatePokemonDto.name) updatePokemonDto.name= updatePokemonDto.name.toLowerCase();
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
      console.log("Duplicate key in db");
      console.log (error);
      if(error.code === 11000) throw new BadRequestException(`Can´t update Pokemon, duplicate in db ${JSON.stringify(error.keyValue)}`);
      throw new InternalServerErrorException('Can´t update Pokemon, check server log');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
