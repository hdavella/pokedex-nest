import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query() queryParameter) {
    console.log(queryParameter);
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') searchTerm: string) {
    return this.pokemonService.findOneService(searchTerm);
  }

  @Patch(':id')
  update(@Param('id') searchTerm: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    
    return this.pokemonService.update(searchTerm, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
