import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as fs from 'fs';


@Injectable()
export class RandomStringService {
  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
}

// TODO: METER ESTE CAMBIO EN EL IMAGENAME/ URL -> NOMBRE .
// La idea es que imageExtension está empty en ceaso de isUsingDefaultUrl está a true.
// En caso de que no, en db solo guardamos el nombre de la imagen dentro dl directorio donde se guardan.
// De esta forma:
// - Ahorramos espacio redundante en db:
// ---- La url default la guardamos en una constante, y le apendeamos la seed para dar la url default completa.
// ---- La url personal la consturimos con la url hacia el contenedor de imagenes estaticas + el nombre de la imagen
// - Dada la peticion de borrado de una imagen, nos basta con mirar la db como se llama esa imagen y la borramos
//   sin ningun procesado extra del directorio de las imagenes estaticas.


// Alñadir una string al modelo de channel en prisma.schema
// Añadir me metes un string
// Me metes un file.
// No ahce falta getter pq se coje la url dela tabla de cnaalaes
// en db la url se tiene que llamar avatar.

// Los endpoints puodrian ser profile-images/user/upload, profile-images/channel/upload_file, profile-images/channel/upload_url etc.
// para diferenciar los distintos post.
//
//
//
//
@Injectable()
export class ProfileImagesService {
    constructor(private prisma: PrismaService,
                private readonly randomStringService: RandomStringService)
    {}

    private default_url: string  = "https://api.dicebear.com/7.x/bottts/svg"
    private static_images_path: string = "/app/static_images"
    private mimeExtensionMap: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/svg+xml': 'svg',
    };

    // To get mime type, if file : Express.Multer.File:
    // file.mimetype, que devuelve 'image/jpeg', 'image/svg' o 'image/png'
    private getFileExtension(file: Express.Multer.File): string {
        const mimeType = file.mimetype;
        if (this.mimeExtensionMap.hasOwnProperty(mimeType)) {
            // Get the file extension based on the provided MIME type
            return this.mimeExtensionMap[mimeType];
        } else {
            throw new HttpException('Unknown MIME type', HttpStatus.BAD_REQUEST);
        }
    }

    private createFullLocalPath(dir: string, userId: string, file_extension: string) {
        return `${this.static_images_path}/${dir}/${userId}.${file_extension}`;
    }

    private createProfileImageUrl(userId: string, file_extension: string) {
        return { imageUrl :  `${process.env.STATIC_IMAGES_URL}/static_images/${userId}.${file_extension}` }
    }

    private createProfileImageUrlDefault(seed: string) {
        return { imageUrl : this.default_url + "?seed=" + seed };
    }

    // fs.promises.unlink no throwea en caso de no existir el path a un archivo.
    // Ver: https://nodejs.org/api/fs.html#fsunlinkpath-callback
    async clearOppositeExtensionImages(type: string, userId: string, file_extension: string) {
        for (const key in this.mimeExtensionMap) {
            if (this.mimeExtensionMap.hasOwnProperty(key) && this.mimeExtensionMap[key] === file_extension) {
                continue;
            }
            // Silenciamos el borrado en caso de no existir.
            const filename = this.createFullLocalPath(type, userId, this.mimeExtensionMap[key])
            await fs.stat(filename, function(err) {
                // Solo borra si existe (err == 'ENOENT' hace que pete.)
                if (err == null) {
                    fs.promises.unlink(filename);
                }
            });
        }
    }

    async createProfileImage(userId: string) {
        const response = await this.prisma.profileImage.create({
            data : {
                userId: userId,
                isUsingDefaultUrl: true,
                imageSeed: this.randomStringService.generateRandomString(20)
            }
        });
        return response;
    }


    // Devolvemos la url a la foto actual.
    // Si la foto es la default, le appendeamos la seed que lleve.
    async getProfileImageUrl(userId: string)
    : Promise< { imageUrl : string }> {
        try {
            const response = await this.prisma.profileImage.findUnique({
                where: {
                    userId: userId
                },
                select: {
                    isUsingDefaultUrl: true,
                    imageExtension: true,
                    imageSeed: true
                }
            });
            if (response.isUsingDefaultUrl == false) {
                return this.createProfileImageUrl(userId, response.imageExtension);
            } else {
                return this.createProfileImageUrlDefault(response.imageSeed);
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new HttpException(
                        'User not found',
                        HttpStatus.NOT_FOUND,);
                }
            }
            throw error;
        }
    }

    // Hacemos que el filename sea el nombre de uid. Por dos razones:
    // 1. No complicarnos
    // 2. Si un usuario se actualiza su imagen, automaticamente reescribe la anterior.
    // 2.1. Se borran todas las fotos de ese usuario previas con extension distinta.
    async uploadProfileImage(userId: string, file : Express.Multer.File)
    : Promise<{ imageUrl : string }>
    {
        try {
            const file_extension = this.getFileExtension(file);
            // Borramos todas las fotos con userId.<extension != extension nueva>
            this.clearOppositeExtensionImages("user", userId, file_extension);
            const path = this.createFullLocalPath("user", userId, file_extension);
            await fs.promises.writeFile(path, file.buffer);
            const response = await this.prisma.profileImage.update({
                where: {
                    userId: userId
                },
                select : {
                    isUsingDefaultUrl: true,
                    imageExtension: true
                },
                data: {
                    isUsingDefaultUrl: false,
                    imageExtension : file_extension
                }
            });
            return this.createProfileImageUrl(userId, response.imageExtension);
        } catch (error) {
            // Si esto crashea, no me parece mal que continue con el throw. En caso de que sea un error conocido,
            // ya estamos devolviendo el error de mime type unknown. Si es otro, pues que se apañen
            throw (error);
        }
    }

    async uploadProfileImageAsFile(Id: string, file : Express.Multer.File, type?: string | "channel")
    {
        try {
            const file_extension = this.getFileExtension(file);
            this.clearOppositeExtensionImages(type, Id, file_extension);
            const path = this.createFullLocalPath(type, Id, file_extension);
            await fs.promises.writeFile(path, file.buffer);
            const response = await this.prisma.channel.update({
                where: {
                    channelId: Id
                },
                data: {
                    avatar : `${process.env.STATIC_IMAGES_URL}/static_images/${Id}.${file_extension}`
                }
            });
            return { imageUrl : response.avatar }
        } catch (error) {
            throw (error);
        }
    }

    async uploadProfileImageAsUrl(Id: string, url: string, type?: string | "channel") {
        try {
            const response = await this.prisma.channel.update({
                where: {
                    channelId: Id
                },
                data: {
                    avatar : url
                }
            });
            return { imageUrl : response.avatar }
        } catch (error) {
            throw (error);
        }
    }

    /* Funcion que lo que hace es cambiar la seed de generacion de la foto default.
       url : https://api.dicebear.com/7.x/bottts/svg es el endpoint de las fotos de bots.
       Haciendo  https://api.dicebear.com/7.x/bottts/svg + ?seed=asdf123, se generan nuevas fotos.
       Si no estas con la foto default, no te updateo nada.
    */
    async rollProfileImage(userId: string)
    : Promise<{ imageUrl : string }>
    {
        const response = await this.prisma.profileImage.update({
            where: {
                userId: userId,
                isUsingDefaultUrl: true
            },
            data: {
                imageSeed: this.randomStringService.generateRandomString(20)
            }
        });
        return this.createProfileImageUrlDefault(response.imageSeed);
    }

    // Esto SOLO deberia usarse en caso de la persona querer volver a usar la default.
    async deleteProfileImage(userId: string)
    : Promise<{ imageUrl : string }>
    {
        // Cojemos el imageExtension
        const check = await this.prisma.profileImage.findUnique({
            where: {
                userId: userId
            },
            select: {
                isUsingDefaultUrl: true,
                imageExtension: true,
                imageSeed: true
            }
        });
        // Borramos solo si no está usando el url default
        if (check.isUsingDefaultUrl == false) {
            await this.prisma.profileImage.update({
                where: {
                    userId: userId
                },
                data: {
                    isUsingDefaultUrl: true,
                    imageExtension: ''
                }
            });
            await fs.promises.unlink(this.createFullLocalPath("user", userId, check.imageExtension))
        }
        return this.createProfileImageUrlDefault(check.imageSeed);
    }

}
