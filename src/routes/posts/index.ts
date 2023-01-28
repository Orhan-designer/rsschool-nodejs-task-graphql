import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    try {
      return await this.db.posts.findMany();
    } catch (error) {
      reply.statusCode = 404;
      throw reply.notFound();
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | null> {
      try {
        return await this.db.posts.findOne({ key: 'id', equals: request.params.id });
      } catch (error) {
        reply.statusCode = 404;
        throw reply.notFound();
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        return await this.db.posts.create(request.body);
      } catch (error) {
        reply.statusCode = 404;
        throw reply.notFound();
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        return await this.db.posts.delete(request.params.id);
      } catch (error) {
        reply.statusCode = 404;
        throw reply.notFound();
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        return await this.db.posts.change(request.params.id, request.body);
      } catch (error) {
        reply.statusCode = 400;
        throw reply.badRequest();
      }
    }
  );
};

export default plugin;
