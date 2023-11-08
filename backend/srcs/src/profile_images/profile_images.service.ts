import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as fs from 'fs';


@Injectable()
export class ProfileImagesService {
    constructor(private prisma: PrismaService)
    {}

    private default_url: string  = "https://api.dicebear.com/7.x/bottts/svg"
    private static_images_path: string = "/app/static_images"
    private mimeExtensionMap: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/svg+xml': 'svg',
    };

    private createFullLocalPath(dir: string, userId: string, file_extension: string) {
        return `${this.static_images_path}/${dir}/${userId}.${file_extension}`;
    }

    // Ver: https://nodejs.org/api/fs.html
    // Si no me dan una file extension, fulmino todas las posibles.
    async clearOppositeExtensionImages(type: string, userId: string, file_extension?: string | "all") {
        for (const key in this.mimeExtensionMap) {
            if (file_extension != "all"
                && this.mimeExtensionMap.hasOwnProperty(key)
                && this.mimeExtensionMap[key] === file_extension) {
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

    async uploadProfileImageAsFile(Id: string, file : Express.Multer.File, type: string )
    {
        try {
            // El mimetype está wardeado por el FileTypeValidator del controller.
            const file_extension = this.mimeExtensionMap[file.mimetype];
            this.clearOppositeExtensionImages(type, Id, file_extension);
            const path = this.createFullLocalPath(type, Id, file_extension);
            await fs.promises.writeFile(path, file.buffer);
            var response;
            if (type == "channel") {
                response = await this.prisma.channel.update({
                    where: {
                        channelId: Id
                    },
                    data: {
                        avatar : `${process.env.STATIC_IMAGES_URL}/static_images/${Id}.${file_extension}`
                    }
                });
            } else {
                response = await this.prisma.user.update({
                    where: {
                        userId: Id
                    },
                    data: {
                        avatar : `${process.env.STATIC_IMAGES_URL}/static_images/${Id}.${file_extension}`
                    }
                });
            }
            return { imageUrl : response.avatar };
        } catch (error) {
            throw (error);
        }
    }

    async uploadProfileImageAsUrl(Id: string, url: string, type: string) {
        this.clearOppositeExtensionImages(type, Id);
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
