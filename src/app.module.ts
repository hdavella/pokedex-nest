import { ConfigModule      } from '@nestjs/config';
import { MongooseModule    } from '@nestjs/mongoose';
import { Module            } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join              } from 'path';
import { PokemonModule     } from './pokemon/pokemon.module';
import { CommonModule      } from './common/common.module';
import { SeedModule        } from './seed/seed.module';
import { EnvConfiguration  } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration,],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
    rootPath: join(__dirname,'..','public'),
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
    ],
  controllers: [],
  providers: [PokemonModule],
})
export class AppModule {}
