import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  create() {
    return
  }

  @Get()
  findAll() {
    return this.seedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seedService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seedService.remove(+id);
  }
}
