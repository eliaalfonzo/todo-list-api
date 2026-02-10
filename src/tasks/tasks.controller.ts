import { Controller, Post, Body, Req, Get, Query, Param, UseGuards, BadRequestException, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tasks') // Categoría en Swagger
@ApiBearerAuth('JWT-auth') // Indica que requiere JWT
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Crear tarea
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    if (!body.nombre || !body.assignedTo) {
      throw new BadRequestException(
        'nombre y assignedTo son obligatorios',
      );
    }

    const userId = req.user.id;

    return this.tasksService.createTask({
      nombre: body.nombre,
      descripcion: body.descripcion,
      storyPoints: body.storyPoints,
      fechaEntrega: body.fechaEntrega,
      assignedTo: body.assignedTo,
      createdBy: userId,
    });
  }

  // Listar tareas
  @ApiOperation({ summary: 'Listar todas las tareas, con filtros opcionales por usuario o estado' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(
    @Query('assignedTo') assignedTo: string,
    @Query('estado') estado: string,
  ) {
    const filters: any = {};
    if (assignedTo) filters.assignedTo = parseInt(assignedTo, 10);
    if (estado) filters.estado = estado;

    return this.tasksService.listTasks(filters);
  }

  // Obtener detalles de tarea
  @ApiOperation({ summary: 'Obtener detalles de una tarea, incluyendo comentarios y categorías' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async details(@Param('id') id: string) {
    return this.tasksService.getTaskDetails(parseInt(id, 10));
  }

  // Actualizar tarea
  @ApiOperation({ summary: 'Actualizar una tarea existente (excepto ID y creador)' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.tasksService.updateTask(parseInt(id, 10), body);
  }

  // Asociar categoría a tarea
  @ApiOperation({ summary: 'Asociar una categoría a una tarea existente' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/categories')
  async addCategory(
    @Param('id') id: string,
    @Body('categoryId') categoryId: number,
  ) {
    return this.tasksService.addCategoryToTask(
      parseInt(id, 10),
      categoryId,
    );
  }

  // Listar categorías NO asociadas a una tarea
  @ApiOperation({ summary: 'Listar categorías que no están asociadas a una tarea' })
  @UseGuards(JwtAuthGuard)
  @Get(':id/categories/not-associated')
  async getCategoriesNotAssociated(@Param('id') id: string) {
    return this.tasksService.getCategoriesNotInTask(parseInt(id, 10));
  }
}