"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
let UserController = exports.UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    all() {
        return this.userService.all();
    }
    get(email) {
        return this.userService.get(email);
    }
    new(dto) {
        return this.userService.new(dto);
    }
};
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({
        description: 'Get all users avaiable',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "all", null);
__decorate([
    (0, common_1.Get)(':email'),
    (0, swagger_1.ApiOperation)({
        description: 'Get a user',
    }),
    (0, swagger_1.ApiParam)({
        name: 'email',
        type: String,
        required: true,
        description: 'Mail of the user',
        example: 'user1@mail.com',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: `User returned correctly<br\>
                  User not found`,
    }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        description: 'Crea un usuario',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateUserDto,
        description: 'Crea un usuario CreateUserDto',
        examples: {
            example1: {
                value: {
                    email: 'user1@mail.com',
                },
            },
            example2: {
                value: {
                    email: 'user2@mail.com',
                    firstName: 'Name2',
                    lastName: 'Last2',
                },
            },
            example3: {
                value: {
                    email: 'user3@mail.com',
                    firstName: 'Name3',
                },
            },
            example4: {
                value: {
                    email: 'user4@mail.com',
                    lastName: 'Last4',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created correctly',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email already in use',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "new", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map