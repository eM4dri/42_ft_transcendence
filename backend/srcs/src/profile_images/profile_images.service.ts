import { Injectable} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';


@Injectable()
export class ProfileImagesService {
    constructor(private prisma: PrismaService)
    {}

    /*
     * Hay un tema aqui un tanto kafkiano y es que el puto navegador te cachea la imagen
     * que pilla de la url. Nosotros, actualmente, no cambiamos la url, si no el contenido que
     * hay en esa url.
     * Esto no funciona.
     * Procedemos a usar el flipFlah para ir revertiendo la string cada vez que la guardamos.
     * Habia otros fixes pero este es igual de controvertido que el error que intentamos resolver
     */

    // private default_url: string  = "https://api.dicebear.com/7.x/bottts/svg?seed=72634127497"
    private static_images_path: string = "/app/static_images"
    private mimeExtensionMap: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/svg+xml': 'svg',
    };

    private createFullLocalPath(dir: string, Id: string, file_extension: string, flipFlag : boolean) {
        return `${this.static_images_path}/${dir}/${flipFlag ? Id.split("").reverse().join("") : Id}.${file_extension}`;
    }

    private async deleteFileIfItExists(filename : string) : Promise<boolean> {
        try {
            await fs.promises.stat(filename);
            await fs.promises.unlink(filename);
            return true; // File existed and was deleted
        } catch (err) {
            if (err.code === 'ENOENT') {
                return false; // File did not exist
            } else {
                throw err; // ??
            }
        }
    }


    // Ver: https://nodejs.org/api/fs.html
    // Si no me dan una file extension, fulmino todas las posibles.
    async clearOtherImages(type: string, userId: string) {

        var flipFlag : boolean;
        for (const key in this.mimeExtensionMap) {
            { // case flipFlag = true
                flipFlag = true;
                const filename = this.createFullLocalPath(type, userId, this.mimeExtensionMap[key], flipFlag);
                const fileWasDeleted = await this.deleteFileIfItExists(filename);
                if (fileWasDeleted) break;
            }
            { // case flipFlag = false
                flipFlag = false;
                const filename = this.createFullLocalPath(type, userId, this.mimeExtensionMap[key], flipFlag);
                const fileWasDeleted = await this.deleteFileIfItExists(filename);
                if (fileWasDeleted) break;
            }
        }
        return flipFlag;
    }

    async uploadProfileImageAsFile(Id: string, file : Express.Multer.File, type: string )
    : Promise<{ imageUrl : string }>
    {
        try {
            // El mimetype está wardeado por el FileTypeValidator del controller.
            const file_extension = this.mimeExtensionMap[file.mimetype];
            const flipFlag = await this.clearOtherImages(type, Id);
            // creamos el path pero asegurandonos de hacerle flip al id
            const path = this.createFullLocalPath(type, Id, file_extension, !flipFlag);
            await fs.promises.writeFile(path, file.buffer);
            var response;
            if (type == "channel") {
                response = await this.prisma.channel.update({
                    where: {
                        channelId: Id
                    },
                    data: {
                        avatar : `${process.env.STATIC_IMAGES_URL}/static_images/${type}/${!flipFlag ? Id.split("").reverse().join("") : Id}.${file_extension}`
                    }
                });
            } else {
                response = await this.prisma.user.update({
                    where: {
                        userId: Id
                    },
                    data: {
                        avatar : `${process.env.STATIC_IMAGES_URL}/static_images/${type}/${!flipFlag ? Id.split("").reverse().join("") : Id}.${file_extension}`
                    }
                });
            }
            return { imageUrl : response.avatar };
        } catch (error) {
            throw (error);
        }
    }

    async uploadProfileImageAsUrl(Id: string, url: string, type: string)
    : Promise<{ imageUrl : string }>
    {
        this.clearOtherImages(type, Id);
        try {
            var response;
            if (type == "channel") {
                response = await this.prisma.channel.update({
                    where: {
                        channelId: Id
                    },
                    data: {
                        avatar : url
                    }
                });
            } else {
                response = await this.prisma.user.update({
                    where: {
                        userId: Id
                    },
                    data: {
                        avatar : url
                    }
                });
            }
            return { imageUrl : response.avatar }
        } catch (error) {
            throw (error);
        }
    }

}
