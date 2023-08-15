"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true
    }));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Products')
        .setDescription('This is my description')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('swagger', app, document, {
        swaggerOptions: {
            filter: true,
            showRequestDuration: true,
        },
    });
    await app.listen(3333);
}
bootstrap();
//# sourceMappingURL=main.js.map