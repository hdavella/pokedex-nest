import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ){
    this.defaultLimit = this.configService.getOrThrow("defaultLimit");
  }
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name= createPokemonDto.name.toLowerCase();

    try {
      const pokemon= await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.exceptionHandler(error);
    };
  }

  findAll(paginationDto: PaginationDto) {
    
    const {limit=this.defaultLimit, offset=0}= paginationDto;
    return this.pokemonModel.find().limit(limit).skip(offset).sort({no:1});
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
      this.exceptionHandler(error);
      
    }
  }

  async remove(id: string) {

    const { deletedCount }= await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount=== 0) throw new BadRequestException("No item to delete");
    return;
  }

  private exceptionHandler(error: any) {

    console.log (error);
    if(error.code === 11000) throw new BadRequestException(`Duplicate in db ${JSON.stringify(error.keyValue)}`);
    throw new InternalServerErrorException('Can´t take action, check server log');
  }

}
